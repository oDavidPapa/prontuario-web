import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from './jwt-payload';

export const roleGuard = (route: any) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = localStorage.getItem('token');
    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    const decoded = jwtDecode<JwtPayload>(token);
    const roles = decoded.roles || [];

    const expectedRoles = route.data?.['roles'] || [];
    if (expectedRoles.some((role: string) => roles.includes(role))) {
        return true;
    }

    router.navigate(['/acesso-negado']);
    return false;
};
