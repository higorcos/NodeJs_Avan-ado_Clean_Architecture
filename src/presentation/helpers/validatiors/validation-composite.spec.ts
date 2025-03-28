/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError } from '../../error';
import { RequiredFieldValidation } from './required-field-validation';
import { Validation } from './validation';
import { ValidationComposite } from './validation-composite';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field');
};

describe('Validation Composite', () => {
  //Deve retornar um erro se alguma validação falhar
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return new MissingParamError('field');
      }
    }
    const validationStub = new ValidationStub();
    const sut = new ValidationComposite([validationStub]);
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
