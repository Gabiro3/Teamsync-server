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
exports.deleteProjectService = exports.updateProjectService = exports.getProjectAnalyticsService = exports.getProjectByIdAndWorkspaceIdService = exports.getProjectsInWorkspaceService = exports.createProjectService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const project_model_1 = __importDefault(require("../models/project.model"));
const task_model_1 = __importDefault(require("../models/task.model"));
const appError_1 = require("../utils/appError");
const task_enum_1 = require("../enums/task.enum");
const createProjectService = (userId, workspaceId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const project = new project_model_1.default(Object.assign(Object.assign({}, (body.emoji && { emoji: body.emoji })), { name: body.name, description: body.description, workspace: workspaceId, createdBy: userId }));
    yield project.save();
    return { project };
});
exports.createProjectService = createProjectService;
const getProjectsInWorkspaceService = (workspaceId, pageSize, pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find all projects in the workspace
    const totalCount = yield project_model_1.default.countDocuments({
        workspace: workspaceId,
    });
    const skip = (pageNumber - 1) * pageSize;
    const projects = yield project_model_1.default.find({
        workspace: workspaceId,
    })
        .skip(skip)
        .limit(pageSize)
        .populate("createdBy", "_id name profilePicture -password")
        .sort({ createdAt: -1 });
    const totalPages = Math.ceil(totalCount / pageSize);
    return { projects, totalCount, totalPages, skip };
});
exports.getProjectsInWorkspaceService = getProjectsInWorkspaceService;
const getProjectByIdAndWorkspaceIdService = (workspaceId, projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findOne({
        _id: projectId,
        workspace: workspaceId,
    }).select("_id emoji name description");
    if (!project) {
        throw new appError_1.NotFoundException("Project not found or does not belong to the specified workspace");
    }
    return { project };
});
exports.getProjectByIdAndWorkspaceIdService = getProjectByIdAndWorkspaceIdService;
const getProjectAnalyticsService = (workspaceId, projectId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const project = yield project_model_1.default.findById(projectId);
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
        throw new appError_1.NotFoundException("Project not found or does not belong to this workspace");
    }
    const currentDate = new Date();
    //USING Mongoose aggregate
    const taskAnalytics = yield task_model_1.default.aggregate([
        {
            $match: {
                project: new mongoose_1.default.Types.ObjectId(projectId),
            },
        },
        {
            $facet: {
                totalTasks: [{ $count: "count" }],
                overdueTasks: [
                    {
                        $match: {
                            dueDate: { $lt: currentDate },
                            status: {
                                $ne: task_enum_1.TaskStatusEnum.DONE,
                            },
                        },
                    },
                    {
                        $count: "count",
                    },
                ],
                completedTasks: [
                    {
                        $match: {
                            status: task_enum_1.TaskStatusEnum.DONE,
                        },
                    },
                    { $count: "count" },
                ],
            },
        },
    ]);
    const _analytics = taskAnalytics[0];
    const analytics = {
        totalTasks: ((_a = _analytics.totalTasks[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
        overdueTasks: ((_b = _analytics.overdueTasks[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
        completedTasks: ((_c = _analytics.completedTasks[0]) === null || _c === void 0 ? void 0 : _c.count) || 0,
    };
    return {
        analytics,
    };
});
exports.getProjectAnalyticsService = getProjectAnalyticsService;
const updateProjectService = (workspaceId, projectId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, emoji, description } = body;
    const project = yield project_model_1.default.findOne({
        _id: projectId,
        workspace: workspaceId,
    });
    if (!project) {
        throw new appError_1.NotFoundException("Project not found or does not belong to the specified workspace");
    }
    if (emoji)
        project.emoji = emoji;
    if (name)
        project.name = name;
    if (description)
        project.description = description;
    yield project.save();
    return { project };
});
exports.updateProjectService = updateProjectService;
const deleteProjectService = (workspaceId, projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findOne({
        _id: projectId,
        workspace: workspaceId,
    });
    if (!project) {
        throw new appError_1.NotFoundException("Project not found or does not belong to the specified workspace");
    }
    yield project.deleteOne();
    yield task_model_1.default.deleteMany({
        project: project._id,
    });
    return project;
});
exports.deleteProjectService = deleteProjectService;
//# sourceMappingURL=project.service.js.map