import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  createReportService,
  deleteReportService,
  getReportsByWorkspaceService,
} from "../services/report.service";
import { workspaceIdSchema } from "../validation/workspace.validation";
import {reportIdSchema} from "../validation/report.validation";
import {createReportSchema} from "../validation/report.validation";
import { HTTPSTATUS } from "../config/http.config";
import { Permissions } from "../enums/role.enum";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";

/**
 * Controller for creating a new report.
 */
export const createReportController = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;
  
      // Validate and parse request body
      const body = createReportSchema.parse(req.body);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  
      const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
      roleGuard(role, [Permissions.CREATE_REPORT]);
  
      // Extract and format the `reportData`
      const reportData = {
        created_by: body.created_by,
        tag: body.tag,
        file_url: body.file_url,
        created_at: new Date(),
      };
  
      // Pass the formatted data to the service
      const { report } = await createReportService(workspaceId, userId, {
        title: body.title,
        description: body.description,
        reportData,
      });
  
      return res.status(HTTPSTATUS.CREATED).json({
        message: "Report created successfully",
        report,
      });
    }
  );
  

/**
 * Controller for viewing all reports of a particular workspace.
 */
export const getReportsByWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        const reports = await getReportsByWorkspaceService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Reports fetched successfully",
            reports,
        });
    }
);


/**
 * Controller for deleting a report.
 */
export const deleteReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const reportId = reportIdSchema.parse(req.params.id);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_REPORT]);

    await deleteReportService(workspaceId, reportId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Report deleted successfully",
    });
  }
);
