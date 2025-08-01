import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:5001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findByEmail(emails[0].value);
    
    if (!existingUser) {
      // L'utilisateur n'est pas enregistré, retourner un objet spécial
      return done(null, { error: 'user_not_registered', message: 'Utilisateur non enregistré' });
    }

    // Mettre à jour les informations de l'utilisateur existant
    const updatedUser = await this.usersService.updateUser(existingUser.id, {
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    });

    done(null, updatedUser);
  }
}
