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
exports.deleteProjectController = exports.updateProjectController = exports.getProjectAnalyticsController = exports.getProjectByIdAndWorkspaceIdController = exports.getAllProjectsInWorkspaceController = exports.createProjectController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const project_validation_1 = require("../validation/project.validation");
const workspace_validation_1 = require("../validation/workspace.validation");
const member_service_1 = require("../services/member.service");
const roleGuard_1 = require("../utils/roleGuard");
const role_enum_1 = require("../enums/role.enum");
const project_service_1 = require("../services/project.service");
const http_config_1 = require("../config/http.config");
exports.createProjectController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = project_validation_1.createProjectSchema.parse(req.body);
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.CREATE_PROJECT]);
    const { project } = yield (0, project_service_1.createProjectService)(userId, workspaceId, body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Project created successfully",
        project,
    });
}));
exports.getAllProjectsInWorkspaceController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.VIEW_ONLY]);
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const { projects, totalCount, totalPages, skip } = yield (0, project_service_1.getProjectsInWorkspaceService)(workspaceId, pageSize, pageNumber);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Project fetched successfully",
        projects,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages,
            skip,
            limit: pageSize,
        },
    });
}));
exports.getProjectByIdAndWorkspaceIdController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const projectId = project_validation_1.projectIdSchema.parse(req.params.id);
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.VIEW_ONLY]);
    const { project } = yield (0, project_service_1.getProjectByIdAndWorkspaceIdService)(workspaceId, projectId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Project fetched successfully",
        project,
    });
}));
exports.getProjectAnalyticsController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const projectId = project_validation_1.projectIdSchema.parse(req.params.id);
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.VIEW_ONLY]);
    const { analytics } = yield (0, project_service_1.getProjectAnalyticsService)(workspaceId, projectId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Project analytics retrieved successfully",
        analytics,
    });
}));
exports.updateProjectController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const projectId = project_validation_1.projectIdSchema.parse(req.params.id);
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const body = project_validation_1.updateProjectSchema.parse(req.body);
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.EDIT_PROJECT]);
    const { project } = yield (0, project_service_1.updateProjectService)(workspaceId, projectId, body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Project updated successfully",
        project,
    });
}));
exports.deleteProjectController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const projectId = project_validation_1.projectIdSchema.parse(req.params.id);
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.workspaceId);
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.DELETE_PROJECT]);
    yield (0, project_service_1.deleteProjectService)(workspaceId, projectId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Project deleted successfully",
    });
}));
//# sourceMappingURL=project.controller.js.map