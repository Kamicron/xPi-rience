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
  googleAuthRedirect(@Req() req, @Res() res: Response) {
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

    return res.redirect(`${result.redirect}?user=${encodeURIComponent(JSON.stringify(result.user))}`);
  }
}
