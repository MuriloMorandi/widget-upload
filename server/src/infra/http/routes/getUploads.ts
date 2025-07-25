import { getUploads } from '@/app/functions/getUploads';
import { unwrapEither } from '@/infra/shared/either';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

export const getUploadsRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/uploads',
    {
      schema: {
        summary: 'Get uploads',
        tags: ['uploads'],
        querystring: z.object({
          search: z.string().optional(),
          sortBy: z.enum(['createdAt']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
        }),
        response: {
          200: z.object({
            uploads: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                remoteKey: z.string(),
                remoteUrl: z.string(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, pageSize, search, sortBy, sortDirection } = request.query;

      const result = await getUploads({
        page,
        pageSize,
        search,
        sortBy,
        sortDirection,
      });

      const { total, uploads } = unwrapEither(result);

      return reply.status(200).send({ total, uploads });
    }
  );
};
