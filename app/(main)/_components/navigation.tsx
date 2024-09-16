"use client"; // Ensures this file is executed in the client-side environment
import { cn } from "@/lib/utils"; // Import a utility function for conditional class names
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react"; // Import icons from the Lucide React library
import { useParams, usePathname, useRouter } from "next/navigation"; // Import a hook to get the current pathname
import React, { ElementRef, useEffect, useRef, useState } from "react"; // Import React and necessary hooks
import { useMediaQuery } from "usehooks-ts"; // Import a hook to handle media queries
import UserItem from "./user-item"; // Import a custom component for user items
import { useMutation } from "convex/react"; // Import a hook to handle mutations with Convex
import { api } from "@/convex/_generated/api"; // Import the API from Convex
import Item from "./item"; // Import a custom component for items in the sidebar
import { toast } from "sonner"; // Import the toast notification system
import DocumentList from "./document-list"; // Import a component to list documents
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TrashBox from "./trash-box";
import UseSearch from "@/hooks/use-search";
import { useSetting } from "@/hooks/use-setting";
import Navbar from "./navbar";

function Navigation() {
  const router = useRouter();
  const settings = useSetting();
  const search = UseSearch();
  const params = useParams();
  const pathName = usePathname(); // Get the current pathname
  const isMobile = useMediaQuery("(max-width: 768px)"); // Check if the screen width is 768px or less (mobile view)
  const createDocument = useMutation(api.documents.createDocument); // Mutation to create a new document
  const isResizingRef = useRef(false); // Ref to track if the sidebar is being resized
  const sideBarRef = useRef<ElementRef<"aside">>(null); // Ref for the sidebar element
  const nevBarRef = useRef<ElementRef<"div">>(null); // Ref for the navigation bar element
  const [isResetting, setIsResetting] = useState(false); // State to track if the sidebar is resetting
  const [isCollapsed, setIsCollapsed] = useState(isMobile); // State to track if the sidebar is collapsed

  // Function to handle when the user starts resizing the sidebar
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop the event from bubbling up
    isResizingRef.current = true; // Set resizing to true
    document.addEventListener("mousemove", handleMouseMove); // Add a listener to track mouse movements
    document.addEventListener("mouseup", handleMouseUp); // Add a listener to handle when the user stops resizing
  };

  // Function to handle the resizing of the sidebar
  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) {
      return; // If not resizing, do nothing
    }
    let newWidth = event.clientX; // Get the new width based on the mouse position
    if (newWidth < 240) {
      newWidth = 240; // Set a minimum width of 240px
    }
    if (newWidth > 480) {
      newWidth = 480; // Set a maximum width of 480px
    }
    if (sideBarRef.current && nevBarRef.current) {
      sideBarRef.current.style.width = `${newWidth}px`; // Adjust the sidebar width
      nevBarRef.current.style.setProperty("left", `${newWidth}px`); // Adjust the navbar position
      nevBarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      ); // Adjust the navbar width
    }
  };

  // Function to handle when the user stops resizing the sidebar
  const handleMouseUp = () => {
    isResizingRef.current = false; // Set resizing to false
    document.removeEventListener("mousemove", handleMouseMove); // Remove the mousemove listener
    document.removeEventListener("mouseup", handleMouseUp); // Remove the mouseup listener
  };

  // Function to reset the sidebar to its default width
  const resetWidth = () => {
    if (sideBarRef.current && nevBarRef.current) {
      setIsCollapsed(false); // Set the sidebar to not collapsed
      setIsResetting(true); // Set the resetting state to true
      sideBarRef.current.style.width = isMobile ? "100%" : "240px"; // Set width based on screen size
      nevBarRef.current.style.setProperty(
        "width",
        isMobile ? "100%" : "calc(100% - 240px)"
      ); // Adjust the navbar width based on screen size
      nevBarRef.current.style.setProperty("left", isMobile ? "100%" : "240px"); // Adjust the navbar position
      setTimeout(() => {
        setIsResetting(false); // After animation, set resetting to false
      }, 300); // Wait for 300ms
    }
  };

  // Function to collapse the sidebar
  const collapse = () => {
    if (sideBarRef.current && nevBarRef.current) {
      setIsCollapsed(true); // Set the sidebar to collapsed
      setIsResetting(true); // Set the resetting state to true
      sideBarRef.current.style.width = "0px"; // Collapse the sidebar
      nevBarRef.current.style.setProperty("width", "100%"); // Set the navbar width to 100%
      nevBarRef.current.style.setProperty("left", "0"); // Set the navbar position to the start
      setTimeout(() => {
        setIsResetting(false); // After animation, set resetting to false
      }, 300); // Wait for 300ms
    }
  };

  // Effect to handle screen size changes
  useEffect(() => {
    if (isMobile) {
      collapse(); // Collapse the sidebar if on mobile
    } else {
      resetWidth(); // Reset the sidebar width if not on mobile
    }
  }, [isMobile]);

  // Effect to handle path changes
  useEffect(() => {
    if (isMobile) {
      collapse(); // Collapse the sidebar when the path changes (if not on mobile)
    }
  }, [pathName, isMobile]);

  // Function to create a new document
  const handleCreateDocument = () => {
    const promise = createDocument({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    ); // Create a new document with a default title

    toast.promise(promise, {
      loading: "Creating A New Node...", // Show a loading toast
      success: "Node Created", // Show a success toast when done
      error: "Failed to Create Node", // Show an error toast if it fails
    });
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        ref={sideBarRef}
        className={cn(
          "group/sidebar h-full  bg-secondary overflow-y-auto sticky felx w-60 flex-col z-[99999] min-h-[100vh] left-0 top-0",
          isResetting && "transition-all ease-in-out duration-300", // Apply transition during reset
          isMobile && "w-0" // Set width to 0 if on mobile
        )}
      >
        {/* ChevronsLeft Icon to collapse the sidebar */}
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "absolute top-3 right-2  w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300dark:hover:bg-neutral-600 opacity-0 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100" // Always show on mobile
          )}
        >
          <ChevronsLeft className="w-6 h-6" />{" "}
        </div>

        {/* Some Actions */}
        <div>
          <UserItem /> {/* Render the UserItem component */}
          {/* Render the Search item */}
          <Item lable="Search" icon={Search} isSearch onClick={search.onOpen} />
          {/* Render the Settings item */}
          <Item lable="Setting" icon={Settings} onClick={settings.onOpen} />
          {/* Render the New Page item */}
          <Item
            onClick={handleCreateDocument}
            lable="New Page"
            icon={PlusCircle}
          />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item lable="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="w-72 p-0"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        {/* Render the list of documents */}
        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreateDocument} icon={Plus} lable="Add Page" />
        </div>

        {/* Handle for resizing the sidebar */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100
        transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0
        "
        />
      </aside>

      {/* Navbar */}
      <div
        ref={nevBarRef}
        className={cn(
          "absolute top-0 left-60 z-[99999] w-[calc(100%-240px)] ",
          isResetting && "transition-all ease-in-out duration-300", // Apply transition during reset
          isMobile && "w-full left-0" // Adjust width and position for mobile
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          /* Icon to open the sidebar when collapsed */
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="w-6 h-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}

export default Navigation;
