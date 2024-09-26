// src/config/swagger.ts

import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export async function setupSwagger(app: FastifyInstance) {
  // Configurando o Swagger
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Documentação da API do ARI (Agendamento de Remédios para Idosos)',
        description: 'Documentação da API do ARI (Agendamento de Remédios para Idosos) desenvolvida para a disciplina de Desenvolvimento de Aplicações Web II.',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3333',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  // Configurando Swagger UI
  app.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'none', // Rotas retraídas por padrão
      deepLinking: false,
    },
  });
}
