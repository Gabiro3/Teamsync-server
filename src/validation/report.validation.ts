import { z } from "zod";

// Reusable schema definitions
export const titleSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();
export const fileUrlSchema = z
  .string()
  .url({ message: "Invalid URL format." })
  .optional();

export const createdBySchema = z.string().trim().min(1);
export const workspaceIdSchema = z.string().trim().min(1);
export const reportIdSchema = z.string().trim().min(1);

// Create report schema
export const createReportSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  file_url: fileUrlSchema,
  created_by: createdBySchema,
  workspace_id: workspaceIdSchema,
  tag: z.string().default("Report"),
});

// Delete report schema
export const deleteReportSchema = z.object({
  report_id: reportIdSchema,
  workspace_id: workspaceIdSchema,
});
