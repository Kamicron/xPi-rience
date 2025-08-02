import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';

/**
 * Décorateur pour protéger les routes avec authentification admin
 * Usage: @AdminOnly() sur une méthode de contrôleur
 */
export function AdminOnly() {
  return applyDecorators(
    UseGuards(AdminGuard),
  );
}

/**
 * Décorateur pour obtenir l'utilisateur courant dans les routes protégées
 * Usage: getCurrentUser(@CurrentUser() user: User)
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
