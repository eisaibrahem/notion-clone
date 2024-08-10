"use client";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import React from "react";

interface ItemProps {
  lable: string;
  icon: LucideIcon;
  onClick: () => void;
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
}
function Item({
  lable,
  icon: Icon,
  onClick,
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
}: ItemProps) {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={(e) => {}}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon
          size={20}
          className="text-muted-foreground shrink-0 h-[18px] mr-2"
        />
      )}

      <span className="truncate">{lable}</span>

      {isSearch && (
        <kbd
          className="ml-auto pointer-events-none inline-flex h-5 select-none
         items-center gap-1 rounded border bg-muted px-1.5 font-mono 
         text-[12px] font-medium text-muted-foreground opacity-100"
        >
          <span className="text-[8px]">&#x2318;</span>K
        </kbd>
      )}
    </div>
  );
}

export default Item;
