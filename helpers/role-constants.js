// Roles del Sistema de Restaurante
export const PLATFORM_ADMIN_ROLE = 'PLATFORM_ADMIN';
export const BRANCH_ADMIN_ROLE = 'BRANCH_ADMIN';
export const EMPLOYEE_ROLE = 'EMPLOYEE';
export const CLIENT_ROLE = 'CLIENT';

export const ALLOWED_ROLES = [
  PLATFORM_ADMIN_ROLE,
  BRANCH_ADMIN_ROLE,
  EMPLOYEE_ROLE,
  CLIENT_ROLE,
];

// Roles por defecto para nuevos usuarios
export const DEFAULT_ROLE = CLIENT_ROLE;
