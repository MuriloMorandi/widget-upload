import { env } from '@/env';
import { uploadImageRoute } from '@/infra/http/routes/uploadImage';
import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { exportUploadsRoute } from './routes/exportUploads';
import { getUploadsRoute } from './routes/getUploads';
import { transformSwaggerSchema } from './transform-swagger-schema';

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error))
  {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    });
  }

  // Envia o erro p/ alguma ferramenta de observabilidade (Sentry/DataDog/Grafana/OTel)

  console.error(error);

  return reply.status(500).send({ message: 'Internal server error.' });
});

server.register(fastifyCors, { origin: '*' });

server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Server',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
});

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

server.register(uploadImageRoute);
server.register(getUploadsRoute);
server.register(exportUploadsRoute);

console.log(env.DATABASE_URL);

server.listen({ port: 3333, host: '0.0.0.0' }).then(val => {
  console.log('HTTP Server running!');
  console.log(`Swagger URL: ${val}/docs`);
});
