"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { SingleImageDropzone } from "../single-image-dropzone";

function CoverImageModel() {
  const params = useParams();
  const update = useMutation(api.documents.updateDocument);
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };
  const onChange = async (file?: File) => {
    if (file) {
      setFile(file);
      setIsSubmitting(true);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });
      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-lg font-semibold text-center">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CoverImageModel;
