import { MissingParamError, InvalidParamError, ServerError } from '../error';
import { EmailValidator } from '../protocols';
import { SignUpController } from './signup';

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
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
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new Error();
      }
    }
    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);

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
});
