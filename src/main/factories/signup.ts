import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../ultils/email-validador-adapter';
import { DbAddAccount } from '../../data/usercases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { LogControllerDecorator } from '../decorators/log';
import { Controller } from '../../presentation/protocols';
import { ValidationComposite } from '../../presentation/helpers/validatiors/validation-composite';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const validationComposite = new ValidationComposite([]);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount,
    validationComposite
  );
  return new LogControllerDecorator(signUpController, new LogMongoRepository());
};
