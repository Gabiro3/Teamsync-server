"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReportSchema = exports.createReportSchema = exports.reportIdSchema = exports.workspaceIdSchema = exports.createdBySchema = exports.fileUrlSchema = exports.descriptionSchema = exports.titleSchema = void 0;
const zod_1 = require("zod");
// Reusable schema definitions
exports.titleSchema = zod_1.z.string().trim().min(1).max(255);
exports.descriptionSchema = zod_1.z.string().trim().optional();
exports.fileUrlSchema = zod_1.z
    .string()
    .url({ message: "Invalid URL format." })
    .optional();
exports.createdBySchema = zod_1.z.string().trim().min(1);
exports.workspaceIdSchema = zod_1.z.string().trim().min(1);
exports.reportIdSchema = zod_1.z.string().trim().min(1);
// Create report schema
exports.createReportSchema = zod_1.z.object({
    title: exports.titleSchema,
    description: exports.descriptionSchema,
    file_url: exports.fileUrlSchema,
    created_by: exports.createdBySchema,
    workspace_id: exports.workspaceIdSchema,
    tag: zod_1.z.string().default("Report"),
});
// Delete report schema
exports.deleteReportSchema = zod_1.z.object({
    report_id: exports.reportIdSchema,
    workspace_id: exports.workspaceIdSchema,
});
//# sourceMappingURL=report.validation.js.map