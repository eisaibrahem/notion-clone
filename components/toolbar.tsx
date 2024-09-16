"use client";
import { Doc } from "@/convex/_generated/dataModel";
import React, { ElementRef, useRef, useState } from "react";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useSetting } from "@/hooks/use-setting";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}
function Toolbar({ initialData, preview }: ToolbarProps) {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title || "Untitled");
  const update = useMutation(api.documents.updateDocument);
  const removeIcon = useMutation(api.documents.removeIcon);
  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({ id: initialData._id });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2  group/icon pt-6">
          <IconPicker onIconChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition
          text-muted-foreground text-xs "
            variant="outline"
            size={"icon"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onIconChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant={"outline"}
              size={"sm"}
            >
              <Smile className=" h-4 w-4 mr-2" />
              Add Icon
            </Button>
          </IconPicker>
        )}

        {!initialData.coverImage && !preview && (
          <Button
            variant={"outline"}
            size={"sm"}
            className="text-muted-foreground text-xs"
            onClick={coverImage.onOpen}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Cover
          </Button>
        )}
      </div>

      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onChange={(event) => onInput(event.target.value)}
          onKeyDown={onKeyDown}
          value={value}
          className="  bg-transparent resize-none text-5xl font-bold 
          break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="text-5xl font-bold break-words 
        pb-[11.5px] outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
}

export default Toolbar;
