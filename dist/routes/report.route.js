"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report.controller");
const reportRoutes = (0, express_1.Router)();
// Endpoint to create a new report in a workspace
reportRoutes.post("/workspace/:workspaceId/create", report_controller_1.createReportController);
// Endpoint to delete a report by ID within a workspace
reportRoutes.delete("/workspace/:workspaceId/delete/:id", report_controller_1.deleteReportController);
// Endpoint to fetch all reports belonging to a specific workspace
reportRoutes.get("/workspace/:workspaceId/", report_controller_1.getReportsByWorkspaceController);
exports.default = reportRoutes;
//# sourceMappingURL=report.route.js.map