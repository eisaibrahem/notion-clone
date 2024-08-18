"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function DocumentsPage() {
  const router = useRouter();
  const { user } = useUser();
  const createDocument = useMutation(api.documents.createDocument);

  const onCreateDocument = () => {
    const promise = createDocument({ title: "Untitled" }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating A New Node...",
      success: "Node Created",
      error: "Failed to Create Node",
    });
  };

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center space-y-4">
      <Image
        src={"/images/empty-white.svg"}
        width={300}
        height={300}
        alt={"empty"}
        className="dark:hidden"
      />
      <Image
        src={"/images/empty-dark.svg"}
        width={300}
        height={300}
        alt={"empty"}
        className="dark:block hidden"
      />
      <h2 className="text-lg font-medium">
        Welcom to {user?.firstName}&apos;s Notion
      </h2>
      <Button onClick={onCreateDocument}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Create a Note
      </Button>
    </div>
  );
}

export default DocumentsPage;
