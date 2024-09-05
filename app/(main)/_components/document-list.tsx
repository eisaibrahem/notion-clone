"use client"; // Indicates that this code runs on the client-side (in the browser)
import { api } from "@/convex/_generated/api"; // Import API to fetch data
import { Doc, Id } from "@/convex/_generated/dataModel"; // Import types for documents
import { useQuery } from "convex/react"; // Import useQuery hook to fetch data from the server
import { useParams, useRouter } from "next/navigation"; // Import hooks for navigation and getting URL parameters
import React, { useState } from "react"; // Import React and useState hook for managing state
import Item from "./item"; // Import Item component to display each document
import { cn } from "@/lib/utils"; // Import cn function to combine class names conditionally
import { FileIcon } from "lucide-react"; // Import icon to represent documents

// Define the props that DocumentList component accepts
interface DocumentListProps {
  parentDocumentId?: Id<"documents">; // ID of the parent document (optional)
  level?: number; // Current depth level in the list (optional)
  data?: Doc<"documents">[]; // List of documents (optional)
}

// DocumentList component to display a list of documents
function DocumentList({
  parentDocumentId,
  level = 0,
  data = [],
}: DocumentListProps) {
  const params = useParams(); // Get the current URL parameters
  const router = useRouter(); // Hook for navigating between pages
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // State to track which documents are expanded or collapsed

  // Function to expand or collapse a specific document
  const onExpand = async (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded, // Copy the previous state
      [documentId]: !prevExpanded[documentId], // Toggle the expand/collapse state for the document
    }));
  };

  // Function to navigate to the selected document's page
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`); // Change the browser's URL to open the document
  };

  // Fetch documents based on the parent document ID
  const documents = useQuery(api.documents.getSideBar, {
    parentDocument: parentDocumentId,
  });

  // Show skeletons if the documents are still loading
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} /> {/* Show a skeleton for a document */}
        {level === 0 && ( // If it's the top level, show more skeletons
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      {/* Simple message if there are no child documents */}
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }} // Add left padding based on the level
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          level === 0 && "hidden", // Hide the message if it's the top level
          expanded && "last:block" // Show the message if the documents are expanded
        )}
      >
        no page inside
      </p>

      {/* Loop through and display each document */}
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            key={document._id}
            id={document._id}
            lable={document.title} // The title of the document
            icon={FileIcon} // The icon for the document
            onClick={() => onRedirect(document._id)} // Navigate to the document's page when clicked
            documentIcon={document.icon} // Icon for the document (if available)
            active={params.documentId === document._id} // Highlight the active document
            expanded={expanded[document._id]} // Check if the document is expanded or collapsed
            onExpand={() => onExpand(document._id)} // Pass the expand/collapse function to the document
            level={level} // Specify the level of the document
          />

          {/* Show child documents if this document is expanded */}
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} /> // Call DocumentList to display child documents
          )}
        </div>
      ))}
    </>
  );
}

export default DocumentList;
