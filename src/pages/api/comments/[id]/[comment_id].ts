import type {
  Comment,
} from '@prisma/client';

import type {
  NextApiHandler,
} from "next";

import type {
  Optional,
  Validate,
} from '../../../../../types';

import {
  customError,
  parseReqBody,
  tryCatch,
} from "../../../../util/api/middleware";

import db from '../../../../lib/prisma';

type PartialComment = Omit<
  Comment, 'feedback_id' | 'parent_id'
>;

type CommentPostBody = Optional<
  Omit<
    Comment, 'id' | 'feedback_id' | 'parent_id'
  >
>;

const readComments: NextApiHandler<
  PartialComment[] | Error
> = async (req, res) => {

  return tryCatch(res, async () => {

    // Extract values
    const feedback_id = req.query.id;
    const parent_id = req.query.comment_id;
    const page = req.query.page;
    const limit = 5;

    // Validate
    if (feedback_id instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      [
        'Duplicate param <id>.',
        'Only include this in the req path.',
        'E.g. GET /comments/<id>/<comment_id> .',
        '',
        'NOTE: <id> is the id of a feedback item.',
      ].join(' '),
    );

    if (feedback_id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter <id> cannot be empty.',
    );

    if (parent_id instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      [
        'Duplicate param <comment_id>.',
        'Only include this in the req path.',
        'E.g. GET /comments/<id>/<comment_id> .',
        '',
        'NOTE: <id> is the id of a feedback item.',
      ].join(' '),
    );

    if (parent_id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter <comment_id> cannot be empty.',
    );

    if (page instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      'Duplicate query parameter `page`.',
    );

    // Specify return fields
    const fields = {
      id: true,
      content: true,
      author_name: true,
      author_username: true,
    };

    // Query the database
    const comments = await db.comment.findMany({
      where: {
        feedback_id,
        parent_id,
      },
      select: {
        ...fields,
        _count: true,
        comment: {
          take: limit,
          select: {
            ...fields,
            _count: true,
            comment: {
              take: limit,
              select: {
                ...fields,
                _count: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: (limit * (Number(page ?? 1) - 1)),
    });

    return res.status(200).send(comments);

  });

};

const commentPostValidate: Validate<CommentPostBody> = (
  res,
  obj,
) => {

  const {
    content = '',
    author_name = '',
    author_username = '',
  } = obj;

  const errors: String[] = [];

  if (content.length === 0) {
    errors.push('Content cannot be empty.');
  }

  // TODO: This check can be removed once auth is implemented
  if (author_name.length === 0) {
    errors.push('Missing author name. Unauthorized. Login.');
  }

  // TODO: This check can be removed once auth is implemented
  if (author_username.length === 0) {
    errors.push('Missing author name. Unauthorized. Login.');
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
    content,
    author_name,
    author_username,
  };

};

const createNestedComment: NextApiHandler<
  Comment | Error
> = async (req, res) => {

  return tryCatch(res, async () => {

    // Extract query parameters
    const feedback_id = req.query.id;
    const parent_id = req.query.comment_id;

    // Validate query parameters
    if (feedback_id instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      [
        'Duplicate param <id>.',
        'Only include this in the req path.',
        'E.g. POST /comments/<id> .',
        '',
        'NOTE: <id> is the id of a feedback item.',
      ].join(' '),
    );

    if (feedback_id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter <id> cannot be empty.',
    );

    if (parent_id instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      [
        'Duplicate param <comment_id>.',
        'Only include this in the req path.',
        'E.g. POST /comments/<id>/<comment_id> .',
        '',
        'NOTE: <id> is the id of a feedback item.',
      ].join(' '),
    );

    if (parent_id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter <comment_id> cannot be empty.',
    );

    // Parse request body
    const body = parseReqBody<CommentPostBody>(res, req.body);
    if (body === null) return;

    // Validate body
    const values = commentPostValidate(res, body);
    if (values === null) return;

    // Insert into database
    const comment = await db.comment.create({
      data: {
        ...values,
        feedback_id,
        parent_id,
      },
    });

    return res.status(200).send(comment);

  });

};

const handler: NextApiHandler<
  Comment | PartialComment[] | Error
> = async (req, res) => {

  switch (req.method) {

    case 'GET': return await readComments(req, res);

    case 'POST': return await createNestedComment(req, res);

    default: return customError(
      res,
      501,
      'Not Implemented',
      `${req.method} /api/comment/${
        req.query.id ?? ''
      }/${
        req.query.comment_id ?? ''
      } is not implemented.`,
    );

  }

};

export default handler;
