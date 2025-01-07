import { HttpResponse } from '../protocols/https';
import { ServerError } from '../error';

export const SucessReponse = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});
