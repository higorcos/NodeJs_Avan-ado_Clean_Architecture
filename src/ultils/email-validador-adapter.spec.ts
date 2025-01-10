describe('EmailValidator Adapter', () => {
  test('Retorna false se o email não for válido', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@gmail.com');
    expect(isValid).toBe(false);
  });
});
