import { MissingParamError } from '../error/missing-param-error';
import { badRequest, serverError } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/https';
import { Controller } from '../protocols/controllers';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../error/invalid-param-error';

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
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
