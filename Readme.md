# Tests with DB

Este repositório contém um exemplo de como escrever testes unitários para serviços backend com dependências de banco de dados usando SQLite in-memory. Ele utiliza TypeScript, TypeORM e Jest para criar um ambiente de testes eficiente e confiável.

## Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Uso](#uso)
- [Artigo Relacionado](#artigo-relacionado)

## Instalação

Primeiro, clone o repositório:

```bash
git clone https://github.com/vitorrios1001/tests-with-db.git
cd tests-with-db
```

Instale as dependências necessárias:

```bash
npm install
```

## Configuração

Certifique-se de que os seguintes arquivos estão configurados corretamente:

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

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

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

### Exemplo de Código

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

## Uso

Para rodar os testes, use o seguinte comando:

```bash
npm test
```

Isso irá executar todos os testes definidos no diretório `__tests__`.

## Artigo Relacionado

Para mais detalhes sobre como configurar e escrever testes unitários para serviços backend com dependências de banco de dados usando SQLite in-memory, confira o artigo completo no Dev.to:

[Como escrever testes unitários para serviços backend com dependências de banco de dados usando SQLite in-memory](https://dev.to/vitorrios1001/como-escrever-testes-unitarios-para-servicos-backend-com-dependencias-de-banco-de-dados-usando-sqlite-in-memory-4526)
