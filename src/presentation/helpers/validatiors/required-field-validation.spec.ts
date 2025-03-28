import { MissingParamError } from '../../error';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  //Deve retornar um erro de parâmetro ausente se a validação falhar
  test('Should retrun a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field');
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
