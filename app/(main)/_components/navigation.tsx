"use client";
import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { toast } from "sonner";

function Navigation() {
  const pathName = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const createDocument = useMutation(api.documents.createDocument);
  const isResizingRef = useRef(false);
  const sideBarRef = useRef<ElementRef<"aside">>(null);
  const nevBarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const handelMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handelMouseMove);
    document.addEventListener("mouseup", handelMouseUp);
  };

  const handelMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) {
      return;
    }
    let newWidth = event.clientX;
    if (newWidth < 240) {
      newWidth = 240;
    }
    if (newWidth > 480) {
      newWidth = 480;
    }
    if (sideBarRef.current && nevBarRef.current) {
      sideBarRef.current.style.width = `${newWidth}px`;
      nevBarRef.current.style.setProperty("left", `${newWidth}px`);
      nevBarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
    sideBarRef.current!.style.width = `${newWidth}px`;
  };

  const handelMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handelMouseMove);
    document.removeEventListener("mouseup", handelMouseUp);
  };

  const resetWidth = () => {
    if (sideBarRef.current && nevBarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      sideBarRef.current.style.width = isMobile ? "100%" : "240px";
      nevBarRef.current.style.setProperty(
        "width",
        isMobile ? "100%" : "calc(100% - 240px)"
      );
      nevBarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const collapse = () => {
    if (sideBarRef.current && nevBarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sideBarRef.current.style.width = "0px";
      nevBarRef.current.style.setProperty("width", "100%");
      nevBarRef.current.style.setProperty("left", "0");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      collapse();
    }
  }, [pathName, isMobile]);

  const handelCreateDocument = () => {
    const promise = createDocument({ title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating A New Node...",
      success: "Node Created",
      error: "Failed to Create Node",
    });
  };

  return (
    <>
      <aside
        ref={sideBarRef}
        className={cn(
          "group/sidebar h-full  bg-secondary overflow-y-auto relative felx w-60 flex-col z-[999] min-h-[100vh]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "absolute top-3 right-2  w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300dark:hover:bg-neutral-600 opacity-0 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="w-6 h-6" />
        </div>
        <div>
          <UserItem />
          <Item lable="Search" icon={Search} isSearch onClick={() => {}} />
          <Item lable="Setting" icon={Settings} onClick={() => {}} />
          <Item
            onClick={handelCreateDocument}
            lable="New Page"
            icon={PlusCircle}
          />
        </div>
        <div className="mt-4"></div>
        <div
          onMouseDown={handelMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100
        transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0
        "
        />
      </aside>
      <div
        ref={nevBarRef}
        className={cn(
          "absolute top-0 left-60 z-[9999] w-[calc(100%-240px)] ",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-full left-0"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="w-6 h-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
}

export default Navigation;
