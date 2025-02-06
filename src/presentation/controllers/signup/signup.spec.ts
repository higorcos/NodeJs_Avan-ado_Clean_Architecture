/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError, InvalidParamError, ServerError } from '../../error';
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel
} from './signup-protocols';
import { SignUpController } from './signup';

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
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'id',
        name: 'name',
        email: 'email',
        password: 'q245234'
      };
      return new Promise((resolve) => resolve(fakeAccount));
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
  test('Deve retornar 400, se não enviar o nome do usuário', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        /* name: 'any_name', */
        email: 'any_emai',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Deve retornar 400, se não enviar o email do usuário', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        /*  email: 'any_emai', */
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Deve retornar 400, se não enviar o password do usuário', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_emai',
        /* password: 'any_password', */
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Deve retornar 400, se não enviar o passwordConfirmation do usuário', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_emai',
        password: 'any_password'
        /*  passwordConfirmation: 'any_password' */
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('Deve retornar 400, se não enviar um passwordConfirmation inválido', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_emai',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  test('Deve retornar 400, se o email inválido', async () => {
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
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Deve retornar error, se o email passado não foi foi o mesmo que passou pela válidação', async () => {
    const { sut, emailValidatorStub } = makeSut();

    //vai espionar a resposta
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

  test('Deve retornar 500, se o serviço de validação de email apresentar error', async () => {
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
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError('')); //Verificar se o erro está vindo vazio
  });

  test('Deve retornar sucesso, se adicioanr uma conta com valores válidos', async () => {
    const { sut, addAccountStub } = makeSut();

    //vai espionar a resposta
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

  test('Deve retornar 500, se o serviço de criação de usuário apresentar error', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'email@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError('')); //Verificar se o erro está vindo vazio
  });

  test('Deve retornar 200, usuário criado', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'id',
      name: 'name',
      email: 'email',
      password: 'q245234'
      //resposta fixa vindo da junção add no controller
    });
  });
});
