import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

interface AuthResponse {
  message: string;
  user?: GoogleUser;
  redirect?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  googleLogin(req): AuthResponse {
    if (!req.user) {
      return {
        message: 'No user from google'
      };
    }

    const frontendUrl = this.configService.get('FRONT_URL');
    return {
      message: 'User information from google',
      user: req.user,
      redirect: frontendUrl
    };
  }

  /**
   * Génère un token JWT pour un utilisateur
   */
  async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    return this.jwtService.signAsync(payload);
  }

  /**
   * Valide un token JWT et retourne le payload
   */
  async validateToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  /**
   * Trouve un utilisateur par son ID
   */
  async findUserById(userId: string): Promise<User | null> {
    return this.usersService.findById(userId);
  }

  /**
   * Vérifie si un utilisateur est administrateur
   */
  async isUserAdmin(userId: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    return user?.isAdmin || false;
  }
}
