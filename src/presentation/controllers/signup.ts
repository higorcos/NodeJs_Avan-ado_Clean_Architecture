export class SignUpController {
  handle(httpRequest: any): any {
    console.log(httpRequest);
    return { statusCode: 400, body: new Error('parâmetro ausentes: nome') };
  }
}
