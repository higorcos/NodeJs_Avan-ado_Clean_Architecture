import { ValidationComposite } from '../../presentation/helpers/validatiors/validation-composite';
import { makeSignUpValidation } from './signup-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validatiors/required-field-validation';
import { Validation } from '../../presentation/helpers/validatiors/validation';

jest.mock('../../presentation/helpers/validatiors/validation-composite');

describe('SignUpValidation Factory', () => {
  test('Deve chamar ValidationComposite com todas as validações', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
