import ConfirmModel from "@/components/model/confirm-model";
import Spinner from "@/components/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function TrashBox() {
  const router = useRouter();
  const params = useParams();
  const documentsTrashed = useQuery(api.documents.getTrash);
  const documentsRestored = useMutation(api.documents.restoreDocument);
  const removeDocument = useMutation(api.documents.removeDocument);

  const [search, setSearch] = useState("");
  const filteredDocuments = documentsTrashed?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

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

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <input
          className="h-7 p-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mx-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No Documents found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            role="button"
            key={document._id}
            className="flex items-center text-primary w-full justify-between hover:bg-primary/5 text-sm rounded-sm"
            onClick={() => onClick(document._id)}
          >
            <span className="truncate pl-2 ">{document.title}</span>

            <div className="flex items-center ">
              <div
                role="button"
                className="text-muted-foreground rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                onClick={(event) => onRestore(event, document._id)}
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModel onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-red-200 dark:hover:bg-red-950"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModel>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrashBox;
