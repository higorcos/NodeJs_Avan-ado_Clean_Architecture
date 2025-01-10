import {
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
  Encrypter
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccountRepository {
  private readonly encrypter: Encrypter;
  private readonly addAccountResponsitory: AddAccountRepository;

  constructor(
    encrypter: Encrypter,
    addAccountResponsitory: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountResponsitory = addAccountResponsitory;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    await this.addAccountResponsitory.add(
      Object.assign({}, accountData, { password: hashedPassword })
    );
    return new Promise((resolve) => resolve(null));
  }
}
