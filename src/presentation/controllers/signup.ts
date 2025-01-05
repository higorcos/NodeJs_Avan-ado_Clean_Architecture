import { MissingParamError } from '../error/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/https';
import { Controller } from '../protocols/controllers';

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
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
  }
}
