import type {
  NextApiResponse,
} from 'next';

export const parseReqBody = <
  T
>(
  res: NextApiResponse,
  body: any,
): T | null => {
  try {
    if (typeof body === 'string') {
      return JSON.parse(body);
    } else if (typeof body === 'object') {
      if (Object.keys(body).length === 0) {
        customError(
          res,
          400,
          'Bad Request',
          'Request body is empty.',
        );
        return null;
      }
      return body;
    }
    return null;
  } catch (e) {
    customError(
      res,
      400,
      'Bad Request',
      `Malformed JSON in request body. ${e.name} ${e.message}`,
    );
    return null
  }
};

export const customError = (
  res: NextApiResponse<Error>,
  code: number,
  name: string,
  msg: string,
) => {
  const e = new Error();
  e.name = name;
  e.message = msg;
  console.error(e);
  return res.status(code).send(e);
};

export const tryCatch = (
  res: NextApiResponse,
  fn: () => void | Promise<void>,
) => {
  try {
    return fn();
  } catch (e) {
    return customError(
      res,
      500,
      'Internal Server Error',
      'Something went wrong.',
    );
  }
};
