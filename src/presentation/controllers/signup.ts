/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError, InvalidParamError } from '../error';
import { badRequest, serverError } from '../helpers/http-helper';
import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator
} from '../protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(paramsEmailValidator: EmailValidator) {
    this.emailValidator = paramsEmailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFileds = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ];
      for (const field of requiredFileds) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
