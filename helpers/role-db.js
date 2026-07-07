'use strict';

import { Role } from '../src/auth/role.model.js';

export const getRoleByName = async (roleName) => {
  return Role.findOne({ where: { Name: roleName } });
};

export const getAllRoles = async () => {
  return Role.findAll();
};
