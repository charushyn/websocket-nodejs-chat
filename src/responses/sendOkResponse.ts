import { Response } from "express";

const sendOkResponse = async (
  res: Response,
  status: number,
  payload: object | null
) => {
  return res.status(status).end(JSON.stringify(payload));
};

export { sendOkResponse };
