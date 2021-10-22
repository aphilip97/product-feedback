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

type CommentPatchBody = Optional<
  Pick<
    Comment, 'content'
  >
>;

const readComments: NextApiHandler<
  PartialComment[] | Error
> = async (req, res) => {

  return tryCatch(res, async () => {

    // Extract values
    const feedback_id = req.query.id;
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
        'E.g. GET /comments/<id> .',
        '',
        'NOTE: <id> is the id of a feedback item.',
      ].join(' '),
    );

    if (feedback_id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter feedback id cannot be empty.',
    );

    if (page instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      'Duplicate query parameter.',
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
        feedback_id: feedback_id,
        parent_id: null,
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

const createComment: NextApiHandler<
  Comment | Error
> = async (req, res) => {

  return tryCatch(res, async () => {

    // Extract query parameters
    const feedback_id = req.query.id;

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
      'Path parameter feedback id cannot be empty.',
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
        parent_id: null,
      },
    });

    return res.status(200).send(comment);

  });

};

const commentPatchValidate: Validate<CommentPatchBody> = (
  res,
  obj,
) => {

  const {
    content = '',
  } = obj;

  const errors: String[] = [];

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
    content,
  };

};

const updateComment: NextApiHandler<
  Comment | Error
> = async (req, res) => {

  return tryCatch(res, async () => {

    // Extract the query parameters
    const id = req.query.id;

    // Validate query parameters
    if (id instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      [
        'Duplicate param <id>.',
        'Only include this in the req path.',
        'E.g. PATCH /comments/<id> .',
        '',
        'NOTE: <id> is the id of a comment.',
      ].join(' '),
    );

    if (id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter feedback id cannot be empty.',
    );

    const commentToUpdate = await db.comment.findUnique({
      where: {
        id,
      },
    });

    if (commentToUpdate === null) return customError(
      res,
      404,
      'Not Found',
      'Comment to update does not exist.',
    );

    // Parse request body
    const body = parseReqBody<CommentPatchBody>(res, req.body);
    if (body === null) return;

    // Validate request body
    const values = commentPatchValidate(res, body);
    if (values === null) return;

    const comment = await db.comment.update({
      data: {
        ...values,
      },
      where: {
        id,
      },
    });

    return res.status(200).send(comment);

  });

};

const deleteComment: NextApiHandler<
  Comment | Error
> = async (req, res) => {

  return tryCatch(res, async () => {

    // Extract the query parameters
    const id = req.query.id;

    // Validate query parameters
    if (id instanceof Array) return customError(
      res,
      400,
      'Bad Request',
      [
        'Duplicate param <id>.',
        'Only include this in the req path.',
        'E.g. DELETE /comments/<id> .',
        '',
        'NOTE: <id> is the id of a comment.',
      ].join(' '),
    );

    if (id.length === 0) return customError(
      res,
      400,
      'Bad Request',
      'Path parameter feedback id cannot be empty.',
    );

    const commentToDelete = await db.comment.findUnique({
      where: {
        id,
      },
    });

    if (commentToDelete === null) return customError(
      res,
      404,
      'Not Found',
      'Comment to delete does not exist.',
    );

    const comment = await db.comment.delete({
      where: {
        id,
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

    case 'POST': return await createComment(req, res);

    case 'PATCH': return await updateComment(req, res);

    case 'DELETE': return await deleteComment(req, res);

    default: return customError(
      res,
      501,
      'Not Implemented',
      `${req.method} /api/comment/${
        req.query.id ?? ''
      } is not implemented.`,
    );

  }

};

export default handler;
