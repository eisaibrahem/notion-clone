"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import useOrigin from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { Check, Copy, Globe } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface PublishProps {
  initialData: Doc<"documents">;
}

function Publish({ initialData }: PublishProps) {
  const origin = useOrigin();
  const updata = useMutation(api.documents.updateDocument);
  const [copied, setCopied] = useState(false);
  const [isSubmmitting, setIsSubmmiting] = useState(false);
  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmmiting(true);
    const promise = updata({
      id: initialData._id,
      isPublished: true,
    }).finally(() => {
      setIsSubmmiting(false);
    });

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Published",
      error: "Failed to publish",
    });
  };
  const onUnPublish = () => {
    setIsSubmmiting(true);
    const promise = updata({
      id: initialData._id,
      isPublished: false,
    }).finally(() => {
      setIsSubmmiting(false);
    });

    toast.promise(promise, {
      loading: "UnPublishing...",
      success: "UnPublished",
      error: "Failed to UnPublish",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 " align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="h-4 w-4 text-sky-500 animate-pulse" />
              <p className="text-xs font-medium text-sky-500">
                this Note is Live On Web
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-sm border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              className="w-full text-xs"
              size={"sm"}
              onClick={onUnPublish}
              disabled={isSubmmitting}
            >
              UnPublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Publish this Note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share this Work with the Others.
            </span>
            <Button
              className="w-full text-xs"
              size={"sm"}
              onClick={onPublish}
              disabled={isSubmmitting}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default Publish;
