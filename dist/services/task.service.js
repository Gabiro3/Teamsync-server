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
exports.deleteTaskService = exports.getTaskByIdService = exports.getAllTasksService = exports.updateTaskService = exports.createTaskService = void 0;
const task_enum_1 = require("../enums/task.enum");
const member_model_1 = __importDefault(require("../models/member.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const task_model_1 = __importDefault(require("../models/task.model"));
const appError_1 = require("../utils/appError");
const createTaskService = (workspaceId, projectId, userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, priority, status, assignedTo, dueDate } = body;
    const project = yield project_model_1.default.findById(projectId);
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
        throw new appError_1.NotFoundException("Project not found or does not belong to this workspace");
    }
    if (assignedTo) {
        const isAssignedUserMember = yield member_model_1.default.exists({
            userId: assignedTo,
            workspaceId,
        });
        if (!isAssignedUserMember) {
            throw new Error("Assigned user is not a member of this workspace.");
        }
    }
    const task = new task_model_1.default({
        title,
        description,
        priority: priority || task_enum_1.TaskPriorityEnum.MEDIUM,
        status: status || task_enum_1.TaskStatusEnum.TODO,
        assignedTo,
        createdBy: userId,
        workspace: workspaceId,
        project: projectId,
        dueDate,
    });
    yield task.save();
    return { task };
});
exports.createTaskService = createTaskService;
const updateTaskService = (workspaceId, projectId, taskId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
        throw new appError_1.NotFoundException("Project not found or does not belong to this workspace");
    }
    const task = yield task_model_1.default.findById(taskId);
    if (!task || task.project.toString() !== projectId.toString()) {
        throw new appError_1.NotFoundException("Task not found or does not belong to this project");
    }
    const updatedTask = yield task_model_1.default.findByIdAndUpdate(taskId, Object.assign({}, body), { new: true });
    if (!updatedTask) {
        throw new appError_1.BadRequestException("Failed to update task");
    }
    return { updatedTask };
});
exports.updateTaskService = updateTaskService;
const getAllTasksService = (workspaceId, filters, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const query = {
        workspace: workspaceId,
    };
    if (filters.projectId) {
        query.project = filters.projectId;
    }
    if (filters.status && ((_a = filters.status) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        query.status = { $in: filters.status };
    }
    if (filters.priority && ((_b = filters.priority) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        query.priority = { $in: filters.priority };
    }
    if (filters.assignedTo && ((_c = filters.assignedTo) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        query.assignedTo = { $in: filters.assignedTo };
    }
    if (filters.keyword && filters.keyword !== undefined) {
        query.title = { $regex: filters.keyword, $options: "i" };
    }
    if (filters.dueDate) {
        query.dueDate = {
            $eq: new Date(filters.dueDate),
        };
    }
    //Pagination Setup
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;
    const [tasks, totalCount] = yield Promise.all([
        task_model_1.default.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .populate("assignedTo", "_id name profilePicture -password")
            .populate("project", "_id emoji name"),
        task_model_1.default.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        tasks,
        pagination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip,
        },
    };
});
exports.getAllTasksService = getAllTasksService;
const getTaskByIdService = (workspaceId, projectId, taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
        throw new appError_1.NotFoundException("Project not found or does not belong to this workspace");
    }
    const task = yield task_model_1.default.findOne({
        _id: taskId,
        workspace: workspaceId,
        project: projectId,
    }).populate("assignedTo", "_id name profilePicture -password");
    if (!task) {
        throw new appError_1.NotFoundException("Task not found.");
    }
    return task;
});
exports.getTaskByIdService = getTaskByIdService;
const deleteTaskService = (workspaceId, taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findOneAndDelete({
        _id: taskId,
        workspace: workspaceId,
    });
    if (!task) {
        throw new appError_1.NotFoundException("Task not found or does not belong to the specified workspace");
    }
    return;
});
exports.deleteTaskService = deleteTaskService;
//# sourceMappingURL=task.service.js.map