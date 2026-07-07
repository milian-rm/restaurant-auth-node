'use strict';

import { Role } from '../src/auth/role.model.js';
import {
  PLATFORM_ADMIN_ROLE,
  BRANCH_ADMIN_ROLE,
  EMPLOYEE_ROLE,
  CLIENT_ROLE,
} from './role-constants.js';

const rolesToSeed = [
  { Id: 'PLATFORM_ADMIN', Name: 'PLATFORM_ADMIN' },
  { Id: 'BRANCH_ADMIN', Name: 'BRANCH_ADMIN' },
  { Id: 'EMPLOYEE', Name: 'EMPLOYEE' },
  { Id: 'CLIENT', Name: 'CLIENT' },
];

export const seedRoles = async () => {
  try {
    // Check if roles already exist (from .NET migration)
    const existingRoles = await Role.findAll();
    if (existingRoles.length > 0) {
      console.log(`Roles already exist (${existingRoles.length} found). Skipping seed.`);
      return;
    }

    // Seed roles only if table is empty
    for (const roleData of rolesToSeed) {
      await Role.create(roleData);
      console.log(`Role seeded: ${roleData.Name}`);
    }
    console.log('Roles verification completed');
  } catch (error) {
    console.error('Error seeding roles:', error.message);
  }
};
