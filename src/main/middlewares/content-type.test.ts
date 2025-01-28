import request from 'supertest';
import app from '../config/app';

describe('Body Parser Middleware', () => {
  test('Quero que o retorno seja em json como padrão', async () => {
    app.get('/test_type', (req, res) => {
      res.send('');
    });
    await request(app).get('/test_type').expect('content-type', /json/);
  });

  test('Quero que o retorno seja em XML na força bruta', async () => {
    app.get('/test_type_xml', (req, res) => {
      res.type('xml'); //forçando o type
      res.send('');
    });
    await request(app).get('/test_type_xml').expect('content-type', /xml/);
  });
});
