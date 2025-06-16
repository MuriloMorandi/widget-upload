import { dbClient } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeLeft, makeRight } from "@/infra/shared/either";
import { Readable } from "node:stream";
import { z } from "zod/v4";
import { InvalidFileFormat } from "./errors/InvalidFileName";

const uploadImageInputSchema = z.object({
    fileName: z.string(),
    contentType: z.string(),
    contentStream: z.instanceof(Readable)
})

type UploadImageInput = z.input<typeof uploadImageInputSchema>

const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

export async function uploadImage(input: UploadImageInput): Promise<Either<InvalidFileFormat, { url: string }>> {
    const {
        contentStream,
        contentType,
        fileName
    } = uploadImageInputSchema.parse(input);

    if (!allowedMimeTypes.includes(contentType))
    {
        return makeLeft(new InvalidFileFormat())
    }

    // TODO: carregar a imagem p/ o Cloudflare R2

    await dbClient.insert(schema.uploads).values({
        name: fileName,
        remoteKey: fileName,
        remoteURL: fileName,
    })

    return makeRight({ url: '' })
}