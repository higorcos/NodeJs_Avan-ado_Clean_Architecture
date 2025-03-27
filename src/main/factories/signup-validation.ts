import { CompareFieldsValidation } from '../../presentation/helpers/validatiors/compare-field-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validatiors/required-field-validation';
import { Validation } from '../../presentation/helpers/validatiors/validation';
import { ValidationComposite } from '../../presentation/helpers/validatiors/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  );
  return new ValidationComposite(validations);
};
