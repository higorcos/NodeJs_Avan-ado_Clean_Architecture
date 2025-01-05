import { MissingParamError } from '../error/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/https';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    //console.log(httpRequest);

    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }
  }
}
