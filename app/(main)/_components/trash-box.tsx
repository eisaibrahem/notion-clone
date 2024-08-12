import Spinner from "@/components/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function TrashBox() {
  const router = useRouter();
  const params = useParams();
  const documentsTrashed = useQuery(api.documents.getTrash);
  const documentsRestored = useMutation(api.documents.restoreDocument);
  const removeDocument = useMutation(api.documents.removeDocument);
  const filteredDocuments = documentsTrashed?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const [search, setSearch] = useState("");

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = documentsRestored({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring Note...",
      success: "Note restored",
      error: "Failed to restore document",
    });
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promise = removeDocument({ id: documentId });

    toast.promise(promise, {
      loading: "Removing Note...",
      success: "Note removed",
      error: "Failed to remove document",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (documentsTrashed === undefined) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return <div>TrashBox</div>;
}

export default TrashBox;
