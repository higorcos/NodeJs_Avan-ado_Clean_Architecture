import { InvalidParamError } from '../../error';
import { EmailValidator } from '../../protocols/email-validator';
import { Validation } from './validation';

export class EmailValidation implements Validation {
  private readonly fieldName: string;
  private readonly emailValidator: EmailValidator;

  constructor(fieldName: string, paramsEmailValidator: EmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = paramsEmailValidator;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
