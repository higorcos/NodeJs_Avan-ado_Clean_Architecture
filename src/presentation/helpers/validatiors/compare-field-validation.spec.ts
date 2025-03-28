import { InvalidParamError } from '../../error';
import { CompareFieldsValidation } from './compare-field-validation';

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare');
};

describe('CompareField Validation', () => {
  //Deve retornar um InvalidParamError se a validação falhar
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'true_value'
    });
    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });
  //Não deve retornar se a validação for bem-sucedida
  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    });
    expect(error).toBeFalsy();
  });
});
