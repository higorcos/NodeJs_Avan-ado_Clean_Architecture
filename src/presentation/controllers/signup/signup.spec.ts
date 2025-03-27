/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError, ServerError } from '../../error';
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  Validation
} from './signup-protocols';
import { SignUpController } from './signup';
import { sucessReponse, badRequest } from '../../helpers/http-helper';

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'id',
  name: 'name',
  email: 'email@gmail.com',
  password: '123456'
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutType {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutType => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);
  return {
    sut,
    addAccountStub,
    validationStub
  };
};

describe('Controlador de login', () => {
  test('Deve retornar sucesso, se adicioanr uma conta com valores válidos', async () => {
    const { sut, addAccountStub } = makeSut();
    //vai espionar a resposta
    const addAccountSpy = jest.spyOn(addAccountStub, 'add');
    sut.handle(makeFakeRequest());
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    });
  });

  test('Deve retornar 500, se o serviço de criação de usuário apresentar error', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(null));
  });

  test('Deve retornar 200, usuário criado', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(sucessReponse(makeFakeAccount()));
  });
  //deve, chamar Validação com valor correto
  test('should, call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  //deve retornar 400 se a validação retornar um erro
  test('should return 400 if Validation retuns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });
});
