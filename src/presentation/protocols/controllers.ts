import { HttpResponse, HttpRequest } from './https';

export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
