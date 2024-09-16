"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";

interface NavBerProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}
function Navbar({ isCollapsed, onResetWidth }: NavBerProps) {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined)
    return (
      <nav
        className="bg-background dark:bg-[#1f1f1f] px-3 py-2
       w-full flex items-center justify-between"
      >
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  if (!document) return <div>Document not found</div>;

  return (
    <>
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
}

export default Navbar;
