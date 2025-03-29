import { ValidationComposite } from '../../../presentation/helpers/validatiors/validation-composite';
import { makeLoginValidation } from './login-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validatiors/required-field-validation';
import { Validation } from '../../../presentation/helpers/validatiors/validation';
import { EmailValidation } from '../../../presentation/helpers/validatiors/email-validation';
import { EmailValidator } from '../../../presentation/protocols/email-validator';

jest.mock('../../../presentation/helpers/validatiors/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('LoginValidation Factory', () => {
  test('Deve chamar ValidationComposite com todas as validações', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
