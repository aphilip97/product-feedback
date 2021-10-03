import type { Post } from '@prisma/client';
import type { NextApiHandler } from 'next';

import db from '../../lib/prisma';
import {
  customError,
  parseReqBody,
} from '../../util/api/middleware';

type PostBody = {
  title: string;
  category: string;
  content: string;
};

const getFeedback: NextApiHandler<
  Post[]
> = async (req, res) => {
  const limit = 5;
  const { page } = req.query;
  const posts = await db.post.findMany({
    take: limit,
    skip: (limit * (Number(page ?? 1) - 1)),
  });
  return res.status(200).send(posts);
};

const postFeedback: NextApiHandler<
  Post | Error
> = async (req, res) => {

  try {

    // Extract values
    const body: PostBody | null = parseReqBody<
      PostBody
    >(req.body);

    if (body === null) {
      return customError(
        res,
        400,
        'Bad request',
        'Request body is missing.',
      );
    }

    const {
      title,
      category,
      content,
    } = body;

    const defaultStatus = "Suggestion";

    const categories = [
      "UI",
      "UX",
      "Enhancement",
      "Bug",
      "Feature",
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

    const post = await db.post.create({
      data: {
        title,
        content,
        category,
        status: defaultStatus,
      },
    });

    return res.status(200).send(post);

  } catch (err) {
    return customError(
      res,
      500,
      "Internal Server Error",
      "Something went wrong.",
    );
  }

};

const handler: NextApiHandler<
  Post | Post[] | Error
> = async (req, res) => {
  switch (req.method) {
    case 'GET': return await getFeedback(req, res);
    case 'POST': return await postFeedback(req, res);
    default: return res.status(501).end();
  }
};

export default handler;
