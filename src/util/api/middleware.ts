import type {
  NextApiResponse,
} from 'next';

export const parseReqBody = <
  T
>(
  res: NextApiResponse,
  body: string,
): T | null => {
  try {
    return JSON.parse(body);
  } catch {
    customError(
      res,
      400,
      'Bad Request',
      'Request body is missing.'
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
