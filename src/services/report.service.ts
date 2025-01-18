import ReportModel from "../models/report.model";
import { BadRequestException, NotFoundException } from "../utils/appError";

export const createReportService = async (
    workspaceId: string,
    userId: string,
    body: {
        title: string;
        description?: string;
        reportData: any;
    }
) => {
    const { title, description, reportData } = body;

    const report = new ReportModel({
        title,
        description,
        reportData,
        file_url: reportData.file_url,
        tag: reportData.tag,
        created_by: reportData.created_by,
        workspace_id: workspaceId,
    });

    await report.save();

    return { report };
};

export const deleteReportService = async (
    workspaceId: string,
    reportId: string
) => {
    const report = await ReportModel.findOneAndDelete({
        _id: reportId,
        workspace_id: workspaceId,
    });

    if (!report) {
        throw new NotFoundException(
            "Report not found or does not belong to the specified workspace"
        );
    }

    return;
};

export const getReportsByWorkspaceService = async (workspaceId: string) => {
    const reports = await ReportModel.find({ workspace_id: workspaceId });

    if (!reports.length) {
        throw new NotFoundException("No reports found for the specified workspace.");
    }

    return reports;
};
