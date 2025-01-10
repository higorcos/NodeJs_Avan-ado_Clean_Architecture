import bcryt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  }
}));

describe('Bcrypt Adapter', () => {
  test('Deve chamar bcrypt com o valor correto', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcryt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Deve retornar a hash gerada', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hash');
  });
});
