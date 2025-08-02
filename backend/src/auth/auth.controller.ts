import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // Vérifier si l'utilisateur a une erreur (utilisateur non enregistré)
    if (req.user && req.user.error === 'user_not_registered') {
      return res.redirect(`${process.env.FRONT_URL}login?error=user_not_registered&message=${encodeURIComponent(req.user.message)}`);
    }

    // Vérifier si l'authentification a échoué
    if (!req.user) {
      return res.redirect(`${process.env.FRONT_URL}login?error=auth_failed`);
    }

    const result = this.authService.googleLogin(req);
    
    if (!result.user || !result.redirect) {
      return res.redirect(`${process.env.FRONT_URL}login?error=auth_failed`);
    }

    // Générer automatiquement le token JWT
    const jwtToken = await this.authService.generateToken(req.user);
    
    // Ajouter le token JWT aux données utilisateur
    const userWithJwt = {
      ...result.user,
      jwtToken: jwtToken
    };

    return res.redirect(`${result.redirect}?user=${encodeURIComponent(JSON.stringify(userWithJwt))}`);
  }

  @Get('google/token')
  @UseGuards(AuthGuard('google'))
  async googleAuthToken(@Req() req) {
    // Vérifier si l'utilisateur a une erreur (utilisateur non enregistré)
    if (req.user && req.user.error === 'user_not_registered') {
      return {
        success: false,
        error: 'user_not_registered',
        message: req.user.message
      };
    }

    // Vérifier si l'authentification a échoué
    if (!req.user) {
      return {
        success: false,
        error: 'auth_failed',
        message: 'Authentication failed'
      };
    }

    // Générer le token JWT
    const token = await this.authService.generateToken(req.user);
    
    return {
      success: true,
      user: req.user,
      access_token: token,
      token_type: 'Bearer'
    };
  }

  @Get('generate-jwt')
  async generateJwtFromUser(@Req() req) {
    // Récupérer l'utilisateur depuis le localStorage (via query params ou body)
    const userId = req.query.userId;
    
    if (!userId) {
      return {
        success: false,
        error: 'missing_user_id',
        message: 'User ID is required'
      };
    }

    try {
      // Récupérer l'utilisateur depuis la base de données
      const user = await this.authService.findUserById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'user_not_found',
          message: 'User not found'
        };
      }

      // Générer le token JWT
      const token = await this.authService.generateToken(user);
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin
        },
        access_token: token,
        token_type: 'Bearer'
      };
    } catch (error) {
      return {
        success: false,
        error: 'internal_error',
        message: 'Failed to generate JWT token'
      };
    }
  }
}
