import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async updateUser(userId: string, userData: {
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
  }): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    Object.assign(user, userData);
    return this.usersRepository.save(user);
  }

  async createOrUpdateUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    googleId: string;
    accessToken: string;
  }): Promise<User> {
    let user = await this.findByEmail(userData.email);

    if (user) {
      // Mise à jour de l'utilisateur existant
      Object.assign(user, userData);
      return this.usersRepository.save(user);
    }

    // Création d'un nouvel utilisateur
    user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
