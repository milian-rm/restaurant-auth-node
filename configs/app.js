'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { dbConnection } from './db.js';
// Ensure models are registered before DB sync
import '../src/users/user.model.js';
import '../src/auth/role.model.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';

const BASE_PATH = '/api/v1';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Auth API',
      version: '1.0.0',
      description: 'API de Autenticación para el Sistema de Restaurante',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: "Bearer <token>",
        },
      },
    },
  },
  apis: ['./src/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Restaurant Auth API Docs',
  }));
  app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

  // Rutas compatibles con .NET (Auth con A mayúscula)
  app.use(`${BASE_PATH}/Auth`, authRoutes);
  // Rutas estándar Node.js (auth con a minúscula)
  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/Users`, userRoutes);
  app.use(`${BASE_PATH}/users`, userRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'Restaurant Authentication Service',
    });
  });
  // 404 handler (standardized)
  app.use(notFound);
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT;
  app.set('trust proxy', 1);

  try {
    await dbConnection();
    // Seed essential data (roles)
    const { seedRoles } = await import('../helpers/role-seed.js');
    await seedRoles();
    middlewares(app);
    routes(app);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Restaurant Auth Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
    });
  } catch (err) {
    console.error(`Error starting Auth Server: ${err.message}`);
    process.exit(1);
  }
};
