import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Function to validate the user's identity
const validateUser = async (ctx: any): Promise<string> => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity.subject; // Return the user's unique ID
};

// Function to fetch a document and ensure the user has access to it
const fetchDocument = async (ctx: any, id: Id<"documents">, userId: string) => {
  const document = await ctx.db.get(id);
  if (!document || document.userId !== userId) throw new Error("Unauthorized");
  return document; // Return the document if it exists and the user is authorized
};

// Function to recursively archive or restore child documents
const recursiveOperation = async (
  ctx: any,
  documentId: Id<"documents">,
  userId: string,
  isArchived: boolean,
) => {
  const children = await ctx.db
    .query("documents")
    .withIndex("by_user_parent", (q: any) =>
      q.eq("userId", userId).eq("parentDocument", documentId),
    )
    .collect();

  // Iterate over each child document
  for (const child of children) {
    await ctx.db.patch(child._id, { isArchived }); // Update the archive status
    await recursiveOperation(ctx, child._id, userId, isArchived); // Recursively update children
  }
};

// Mutation to create a new document
export const createDocument = mutation({
  args: {
    title: v.string(), // Title of the document
    parentDocument: v.optional(v.id("documents")), // Optional parent document ID
  },
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    return await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId, // Associate the document with the current user
      isArchived: false,
      isPublished: false,
    });
  },
});

// Query to retrieve documents for the sidebar
export const getSideBar = query({
  args: {
    parentDocument: v.optional(v.id("documents")), // Optional parent document ID
  },
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    return await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q: any) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument),
      )
      .filter((q: any) => q.eq(q.field("isArchived"), false)) // Exclude archived documents
      .order("desc") // Order by most recent
      .collect(); // Collect and return results
  },
});

// Mutation to archive a document and its children
export const archiveDocument = mutation({
  args: { id: v.id("documents") }, // Document ID to archive
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    await fetchDocument(ctx, args.id, userId); // Fetch and validate the document
    await ctx.db.patch(args.id, { isArchived: true }); // Archive the document
    await recursiveOperation(ctx, args.id, userId, true); // Recursively archive children
  },
});

// Query to get all archived documents (the trash)
export const getTrash = query({
  handler: async (ctx) => {
    const userId = await validateUser(ctx); // Validate the user
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .filter((q: any) => q.eq(q.field("isArchived"), true)) // Only include archived documents
      .order("desc")
      .collect(); // Collect and return results
  },
});

// Mutation to restore a document from the archive
export const restoreDocument = mutation({
  args: { id: v.id("documents") }, // Document ID to restore
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    const document = await fetchDocument(ctx, args.id, userId); // Fetch and validate the document

    const options: Partial<Doc<"documents">> = { isArchived: false }; // Set the archive status to false
    if (document.parentDocument) {
      const parentDocument = await ctx.db.get(document.parentDocument);
      if (parentDocument?.isArchived) options.parentDocument = undefined; // Unlink if the parent is archived
    }

    await ctx.db.patch(args.id, options); // Restore the document
    await recursiveOperation(ctx, args.id, userId, false); // Recursively restore children
  },
});

// Mutation to permanently remove a document
export const removeDocument = mutation({
  args: { id: v.id("documents") }, // Document ID to remove
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    await fetchDocument(ctx, args.id, userId); // Fetch and validate the document
    return await ctx.db.delete(args.id); // Delete the document
  },
});

// Query to search for documents
export const getSearch = query({
  handler: async (ctx) => {
    const userId = await validateUser(ctx); // Validate the user
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .filter((q: any) => q.eq(q.field("isArchived"), false)) // Exclude archived documents
      .order("desc")
      .collect(); // Collect and return results
  },
});

// Query to retrieve a document by its ID
export const getById = query({
  args: { documentId: v.id("documents") }, // Document ID to retrieve
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    const document = await fetchDocument(ctx, args.documentId, userId); // Fetch and validate the document
    return document; // Return the document
  },
});

// Mutation to update a document's details
export const updateDocument = mutation({
  args: {
    id: v.id("documents"), // Document ID to update
    title: v.optional(v.string()), // Optional title update
    content: v.optional(v.string()), // Optional content update
    coverImage: v.optional(v.string()), // Optional cover image update
    icon: v.optional(v.string()), // Optional icon update
    isPublished: v.optional(v.boolean()), // Optional published status update
  },
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    const { id, ...updateFields } = args; // Extract id and separate the fields to update
    await fetchDocument(ctx, id, userId); // Fetch and validate the document
    return await ctx.db.patch(id, updateFields); // Update the document with the provided fields
  },
});

// Mutation to remove a document's icon
export const removeIcon = mutation({
  args: { id: v.id("documents") }, // Document ID to update
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    await fetchDocument(ctx, args.id, userId); // Fetch and validate the document
    return await ctx.db.patch(args.id, { icon: undefined }); // Remove the icon
  },
});

// Mutation to remove a document's cover image
export const removeCoverImage = mutation({
  args: { id: v.id("documents") }, // Document ID to update
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx); // Validate the user
    await fetchDocument(ctx, args.id, userId); // Fetch and validate the document
    return await ctx.db.patch(args.id, { coverImage: undefined }); // Remove the cover image
  },
});
