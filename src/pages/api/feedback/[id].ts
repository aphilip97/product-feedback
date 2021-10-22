import type {
  Feedback,
} from '@prisma/client';

import type {
  NextApiHandler,
} from 'next';

import type {
  PatchBody,
  Validate,
} from '../../../../types';

import {
  customError,
  parseReqBody,
  tryCatch,
} from '../../../util/api/middleware';

import db from '../../../lib/prisma';

const feedbackPatchValidate: Validate<PatchBody> = (
  res,
  obj,
) => {

  const {
    title = '',
    category = '',
    status = '',
    content = '',
  } = obj;

  const errors: String[] = [];

  const categories = [
    'UI',
    'UX',
    'Enhancement',
    'Bug',
    'Feature',
  ];

  const statuses = [
    'Suggestion',
    'Planned',
    'In-Progress',
    'Live',
  ];

  if (title.length === 0) {
    errors.push('Title cannot be empty.');
  }

  if (!categories.includes(category)) {
    errors.push('Category does not exist.');
  }

  if (!statuses.includes(status)) {
    errors.push('Status does not exist.');
  }

  if (content.length === 0) {
    errors.push('Content cannot be empty.');
  }

  if (errors.length !== 0) {
    customError(
      res,
      400,
      'Bad Request',
      errors.join('\n'),
    );
    return null;
  }

  return {
    title,
    category,
    status,
    content,
  };

};

const updateFeedback: NextApiHandler<
  Feedback | Error
> = async (req, res) => {

  return tryCatch(res, async () => {

    // Extract query parameters
    const { id } = req.query;

    // Validate query parameters
    if (id instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      [
        'Duplicate param <id>.',
        'Only include this in the req path.',
        'E.g. GET /feedback/<id> .',
        '',
        'NOTE: <id> is the id of a feedback item.',
      ].join(' '),
    );

    if (id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter <id> cannot be empty.',
    );

    // Check if feedback to update exists
    const feedbackToUpdate = await db.feedback.findUnique({
      where: {
        id,
      },
    });

    if (feedbackToUpdate === null) return customError(
      res,
      404,
      'Not Found',
      'Feedback to update does not exist.',
    );

    // Parse request body
    const body = parseReqBody<PatchBody>(res, req.body);
    if (body === null) return;

    // Validate request body
    const values = feedbackPatchValidate(res, body);
    if (values === null) return;

    // Update the feedback record in the database
    const updatedFeedback = await db.feedback.update({
      data: {
        ...values,
      },
      where: {
        id,
      },
    });

    return res.status(200).send(updatedFeedback);

  });

};

const deleteFeedback: NextApiHandler<
  Feedback | Error
> = async (req, res) => {

  tryCatch(res, async () => {

    // Extract query parameters
    const { id } = req.query;

    // Validate query parameters
    if (id instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      [
        'Duplicate param <id>.',
        'Only include this in the req path.',
        'E.g. GET /feedback/<id> .',
        '',
        'NOTE: <id> is the id of a feedback item.',
      ].join(' '),
    );

    if (id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter <id> cannot be empty.',
    );

    // Check if feedback to delete exists
    const feedbackToDelete = await db.feedback.findUnique({
      where: {
        id,
      },
    });

    if (feedbackToDelete === null) return customError(
      res,
      404,
      'Not Found',
      'Feedback to delete does not exist.',
    );

    // Delete the feedback record from the database
    const deletedFeedback = await db.feedback.delete({
      where: {
        id,
      },
    });

    return res.status(200).send(deletedFeedback);

  });

};

const handlerFeedbackById: NextApiHandler<
  Feedback | Feedback[] | Error
> = async (req, res) => {

  switch (req.method) {

    case 'PATCH': return await updateFeedback(req, res);

    case 'DELETE': return await deleteFeedback(req, res);

    default: return customError(
      res,
      501,
      'Not Implemented',
      `${req.method} /api/feedback is not implemented.`,
    );

  }

};

export default handlerFeedbackById;
