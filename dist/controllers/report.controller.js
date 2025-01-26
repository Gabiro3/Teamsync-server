"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReportController = exports.getReportsByWorkspaceController = exports.createReportController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const report_service_1 = require("../services/report.service");
const workspace_validation_1 = require("../validation/workspace.validation");
const report_validation_1 = require("../validation/report.validation");
const report_validation_2 = require("../validation/report.validation");
const http_config_1 = require("../config/http.config");
const role_enum_1 = require("../enums/role.enum");
const member_service_1 = require("../services/member.service");
const roleGuard_1 = require("../utils/roleGuard");
/**
 * Controller for creating a new report.
 */
exports.createReportController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // Validate and parse request body
    const body = report_validation_2.createReportSchema.parse(req.body);
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.CREATE_REPORT]);
    // Extract and format the `reportData`
    const reportData = {
        created_by: body.created_by,
        tag: body.tag,
        file_url: body.file_url,
        created_at: new Date(),
    };
    // Pass the formatted data to the service
    const { report } = yield (0, report_service_1.createReportService)(workspaceId, userId, {
        title: body.title,
        description: body.description,
        reportData,
    });
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Report created successfully",
        report,
    });
}));
/**
 * Controller for viewing all reports of a particular workspace.
 */
exports.getReportsByWorkspaceController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const reports = yield (0, report_service_1.getReportsByWorkspaceService)(workspaceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Reports fetched successfully",
        reports,
    });
}));
/**
 * Controller for deleting a report.
 */
exports.deleteReportController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const reportId = report_validation_1.reportIdSchema.parse(req.params.id);
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.DELETE_REPORT]);
    yield (0, report_service_1.deleteReportService)(workspaceId, reportId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Report deleted successfully",
    });
}));
//# sourceMappingURL=report.controller.js.map