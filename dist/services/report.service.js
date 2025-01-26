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
exports.getReportsByWorkspaceService = exports.deleteReportService = exports.createReportService = void 0;
const report_model_1 = __importDefault(require("../models/report.model"));
const appError_1 = require("../utils/appError");
const createReportService = (workspaceId, userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, reportData } = body;
    const report = new report_model_1.default({
        title,
        description,
        reportData,
        file_url: reportData.file_url,
        tag: reportData.tag,
        created_by: reportData.created_by,
        workspace_id: workspaceId,
    });
    yield report.save();
    return { report };
});
exports.createReportService = createReportService;
const deleteReportService = (workspaceId, reportId) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield report_model_1.default.findOneAndDelete({
        _id: reportId,
        workspace_id: workspaceId,
    });
    if (!report) {
        throw new appError_1.NotFoundException("Report not found or does not belong to the specified workspace");
    }
    return;
});
exports.deleteReportService = deleteReportService;
const getReportsByWorkspaceService = (workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield report_model_1.default.find({ workspace_id: workspaceId });
    if (!reports.length) {
        throw new appError_1.NotFoundException("No reports found for the specified workspace.");
    }
    return reports;
});
exports.getReportsByWorkspaceService = getReportsByWorkspaceService;
//# sourceMappingURL=report.service.js.map