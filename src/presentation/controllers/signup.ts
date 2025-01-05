import { MissingParamError } from '../error/missing-param-error';
import { HttpRequest, HttpResponse } from '../protocols/https';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    //console.log(httpRequest);

    if (!httpRequest.body.name) {
      return { statusCode: 400, body: new MissingParamError('name') };
    }
    if (!httpRequest.body.email) {
      return { statusCode: 400, body: new MissingParamError('email') };
    }
  }
}
