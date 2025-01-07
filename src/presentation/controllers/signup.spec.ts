/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError, InvalidParamError, ServerError } from '../error';
import { EmailValidator } from '../protocols';
import { SignUpController } from './signup';
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account';
import { AccountModel } from '../../domain/models/account';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'id',
        name: 'name',
        email: 'email',
        password: 'q245234'
      };
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  };
};

describe('Controlador de login', () => {
  test('Deve retornar 400, se não enviar o nome do usuário', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        /* name: 'any_name', */
        email: 'any_emai',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Deve retornar 400, se não enviar o email do usuário', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        /*  email: 'any_emai', */
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Deve retornar 400, se não enviar o password do usuário', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_emai',
        /* password: 'any_password', */
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Deve retornar 400, se não enviar o passwordConfirmation do usuário', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_emai',
        password: 'any_password'
        /*  passwordConfirmation: 'any_password' */
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('Deve retornar 400, se não enviar um passwordConfirmation inválido', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_emai',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  test('Deve retornar 400, se o email inválido', () => {
    const { sut, emailValidatorStub } = makeSut();

    //vou mocar um valor
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_emai@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Deve retornar error, se o email passado não foi foi o mesmo que passou pela válidação', () => {
    const { sut, emailValidatorStub } = makeSut();

    //vai espionar a respota
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'new_email@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('new_email@gmail.com');
    //expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Deve retornar 500, se o serviço de validação de email apresentar error', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Deve retornar 200, se adicioanr uma conta com valores válidos', () => {
    const { sut, addAccountStub } = makeSut();

    //vai espionar a respota
    const addAccountSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'new_email@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    sut.handle(httpRequest);
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'new_email@gmail.com',
      password: 'any_password'
    });
  });
});
