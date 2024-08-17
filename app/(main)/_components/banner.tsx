"use client";
import ConfirmModel from "@/components/model/confirm-model";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface BannerProps {
  documentId: Id<"documents">;
}

function Banner({ documentId }: BannerProps) {
  const router = useRouter();
  const removeDocument = useMutation(api.documents.removeDocument);
  const restoreDocument = useMutation(api.documents.restoreDocument);

  const onRemove = () => {
    const promise = removeDocument({ id: documentId });
    toast.promise(promise, {
      loading: "Removing Note...",
      success: "Note removed",
      error: "Failed to remove document",
    });
    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restoreDocument({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring Note...",
      success: "Note restored",
      error: "Failed to restore document",
    });
  };

  return (
    <div
      className="w-full bg-rose-500 text-sm text-center p-2 
  text-white flex items-center gap-x-2 justify-center"
    >
      <p>This Page is In Trash.</p>
      <Button
        size={"sm"}
        onClick={onRestore}
        variant={"outline"}
        className="border-white bg-transparent hover:bg-primary/5 text-white
     hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore Page
      </Button>
      <ConfirmModel onConfirm={onRemove}>
        <Button
          size={"sm"}
          variant={"outline"}
          className="border-white bg-transparent hover:bg-primary/5 text-white
     hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete Forever
        </Button>
      </ConfirmModel>
    </div>
  );
}

export default Banner;
