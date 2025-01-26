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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinWorkspaceByInviteService = exports.getMemberRoleInWorkspace = void 0;
const error_code_enum_1 = require("../enums/error-code.enum");
const role_enum_1 = require("../enums/role.enum");
const member_model_1 = __importDefault(require("../models/member.model"));
const roles_permission_model_1 = __importDefault(require("../models/roles-permission.model"));
const workspace_model_1 = __importDefault(require("../models/workspace.model"));
const appError_1 = require("../utils/appError");
const getMemberRoleInWorkspace = (userId, workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspace = yield workspace_model_1.default.findById(workspaceId);
    if (!workspace) {
        throw new appError_1.NotFoundException("Workspace not found");
    }
    const member = yield member_model_1.default.findOne({
        userId,
        workspaceId,
    }).populate("role");
    if (!member) {
        throw new appError_1.UnauthorizedException("You are not a member of this workspace", error_code_enum_1.ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }
    const roleName = (_a = member.role) === null || _a === void 0 ? void 0 : _a.name;
    return { role: roleName };
});
exports.getMemberRoleInWorkspace = getMemberRoleInWorkspace;
const joinWorkspaceByInviteService = (userId, inviteCode) => __awaiter(void 0, void 0, void 0, function* () {
    // Find workspace by invite code
    const workspace = yield workspace_model_1.default.findOne({ inviteCode }).exec();
    if (!workspace) {
        throw new appError_1.NotFoundException("Invalid invite code or workspace not found");
    }
    // Check if user is already a member
    const existingMember = yield member_model_1.default.findOne({
        userId,
        workspaceId: workspace._id,
    }).exec();
    if (existingMember) {
        throw new appError_1.BadRequestException("You are already a member of this workspace");
    }
    const role = yield roles_permission_model_1.default.findOne({ name: role_enum_1.Roles.MEMBER });
    if (!role) {
        throw new appError_1.NotFoundException("Role not found");
    }
    // Add user to workspace as a member
    const newMember = new member_model_1.default({
        userId,
        workspaceId: workspace._id,
        role: role._id,
    });
    yield newMember.save();
    return { workspaceId: workspace._id, role: role.name };
});
exports.joinWorkspaceByInviteService = joinWorkspaceByInviteService;
//# sourceMappingURL=member.service.js.map