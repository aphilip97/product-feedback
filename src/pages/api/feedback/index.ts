import type {
  Feedback,
} from '@prisma/client';

import type {
  NextApiHandler,
} from 'next';

import type {
  Optional,
  Validate,
} from '../../../../types';

import {
  customError,
  parseReqBody,
  tryCatch,
} from '../../../util/api/middleware';

import db from '../../../lib/prisma';

type FeedbackPostBody = Optional<
  Omit<
    Feedback, 'id' | 'status'
  >
>;

const readFeedbackItems: NextApiHandler<
  Feedback[] | Error
> = async (req, res) => {

  tryCatch(res, async () => {

    // Extract query parameters
    const limit = 5;
    const { page } = req.query;

    // Validate query parameters
    if (page instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      'Duplicate query parameter.',
    );

    // Query the database
    const feedbacks = await db.feedback.findMany({
      take: limit,
      skip: (limit * (Number(page ?? 1) - 1)),
    });

    return res.status(200).send(feedbacks);

  });

};

const feedbackPostValidate: Validate<FeedbackPostBody> = (
  res,
  obj,
) => {

  const {
    title = '',
    category = '',
    content = '',
  } = obj;

  const categories = [
    'UI',
    'UX',
    'Enhancement',
    'Bug',
    'Feature',
  ];

  const errors: String[] = [];

  if (title.length === 0) {
    errors.push('Title cannot be empty.');
  }

  if (!categories.includes(category)) {
    errors.push('Category does not exist.');
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
    content,
  };

};

const createFeedback: NextApiHandler<
  Feedback | Error
> = async (req, res) => {

  tryCatch(res, async () => {

    // Parse request body
    const body = parseReqBody<FeedbackPostBody>(res, req.body);
    if (body === null) return;

    // Validate request body
    const values = feedbackPostValidate(res, body);
    if (values === null) return;

    // Defaults
    const status = 'Suggestion';

    // Insert into database
    const feedback = await db.feedback.create({
      data: {
        ...values,
        status,
      },
    });

    return res.status(200).send(feedback);

  });

};

const handlerFeedback: NextApiHandler<
  Feedback | Feedback[] | Error
> = async (req, res) => {

  switch (req.method) {

    case 'GET': await readFeedbackItems(req, res); break;

    case 'POST': await createFeedback(req, res); break;

    default: return customError(
      res,
      501,
      'Not Implemented',
      `${req.method} /api/feedback is not implemented.`,
    );

  }

};

export default handlerFeedback;
