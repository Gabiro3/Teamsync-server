"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const projectRoutes = (0, express_1.Router)();
projectRoutes.post("/workspace/:workspaceId/create", project_controller_1.createProjectController);
projectRoutes.put("/:id/workspace/:workspaceId/update", project_controller_1.updateProjectController);
projectRoutes.delete("/:id/workspace/:workspaceId/delete", project_controller_1.deleteProjectController);
projectRoutes.get("/workspace/:workspaceId/all", project_controller_1.getAllProjectsInWorkspaceController);
projectRoutes.get("/:id/workspace/:workspaceId/analytics", project_controller_1.getProjectAnalyticsController);
projectRoutes.get("/:id/workspace/:workspaceId", project_controller_1.getProjectByIdAndWorkspaceIdController);
exports.default = projectRoutes;
//# sourceMappingURL=project.route.js.map