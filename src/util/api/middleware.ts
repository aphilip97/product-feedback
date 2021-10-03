import type { NextApiResponse } from 'next';

export const parseReqBody = <
  T
>(
  body: string,
): T | null => {
  try {
    return JSON.parse(body);
  } catch {
    return null
  }
};

export const customError = (
  res: NextApiResponse,
  code: number,
  name: string,
  msg: string,
) => {
  const e = new Error(msg);
  e.name = name;
  if (process.env.NODE_ENV === 'production') {
    e.stack = void 0;
  }
  return res.status(code).send(e);
};
