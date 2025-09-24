import request from 'supertest';
import app from '../src/app';

describe('Affiliate routes', () => {
  it('GET /affiliates', async () => {
    const response = await request(app).get('/api/v1/affiliates');
    expect(response.status).toBe(200);
  });
});