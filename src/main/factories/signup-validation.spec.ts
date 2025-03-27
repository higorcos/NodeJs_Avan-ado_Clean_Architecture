import { ValidationComposite } from '../../presentation/helpers/validatiors/validation-composite';
import { makeSignUpValidation } from './signup-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validatiors/required-field-validation';
import { Validation } from '../../presentation/helpers/validatiors/validation';
import { CompareFieldsValidation } from '../../presentation/helpers/validatiors/compare-field-validation';
import { EmailValidation } from '../../presentation/helpers/validatiors/email-validation';
import { EmailValidator } from '../../presentation/protocols/email-validator';

jest.mock('../../presentation/helpers/validatiors/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Deve chamar ValidationComposite com todas as validações', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );
    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
