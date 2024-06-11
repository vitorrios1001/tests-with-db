# Tests with DB

This repository contains an example of how to write unit tests for backend services with database dependencies using SQLite in-memory. It utilizes TypeScript, TypeORM, and Jest to create an efficient and reliable testing environment.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Related Article](#related-article)

## Installation

First, clone the repository:

```bash
git clone https://github.com/your-username/tests-with-db.git
cd tests-with-db
```

Install the necessary dependencies:

```bash
npm install
```

## Configuration

Make sure the following files are configured correctly:

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "**/*.test.ts", "dist"]
}
```

### `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
```

### `jest.setup.ts`

```typescript
import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
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
```

## Project Structure

The project structure is as follows:

```
src/
  entity/
    User.ts
  repository/
    UserRepository.ts
  service/
    UserService.ts
  __tests__/
    UserService.test.ts
jest.setup.ts
jest.config.js
tsconfig.json
```

### Example Code

#### `src/entity/User.ts`

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;
}
```

#### `src/repository/UserRepository.ts`

```typescript
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByName(name: string): Promise<User | undefined> {
    return this.findOne({ name });
  }
}
```

#### `src/service/UserService.ts`

```typescript
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entity/User';

export class UserService {
  private userRepository = getCustomRepository(UserRepository);

  async findUserByName(name: string): Promise<User | undefined> {
    return this.userRepository.findByName(name);
  }

  async createUser(name: string, email: string): Promise<User> {
    const user = new User();
    user.name = name;
    user.email = email;
    return this.userRepository.save(user);
  }
}
```

#### `src/__tests__/UserService.test.ts`

```typescript
import { UserService } from '../service/UserService';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(() => {
    userService = new UserService();
  });

  test('should create a new user', async () => {
    const user = await userService.createUser('John Doe', 'john@example.com');
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });

  test('should find a user by name', async () => {
    const user = await userService.createUser('Jane Doe', 'jane@example.com');
    const foundUser = await userService.findUserByName('Jane Doe');
    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe('Jane Doe');
    expect(foundUser?.email).toBe('jane@example.com');
  });

  test('should return undefined if user is not found', async () => {
    const foundUser = await userService.findUserByName('Non Existent');
    expect(foundUser).toBeUndefined();
  });
});
```

## Usage

To run the tests, use the following command:

```bash
npm test
```

This will execute all the tests defined in the `__tests__` directory.

## Related Article

For more details on how to set up and write unit tests for backend services with database dependencies using SQLite in-memory, check out the full article on Dev.to:

[How to Write Unit Tests for Backend Services with Database Dependencies Using SQLite In-Memory](https://dev.to/vitorrios1001/como-escrever-testes-unitarios-para-servicos-backend-com-dependencias-de-banco-de-dados-usando-sqlite-in-memory-4526)
