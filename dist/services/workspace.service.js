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
exports.deleteWorkspaceService = exports.updateWorkspaceByIdService = exports.changeMemberRoleService = exports.getWorkspaceAnalyticsService = exports.getWorkspaceMembersService = exports.getWorkspaceByIdService = exports.getAllWorkspacesUserIsMemberService = exports.createWorkspaceService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const role_enum_1 = require("../enums/role.enum");
const member_model_1 = __importDefault(require("../models/member.model"));
const roles_permission_model_1 = __importDefault(require("../models/roles-permission.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const workspace_model_1 = __importDefault(require("../models/workspace.model"));
const appError_1 = require("../utils/appError");
const task_model_1 = __importDefault(require("../models/task.model"));
const task_enum_1 = require("../enums/task.enum");
const project_model_1 = __importDefault(require("../models/project.model"));
//********************************
// CREATE NEW WORKSPACE
//**************** **************/
const createWorkspaceService = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = body;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new appError_1.NotFoundException("User not found");
    }
    const ownerRole = yield roles_permission_model_1.default.findOne({ name: role_enum_1.Roles.OWNER });
    if (!ownerRole) {
        throw new appError_1.NotFoundException("Owner role not found");
    }
    const workspace = new workspace_model_1.default({
        name: name,
        description: description,
        owner: user._id,
    });
    yield workspace.save();
    const member = new member_model_1.default({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
    });
    yield member.save();
    user.currentWorkspace = workspace._id;
    yield user.save();
    return {
        workspace,
    };
});
exports.createWorkspaceService = createWorkspaceService;
//********************************
// GET WORKSPACES USER IS A MEMBER
//**************** **************/
const getAllWorkspacesUserIsMemberService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const memberships = yield member_model_1.default.find({ userId })
        .populate("workspaceId")
        .select("-password")
        .exec();
    // Extract workspace details from memberships
    const workspaces = memberships.map((membership) => membership.workspaceId);
    return { workspaces };
});
exports.getAllWorkspacesUserIsMemberService = getAllWorkspacesUserIsMemberService;
const getWorkspaceByIdService = (workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    const workspace = yield workspace_model_1.default.findById(workspaceId);
    if (!workspace) {
        throw new appError_1.NotFoundException("Workspace not found");
    }
    const members = yield member_model_1.default.find({
        workspaceId,
    }).populate("role");
    const workspaceWithMembers = Object.assign(Object.assign({}, workspace.toObject()), { members });
    return {
        workspace: workspaceWithMembers,
    };
});
exports.getWorkspaceByIdService = getWorkspaceByIdService;
//********************************
// GET ALL MEMEBERS IN WORKSPACE
//**************** **************/
const getWorkspaceMembersService = (workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all members of the workspace
    const members = yield member_model_1.default.find({
        workspaceId,
    })
        .populate("userId", "name email profilePicture -password")
        .populate("role", "name");
    const roles = yield roles_permission_model_1.default.find({}, { name: 1, _id: 1 })
        .select("-permission")
        .lean();
    return { members, roles };
});
exports.getWorkspaceMembersService = getWorkspaceMembersService;
const getWorkspaceAnalyticsService = (workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const totalTasks = yield task_model_1.default.countDocuments({
        workspace: workspaceId,
    });
    const overdueTasks = yield task_model_1.default.countDocuments({
        workspace: workspaceId,
        dueDate: { $lt: currentDate },
        status: { $ne: task_enum_1.TaskStatusEnum.DONE },
    });
    const completedTasks = yield task_model_1.default.countDocuments({
        workspace: workspaceId,
        status: task_enum_1.TaskStatusEnum.DONE,
    });
    const analytics = {
        totalTasks,
        overdueTasks,
        completedTasks,
    };
    return { analytics };
});
exports.getWorkspaceAnalyticsService = getWorkspaceAnalyticsService;
const changeMemberRoleService = (workspaceId, memberId, roleId) => __awaiter(void 0, void 0, void 0, function* () {
    const workspace = yield workspace_model_1.default.findById(workspaceId);
    if (!workspace) {
        throw new appError_1.NotFoundException("Workspace not found");
    }
    const role = yield roles_permission_model_1.default.findById(roleId);
    if (!role) {
        throw new appError_1.NotFoundException("Role not found");
    }
    const member = yield member_model_1.default.findOne({
        userId: memberId,
        workspaceId: workspaceId,
    });
    if (!member) {
        throw new Error("Member not found in the workspace");
    }
    member.role = role;
    yield member.save();
    return {
        member,
    };
});
exports.changeMemberRoleService = changeMemberRoleService;
//********************************
// UPDATE WORKSPACE
//**************** **************/
const updateWorkspaceByIdService = (workspaceId, name, description) => __awaiter(void 0, void 0, void 0, function* () {
    const workspace = yield workspace_model_1.default.findById(workspaceId);
    if (!workspace) {
        throw new appError_1.NotFoundException("Workspace not found");
    }
    // Update the workspace details
    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    yield workspace.save();
    return {
        workspace,
    };
});
exports.updateWorkspaceByIdService = updateWorkspaceByIdService;
const deleteWorkspaceService = (workspaceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const workspace = yield workspace_model_1.default.findById(workspaceId).session(session);
        if (!workspace) {
            throw new appError_1.NotFoundException("Workspace not found");
        }
        // Check if the user owns the workspace
        if (workspace.owner.toString() !== userId) {
            throw new appError_1.BadRequestException("You are not authorized to delete this workspace");
        }
        const user = yield user_model_1.default.findById(userId).session(session);
        if (!user) {
            throw new appError_1.NotFoundException("User not found");
        }
        yield project_model_1.default.deleteMany({ workspace: workspace._id }).session(session);
        yield task_model_1.default.deleteMany({ workspace: workspace._id }).session(session);
        yield member_model_1.default.deleteMany({
            workspaceId: workspace._id,
        }).session(session);
        // Update the user's currentWorkspace if it matches the deleted workspace
        if ((_a = user === null || user === void 0 ? void 0 : user.currentWorkspace) === null || _a === void 0 ? void 0 : _a.equals(workspaceId)) {
            const memberWorkspace = yield member_model_1.default.findOne({ userId }).session(session);
            // Update the user's currentWorkspace
            user.currentWorkspace = memberWorkspace
                ? memberWorkspace.workspaceId
                : null;
            yield user.save({ session });
        }
        yield workspace.deleteOne({ session });
        yield session.commitTransaction();
        session.endSession();
        return {
            currentWorkspace: user.currentWorkspace,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.deleteWorkspaceService = deleteWorkspaceService;
//# sourceMappingURL=workspace.service.js.map