"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface CoverProps {
  url?: string;
  preview?: boolean;
}
function Cover({ url, preview }: CoverProps) {
  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "12-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image fill src={url} className="object-cover" alt="Cover" />}
    </div>
  );
}

export default Cover;
