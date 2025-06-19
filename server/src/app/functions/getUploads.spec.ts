import { randomUUID } from 'node:crypto';
import { getUploads } from '@/app/functions/getUploads';
import { isRight, unwrapEither } from '@/infra/shared/either';
import { makeUpload } from '@/test/factories/makeUpload';
import { sub } from 'date-fns';
import { describe, expect, it } from 'vitest';

describe('get uploads', () => {
  it('should be able to get the uploads', async () => {
    const namePattern = randomUUID();

    const upload1 = await makeUpload({ name: `${namePattern}.wep` });
    const upload2 = await makeUpload({ name: `${namePattern}.wep` });
    const upload3 = await makeUpload({ name: `${namePattern}.wep` });
    const upload4 = await makeUpload({ name: `${namePattern}.wep` });
    const upload5 = await makeUpload({ name: `${namePattern}.wep` });

    const sut = await getUploads({
      search: namePattern,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });

  it('should be able to get paginated uploads', async () => {
    const namePattern = randomUUID();

    const upload1 = await makeUpload({ name: `${namePattern}.wep` });
    const upload2 = await makeUpload({ name: `${namePattern}.wep` });
    const upload3 = await makeUpload({ name: `${namePattern}.wep` });
    const upload4 = await makeUpload({ name: `${namePattern}.wep` });
    const upload5 = await makeUpload({ name: `${namePattern}.wep` });

    let sut = await getUploads({
      search: namePattern,
      page: 1,
      pageSize: 3,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ]);

    sut = await getUploads({
      search: namePattern,
      page: 2,
      pageSize: 3,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });

  it('should be able to get sorted uploads', async () => {
    const namePattern = randomUUID();

    const upload1 = await makeUpload({
      name: `${namePattern}.wep`,
      createdAt: new Date(),
    });

    const upload2 = await makeUpload({
      name: `${namePattern}.wep`,
      createdAt: sub(new Date(), { days: 1 }),
    });

    const upload3 = await makeUpload({
      name: `${namePattern}.wep`,
      createdAt: sub(new Date(), { days: 2 }),
    });

    const upload4 = await makeUpload({
      name: `${namePattern}.wep`,
      createdAt: sub(new Date(), { days: 3 }),
    });

    const upload5 = await makeUpload({
      name: `${namePattern}.wep`,
      createdAt: sub(new Date(), { days: 4 }),
    });

    let sut = await getUploads({
      search: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id }),
    ]);

    sut = await getUploads({
      search: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });
});
