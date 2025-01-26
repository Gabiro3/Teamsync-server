"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const taskRoutes = (0, express_1.Router)();
taskRoutes.post("/project/:projectId/workspace/:workspaceId/create", task_controller_1.createTaskController);
taskRoutes.delete("/:id/workspace/:workspaceId/delete", task_controller_1.deleteTaskController);
taskRoutes.put("/:id/project/:projectId/workspace/:workspaceId/update", task_controller_1.updateTaskController);
taskRoutes.get("/workspace/:workspaceId/all", task_controller_1.getAllTasksController);
taskRoutes.get("/:id/project/:projectId/workspace/:workspaceId", task_controller_1.getTaskByIdController);
exports.default = taskRoutes;
//# sourceMappingURL=task.route.js.map