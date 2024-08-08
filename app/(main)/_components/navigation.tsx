"use client";
import { ChevronsLeft } from "lucide-react";
import React, { ElementRef, useRef, useState } from "react";

function Navigation() {
  const isResizingRef = useRef(false);
  const sideBarRef = useRef<ElementRef<"aside">>(null);
  const nevRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <>
      <aside
        className="group/sidebar h-full  bg-secondary
       overflow-y-auto relative felx w-60 flex-col z-[999] min-h-[100vh]"
      >
        <div
          role="button"
          className="absolute top-3 right-2  w-6 h-6 
        text-muted-foreground rounded-sm hover:bg-neutral-300
         dark:hover:bg-neutral-600 opacity-0 group-hover/sidebar:opacity-100"
        >
          <ChevronsLeft className="w-6 h-6" />
        </div>
        <div>
          <p>Actions items</p>
        </div>
        <div className="mt-4">Documents</div>
        <div
          className="opacity-0 group-hover/sidebar:opacity-100
        transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0
        "
        />
      </aside>
    </>
  );
}

export default Navigation;
