import { MissingParamError, InvalidParamError } from '../../error';
import {
  badRequest,
  serverError,
  SucessReponse
} from '../../helpers/http-helper';
import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(paramsEmailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = paramsEmailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      });

      return SucessReponse(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
