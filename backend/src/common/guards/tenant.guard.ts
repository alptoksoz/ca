import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Extract tenant from header or subdomain
    const tenantSlug = request.headers['x-tenant-slug'] as string;

    if (!tenantSlug) {
      throw new UnauthorizedException('Tenant not specified. Please provide X-Tenant-Slug header');
    }

    // Store tenant slug in request for later use
    request.tenantSlug = tenantSlug;

    return true;
  }
}
