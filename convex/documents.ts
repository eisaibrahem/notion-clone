// Import necessary Convex libraries and tools
import { v } from "convex/values"; // Library for validating input values
import { mutation, query } from "./_generated/server"; // Import mutation and query functions from Convex
import { Doc, Id } from "./_generated/dataModel"; // Import automatically generated data models

// Define the mutation for creating a new Document in the database
export const createDocument = mutation({
  // Define the arguments needed for the mutation
  args: {
    title: v.string(), // The title must be a string
    parentDocument: v.optional(v.id("documents")), // The ID of the parent document (optional)
  },
  // Main function that runs when the mutation is called
  handler: async (ctx, args) => {
    // Get the identity of the currently authenticated user
    const identity = await ctx.auth.getUserIdentity();

    // If there is no authenticated user, return an "Unauthorized" error
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Extract the userId from the identity
    const userId = identity.subject;

    // Insert a new document into the database
    const document = await ctx.db.insert("documents", {
      title: args.title, // Set the title from the input arguments
      parentDocument: args.parentDocument, // Set the parent document if provided
      userId, // Link the document to the authenticated user
      isArchived: false, // Set the archived status to false
      isPublished: false, // Set the published status to false
    });

    // Return the newly created document as the response
    return document;
  },
});

// Define the query to retrieve documents for the sidebar
export const getSideBar = query({
  // Define the arguments needed for the query
  args: {
    parentDocument: v.optional(v.id("documents")), // The ID of the parent document (optional)
  },
  // Main function that runs when the query is called
  handler: async (ctx, args) => {
    // Get the identity of the currently authenticated user
    const identity = await ctx.auth.getUserIdentity();
    // If there is no authenticated user, return an "Unauthorized" error
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Extract the userId from the identity
    const userId = identity.subject;

    // Query the database for documents using the "by_user_parent" index
    const documents = await ctx.db
      .query("documents") // Query the "documents" table
      .withIndex(
        "by_user_parent",
        (q) => q.eq("userId", userId).eq("parentDocument", args.parentDocument), // Filter documents by userId and parent document
      )
      .filter((q) => q.eq(q.field("isArchived"), false)) // Filter out archived documents
      .order("desc") // Order the results in descending order
      .collect(); // Collect the results

    // Return the list of documents as the response
    return documents;
  },
});

export const archiveDocument = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchive(child._id);
      }
    };
    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    recursiveArchive(args.id);
    return document;
  },
});

export const getTrash = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId)) // Filter documents by userId
      .filter((q) => q.eq(q.field("isArchived"), true)) //  Filter out archived documents
      .order("desc") // Order the results in descending order
      .collect(); // Collect the results
    return documents;
  },
});

export const restoreDocument = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        await recursiveRestore(child._id);
      }
    };
    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parentDocument = await ctx.db.get(existingDocument.parentDocument);
      if (parentDocument?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const document = await ctx.db.patch(args.id, options);
    recursiveRestore(args.id);
    return document;
  },
});


export const removeDocument = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }
  const document =  await ctx.db.delete(args.id);
    return document;
  },
});
