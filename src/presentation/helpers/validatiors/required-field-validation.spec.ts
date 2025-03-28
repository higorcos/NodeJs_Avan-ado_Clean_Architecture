import { MissingParamError } from '../../error';
import { RequiredFieldValidation } from './required-field-validation';
const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field');
};
describe('RequiredField Validation', () => {
  //Deve retornar um erro de parâmetro ausente se a validação falhar
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });
  //Não deve retornar se a validação for bem-sucedida
  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name' });
    expect(error).toBeFalsy();
  });
});
