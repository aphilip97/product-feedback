import type {
  Feedback,
} from '@prisma/client';

import type {
  NextApiHandler,
} from 'next';

import type {
  PatchBody
} from '../../../../types';

import {
  customError,
  parseReqBody,
  tryCatch,
} from '../../../util/api/middleware';

import db from '../../../lib/prisma';

const patchFeedback: NextApiHandler<
  Feedback | Error
> = async (req, res) => {

  return tryCatch(res, async () => {

    const { id } = req.query;

    if (id instanceof Array) {
      return customError(
        res,
        400,
        'Bad Request',
        'Expected 1 path parameter & 0 query parameters.',
      );
    }

    /*
      No need to check if id is an empty string because if it is
      it would be handled by the /api/feedback route instead of
      the /api/feedback/[id] route handler (the handlers in this
      file).
    */

    const body = parseReqBody<PatchBody>(res, req.body);

    if (body === null) return;

    const {
      title,
      category,
      status,
      content,
    } = body;

    const updatedFeedback = await db.feedback.update({
      where: {
        id,
      },
      data: {
        title,
        category,
        status,
        content,
      }
    });

    return res.status(200).send(updatedFeedback);

  });

};

const deleteFeedback: NextApiHandler<
  Feedback | Error
> = async (req, res) => {

  tryCatch(res, async () => {

    const { id } = req.query;

    if (id instanceof Array) {
      return customError(
        res,
        400,
        'Bad Request',
        'Expected only 1 path parameter & 0 query parameters.',
      )
    }

    /*
      No need to check if id is an empty string because if it is
      it would be handled by the /api/feedback route instead of
      the /api/feedback/[id] route handler (the handlers in this
      file).
    */

    const deletedFeedback = await db.feedback.delete({
      where: {
        id,
      },
    });

    res.status(200).send(deletedFeedback);

  });

};

const handlerFeedbackById: NextApiHandler<
  Feedback | Feedback[] | Error
> = async (req, res) => {

  switch (req.method) {

    case 'PATCH': return await patchFeedback(req, res);

    case 'DELETE': return await deleteFeedback(req, res);

    default: return customError(
      res,
      501,
      'Not Implemented',
      `${req.method} /api/feedback is not implemented.`
    );

  }

};

export default handlerFeedbackById;
