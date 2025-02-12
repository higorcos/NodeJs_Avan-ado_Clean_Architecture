/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoginController } from './login';
import { badRequest, SucessReponse } from '../../helpers/http-helper';
import { MissingParamError, InvalidParamError } from '../../error';
import { HttpRequest } from '../../protocols';

interface Subtype {
  sut: LoginController;
}
const makeSut = (): Subtype => {
  const sut = new LoginController();
  return { sut };
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
