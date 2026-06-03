import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user || user.role !== 'ADMIN') {
    router.navigate(['/login']);
    return false;
  }

  return true;
};