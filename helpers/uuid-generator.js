'use strict';

import { v4 as uuidv4 } from 'uuid';

export const generateUserId = () => {
  // Generate a short UUID (16 chars) compatible with .NET format
  return uuidv4().replace(/-/g, '').substring(0, 16);
};

export const generateToken = () => {
  return uuidv4();
};
