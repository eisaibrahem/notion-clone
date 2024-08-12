import { defineSchema, defineTable } from 'convex/server' // Importing functions to define schema and table in Convex
import { v } from 'convex/values' // Importing validation functions for data types

// Defining the schema for the database
export default defineSchema({
  // Defining the 'documents' table
  documents: defineTable({
    title: v.string(), // Field to store the title of the document as a string
    userId: v.string(), // Field to store the user ID as a string
    isArchived: v.boolean(), // Field to indicate if the document is archived (boolean)
    parentDocument: v.optional(v.id('documents')), // Optional field for the parent document ID (if this document is a sub-document)
    content: v.optional(v.string()), // Optional field to store the content of the document as a string
    coverImage: v.optional(v.string()), // Optional field for the cover image of the document as a string (URL or path)
    icon: v.optional(v.string()), // Optional field for a custom icon for the document as a string
    isPublished: v.boolean(), // Field to indicate if the document is published (boolean)
  })
  .index("by_user", ["userId"]) // Creating an index on 'userId' to speed up queries that filter by user
  .index("by_user_parent", ["userId", "parentDocument"]) // Creating an index on 'userId' and 'parentDocument' to optimize queries that filter by both
})
