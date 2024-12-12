import { SignUpController } from './signup';

describe('Controlador de login', () => {
  test('Deve retornar 400, se não enviar o nome do usuário', () => {
    const sut = new SignUpController();
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
    expect(httpResponse.body).toEqual(new Error('parâmetro ausente: name'));
  });

  test('Deve retornar 400, se não enviar o email do usuário', () => {
    const sut = new SignUpController();
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
    expect(httpResponse.body).toEqual(new Error('parâmetro ausente: email'));
  });
});
