import { CanceledError } from "axios";
import { enableMapSet } from "immer";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { immer } from "zustand/middleware/immer";
import { uploadFileToStorage } from "../http/uploadFileToStorage";
import { compressImage } from "../utils/compressImage";

export type Upload = {
    name: string;
    file: File;
    abortController: AbortController;
    status: "progress" | "success" | "error" | "canceled";
    originalSizeInBytes: number;
    compressedSizeInBytes?: number;
    uploadSizeInBytes: number;
    remoteURL?: string
};

type UploadState = {
    uploads: Map<string, Upload>;
    addUploads: (files: File[]) => void;
    cancelUpload: (uploadId: string) => void;
    retryUpload: (uploadId: string) => void;
};

enableMapSet();

export const useUploads = create<UploadState, [["zustand/immer", never]]>(
    immer((set, get) => {
        function updateUpload(uploadId: string, data: Partial<Upload>) {
            const upload = get().uploads.get(uploadId);

            if (!upload)
            {
                return;
            }

            set((state) => {
                state.uploads.set(uploadId, {
                    ...upload,
                    ...data,
                });
            });
        }

        async function processUpload(uploadId: string) {
            const upload = get().uploads.get(uploadId);

            if (!upload)
            {
                return;
            }

            const abortController = new AbortController();

            updateUpload(uploadId, {
                uploadSizeInBytes: 0,
                remoteURL: undefined,
                compressedSizeInBytes: undefined,
                abortController,
                status: "progress",
            });

            try
            {
                const compressedFile = await compressImage({
                    file: upload.file,
                    maxWidth: 200,
                    maxHeight: 200,
                    quality: 0.8,
                });

                updateUpload(uploadId,
                    { compressedSizeInBytes: compressedFile.size }
                );

                const { url } = await uploadFileToStorage(
                    {
                        file: compressedFile,
                        onProgress(sizeInBytes) {
                            updateUpload(uploadId, {
                                uploadSizeInBytes: sizeInBytes,
                            });
                        },
                    },
                    { signal: upload.abortController.signal }
                );

                console.log(url)

                updateUpload(uploadId, {
                    status: "success",
                    remoteURL: url
                });
            } catch (error)
            {
                if (error instanceof CanceledError)
                {
                    updateUpload(uploadId, {
                        status: "canceled",
                    });
                }

                updateUpload(uploadId, {
                    status: "error",
                });
            }
        }

        function cancelUpload(uploadId: string) {
            const upload = get().uploads.get(uploadId);

            if (!upload)
            {
                return;
            }

            upload.abortController.abort();

            updateUpload(uploadId, {
                ...upload,
                status: "canceled",
            });
        }

        function addUploads(files: File[]) {
            for (const file of files)
            {
                const uploadId = crypto.randomUUID();
                const abortController = new AbortController();

                const upload: Upload = {
                    name: file.name,
                    file,
                    abortController,
                    status: "progress",
                    originalSizeInBytes: file.size,
                    uploadSizeInBytes: 0,
                };

                set((state) => {
                    state.uploads.set(uploadId, upload);
                });

                processUpload(uploadId)
            }
        }

        function retryUpload(uploadId: string) {
            processUpload(uploadId);
        }

        return {
            uploads: new Map(),
            addUploads,
            cancelUpload,
            retryUpload
        };
    })
);

export const usePendingUploads = () => {
    return useUploads(
        useShallow((store) => {
            const isThereAnyPendingUploads = Array.from(store.uploads.values()).some(
                (upload) => upload.status === "progress"
            );

            if (!isThereAnyPendingUploads)
            {
                return { isThereAnyPendingUploads, globalPercentage: 100 };
            }

            const { total, uploaded } = Array.from(store.uploads.values())
                .reduce(
                    (acc, upload) => {
                        if (upload.compressedSizeInBytes)
                        {
                            acc.uploaded += upload.uploadSizeInBytes;
                        }

                        acc.total +=
                            upload.compressedSizeInBytes || upload.originalSizeInBytes;

                        return acc;
                    },
                    { total: 0, uploaded: 0 }
                );

            const globalPercentage = Math.min(
                Math.round((uploaded * 100) / total),
                100
            );

            return { isThereAnyPendingUploads, globalPercentage };
        })
    );
};