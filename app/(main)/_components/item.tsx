"use client"; // Indicates that this code runs on the client side (in the browser)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton"; // Importing Skeleton component for loading placeholders
import { api } from "@/convex/_generated/api"; // Importing API to interact with the backend
import { Id } from "@/convex/_generated/dataModel"; // Importing Id type for document identification
import { cn } from "@/lib/utils"; // Importing utility function for conditional class names
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react"; // Importing useMutation hook for making mutations
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  PlusIcon,
  Trash,
} from "lucide-react"; // Importing icons
import { useRouter } from "next/navigation"; // Importing useRouter for navigation
import React from "react"; // Importing React library
import { toast } from "sonner"; // Importing toast for notifications

// Define the props that the Item component will accept
interface ItemProps {
  lable: string; // The label or name of the item
  icon: LucideIcon; // The icon to display next to the item
  onClick?: () => void; // Function to call when the item is clicked
  id?: Id<"documents">; // The ID of the document (optional)
  documentIcon?: string; // An optional icon specific to the document
  active?: boolean; // Whether the item is currently active/selected
  expanded?: boolean; // Whether the item is expanded to show sub-items
  isSearch?: boolean; // Whether the item is part of a search result
  level?: number; // The level/depth of the item in the list (optional)
  onExpand?: () => void; // Function to call to expand/collapse the item
}

// Item component represents each document in the list
function Item({
  lable, // The text label for the item
  icon: Icon, // The icon component to use
  onClick, // Function to call when the item is clicked
  id, // The document ID (optional)
  documentIcon, // A specific icon for the document (optional)
  active, // Whether the item is active/selected
  expanded, // Whether the item is expanded to show sub-documents
  isSearch, // Whether the item is part of a search result
  level = 0, // The depth level of the item in the document tree (default is 0)
  onExpand, // Function to call to expand/collapse the item
}: ItemProps) {
  const { user } = useUser();
  const router = useRouter(); // Hook for handling navigation
  const archive = useMutation(api.documents.archiveDocument);
  // Mutation to create a new document
  const create = useMutation(api.documents.createDocument);

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation(); // Prevent the event from propagating to parent elements
    if (!id) return; // If there's no document ID, do nothing
    const promise = archive({ id }).then(() => {
      router.push("/documents");
    });
    toast.promise(promise, {
      loading: "Moving To Trash...",
      success: "Note Moved To Trash",
      error: "Failed To Move To Trash",
    });
  };

  // Handle expand/collapse action when the expand icon is clicked
  const handelExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Prevent the event from propagating to parent elements
    onExpand?.(); // Call the onExpand function if it exists
  };

  // Determine which icon to show (ChevronDown for expanded, ChevronRight for collapsed)
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  // Handle creating a new sub-document when the plus icon is clicked
  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation(); // Prevent the event from propagating to parent elements
    if (!id) return; // If there's no document ID, do nothing

    // Create a new document and handle the response
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) onExpand?.(); // If the item is not expanded, expand it
        router.push(`/documents/${documentId}`); // Navigate to the new document (commented out)
      }
    );

    // Show a notification based on the promise's outcome
    toast.promise(promise, {
      loading: "Creating A New Node...", // Message shown while creating
      success: "Node Created", // Message shown on success
      error: "Failed to Create Node", // Message shown on failure
    });
  };

  return (
    <div
      onClick={onClick} // Handle the item click
      role="button" // Make it accessible as a button
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }} // Add left padding based on the item's level
      className={cn(
        "group min-h-[27] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary" // Add background color if the item is active
      )}
    >
      {!!id && ( // If there's an ID, show the expand/collapse icon
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handelExpand} // Handle the expand/collapse click
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? ( // If there's a specific document icon, show it
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        // Otherwise, show the default icon
        <Icon
          size={20}
          className="text-muted-foreground shrink-0 h-[18px] w-[18px] mr-2"
        />
      )}

      {/* Display the label text */}
      <span className="truncate">{lable}</span>

      {/* If this is part of a search result, show a keyboard shortcut */}
      {isSearch && (
        <kbd
          className="ml-auto pointer-events-none inline-flex h-5 select-none
         items-center gap-1 rounded border bg-muted px-1.5 font-mono 
         text-[12px] font-medium text-muted-foreground opacity-100"
        >
          <span className="text-[8px]">&#x2318; </span>Q
        </kbd>
      )}

      {/* If there's an ID, show the plus icon for creating a sub-document */}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(event) => {
                event.stopPropagation(); // Prevent the event from propagating to parent elements
              }}
            >
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full
                 ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash h-4 w-4 className="mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2 text-muted-foreground text-xs">
                Last Edited by : {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            onClick={onCreate} // Handle the click to create a sub-document
            role="button"
            className="opacity-0 group-hover:opacity-100 ml-auto h-full
           rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <PlusIcon className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Item; // Export the Item component

// Skeleton component to display while loading
Item.Skeleton = function ItemSkeleton({ level }: { level?: number } = {}) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }} // Add left padding based on the level
      className="flex gap-x-2 p-y-[3px] "
    >
      <Skeleton className="h-4 w-4" /> {/* Display a skeleton for the icon */}
      <Skeleton className="h-4 w-[30%]" />{" "}
      {/* Display a skeleton for the label */}
    </div>
  );
};
