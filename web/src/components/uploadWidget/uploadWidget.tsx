import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetDropzone } from "./dropzone";
import { UploadWidgetHeader } from "./header";

import { useState } from "react";
import { UploadWidgetMinimizedButton } from "./minimizedButton";
import { UploadWidgetUploadList } from "./uploadList";

export function UploadWidget() {
    const [isWidgetOpen, setIsWidgetOpen] = useState(false);

    return (
        <Collapsible.Root onOpenChange={setIsWidgetOpen}>
            <div className="bg-zinc-900 shadow-shape w-[360px] overflow-hidden rounded-xl"
            >
                {!isWidgetOpen && <UploadWidgetMinimizedButton />}

                <Collapsible.Content>
                    <UploadWidgetHeader />
                    <div className="flex flex-col gap-4 py-3">
                        <UploadWidgetDropzone />

                        <div className="h-px bg-zinc-800 border-t border-black/50 box-content"
                        />
                        <UploadWidgetUploadList />
                    </div>
                </Collapsible.Content>
            </div>
        </Collapsible.Root>
    );
}