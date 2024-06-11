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
