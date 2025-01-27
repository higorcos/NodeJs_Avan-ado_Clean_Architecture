import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/monge-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);
    const newAccount = Object.assign({}, accountData, {
      id: accountData['_id'].toString()
    });
    delete newAccount['_id'];
    console.log(newAccount);
    return newAccount;
  }
}
