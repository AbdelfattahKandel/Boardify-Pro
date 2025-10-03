import { Injectable, computed, signal } from '@angular/core';

export type UserRole = 'Admin' | 'Carrier' | 'Shipper' | string;

interface ExtendedJwtPayload {
  role?: UserRole | UserRole[];
  roles?: UserRole[];
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {

}
