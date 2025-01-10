import { EmailValidatorAdapter } from './email-validador-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  test('Retorna false se o email não for válido', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false); //mocando uma valor
    const isValid = sut.isValid('invalid_email@gmail.com');
    expect(isValid).toBe(false);
  });

  test('Retorna true se o email for válido', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@gmail.com');
    expect(isValid).toBe(true);
  });

  test('Verifica se email passado é o mesmo que foi validado', () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@gmail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com');
  });
});
