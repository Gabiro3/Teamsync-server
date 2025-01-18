import { Router } from "express";
import {
  createReportController,
  deleteReportController,
  getReportsByWorkspaceController,
} from "../controllers/report.controller";

const reportRoutes = Router();

// Endpoint to create a new report in a workspace
reportRoutes.post("/workspace/:workspaceId/create", createReportController);

// Endpoint to delete a report by ID within a workspace
reportRoutes.delete("/workspace/:workspaceId/delete/:id", deleteReportController);

// Endpoint to fetch all reports belonging to a specific workspace
reportRoutes.get("/workspace/:workspaceId/", getReportsByWorkspaceController);

export default reportRoutes;
