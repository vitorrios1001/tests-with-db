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
