import type {
  Feedback,
} from '@prisma/client';

import type {
  NextApiHandler,
} from 'next';

import {
  customError,
  parseReqBody,
  tryCatch,
} from '../../../util/api/middleware';

import db from '../../../lib/prisma';

type PostBody = {
  title: string;
  category: string;
  content: string;
};

const getFeedbackItems: NextApiHandler<
  Feedback[] | Error
> = async (req, res) => {

  tryCatch(res, async () => {

    // Extract values
    const limit = 5;
    const { page } = req.query;

    // Validate
    if (page instanceof Array) {
      return customError(
        res,
        400,
        'Bad Request',
        'Duplicate query parameter.',
      );
    }

    // Fetch the things
    const feedbacks = await db.feedback.findMany({
      take: limit,
      skip: (limit * (Number(page ?? 1) - 1)),
    });

    return res.status(200).send(feedbacks);

  });

};

const postFeedback: NextApiHandler<
  Feedback | Error
> = async (req, res) => {

  tryCatch(res, async () => {

    // Extract values
    const body = parseReqBody<PostBody>(res, req.body);

    if (body === null) return;

    const {
      title,
      category,
      content,
    } = body;

    const defaultStatus = 'Suggestion';

    const categories = [
      'UI',
      'UX',
      'Enhancement',
      'Bug',
      'Feature',
    ];

    const errors: String[] = [];

    // Validate
    if (title.length === 0) {
      errors.push('Title cannot be empty.');
    }

    if (!categories.includes(category)) {
      errors.push('Invalid category.');
    }

    if (content.length === 0) {
      errors.push('Content cannot be empty.');
    }

    if (errors.length !== 0) {
      return customError(
        res,
        400,
        'Bad Request',
        errors.join('\n'),
      );
    }

    // Insert into database
    const feedback = await db.feedback.create({
      data: {
        title,
        content,
        category,
        status: defaultStatus,
      },
    });

    return res.status(200).send(feedback);

  });

};

const handlerFeedback: NextApiHandler<
  Feedback | Feedback[] | Error
> = async (req, res) => {

  switch (req.method) {

    case 'GET': await getFeedbackItems(req, res); break;

    case 'POST': await postFeedback(req, res); break;

    default: return customError(
      res,
      501,
      'Not Implemented',
      `${req.method} /api/feedback is not implemented.`
    );

  }

};

export default handlerFeedback;
