import 'reflect-metadata';
import {
  createConnection,
  getConnection,
} from 'typeorm';
import { User } from './src/entity/User';

beforeAll(() => {
  return createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false,
  });
});

afterAll(async () => {
  const connection = getConnection();
  await connection.close();
});

afterEach(async () => {
  const connection = getConnection();
  await connection.synchronize(true);
});
