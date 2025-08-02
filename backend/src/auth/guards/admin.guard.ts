import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Vérifier la présence du token d'authentification
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token d\'authentification requis');
    }

    try {
      // Vérifier et décoder le token
      const payload = await this.authService.validateToken(token);
      
      // Vérifier si l'utilisateur est admin
      const user = await this.authService.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      if (!user.isAdmin) {
        throw new ForbiddenException('Accès administrateur requis');
      }

      // Ajouter l'utilisateur à la requête pour usage ultérieur
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
