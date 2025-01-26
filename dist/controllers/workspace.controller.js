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
exports.deleteWorkspaceByIdController = exports.updateWorkspaceByIdController = exports.changeWorkspaceMemberRoleController = exports.getWorkspaceAnalyticsController = exports.getWorkspaceMembersController = exports.getWorkspaceByIdController = exports.getAllWorkspacesUserIsMemberController = exports.createWorkspaceController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const workspace_validation_1 = require("../validation/workspace.validation");
const http_config_1 = require("../config/http.config");
const workspace_service_1 = require("../services/workspace.service");
const member_service_1 = require("../services/member.service");
const role_enum_1 = require("../enums/role.enum");
const roleGuard_1 = require("../utils/roleGuard");
const workspace_validation_2 = require("../validation/workspace.validation");
exports.createWorkspaceController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = workspace_validation_1.createWorkspaceSchema.parse(req.body);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { workspace } = yield (0, workspace_service_1.createWorkspaceService)(userId, body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace,
    });
}));
// Controller: Get all workspaces the user is part of
exports.getAllWorkspacesUserIsMemberController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { workspaces } = yield (0, workspace_service_1.getAllWorkspacesUserIsMemberService)(userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User workspaces fetched successfully",
        workspaces,
    });
}));
exports.getWorkspaceByIdController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    const { workspace } = yield (0, workspace_service_1.getWorkspaceByIdService)(workspaceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        workspace,
    });
}));
exports.getWorkspaceMembersController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.VIEW_ONLY]);
    const { members, roles } = yield (0, workspace_service_1.getWorkspaceMembersService)(workspaceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace members retrieved successfully",
        members,
        roles,
    });
}));
exports.getWorkspaceAnalyticsController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.VIEW_ONLY]);
    const { analytics } = yield (0, workspace_service_1.getWorkspaceAnalyticsService)(workspaceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace analytics retrieved successfully",
        analytics,
    });
}));
exports.changeWorkspaceMemberRoleController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = workspace_validation_1.changeRoleSchema.parse(req.body);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.CHANGE_MEMBER_ROLE]);
    const { member } = yield (0, workspace_service_1.changeMemberRoleService)(workspaceId, memberId, roleId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Member Role changed successfully",
        member,
    });
}));
exports.updateWorkspaceByIdController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const { name, description } = workspace_validation_2.updateWorkspaceSchema.parse(req.body);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.EDIT_WORKSPACE]);
    const { workspace } = yield (0, workspace_service_1.updateWorkspaceByIdService)(workspaceId, name, description);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace,
    });
}));
exports.deleteWorkspaceByIdController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { role } = yield (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.DELETE_WORKSPACE]);
    const { currentWorkspace } = yield (0, workspace_service_1.deleteWorkspaceService)(workspaceId, userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace deleted successfully",
        currentWorkspace,
    });
}));
//# sourceMappingURL=workspace.controller.js.map