import { dbClient } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeRight } from '@/infra/shared/either';
import { asc, count, desc, ilike } from 'drizzle-orm';
import { z } from 'zod/v4';

const getUploadsInput = z.object({
  search: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
});

type GetUploadsInput = z.input<typeof getUploadsInput>;

type GetUploadsOutput = {
  uploads: {
    id: string;
    name: string;
    remoteKey: string;
    remoteUrl: string;
    createdAt: Date;
  }[];
  total: number;
};

export async function getUploads(
  input: GetUploadsInput
): Promise<Either<never, GetUploadsOutput>> {
  const { page, pageSize, search, sortBy, sortDirection } =
    getUploadsInput.parse(input);

  const [uploads, [{ total }]] = await Promise.all([
    dbClient
      .select({
        id: schema.uploads.id,
        name: schema.uploads.name,
        remoteKey: schema.uploads.remoteKey,
        remoteUrl: schema.uploads.remoteURL,
        createdAt: schema.uploads.createdAt,
      })
      .from(schema.uploads)
      .where(search ? ilike(schema.uploads.name, `%${search}%`) : undefined)
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy]);
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy]);
        }

        return desc(fields.id);
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    dbClient
      .select({ total: count(schema.uploads.id) })
      .from(schema.uploads)
      .where(search ? ilike(schema.uploads.name, `%${search}%`) : undefined),
  ]);

  return makeRight({ uploads, total });
}
