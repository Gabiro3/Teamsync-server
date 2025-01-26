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
exports.logOutController = exports.loginController = exports.registerUserController = exports.googleLoginCallback = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const app_config_1 = require("../config/app.config");
const auth_validation_1 = require("../validation/auth.validation");
const http_config_1 = require("../config/http.config");
const auth_service_1 = require("../services/auth.service");
const passport_1 = __importDefault(require("passport"));
exports.googleLoginCallback = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentWorkspace = (_a = req.user) === null || _a === void 0 ? void 0 : _a.currentWorkspace;
    if (!currentWorkspace) {
        return res.redirect(`${app_config_1.config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }
    return res.redirect(`${app_config_1.config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`);
}));
exports.registerUserController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = auth_validation_1.registerSchema.parse(Object.assign({}, req.body));
    yield (0, auth_service_1.registerUserService)(body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "User created successfully",
    });
}));
exports.loginController = (0, asyncHandler_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(http_config_1.HTTPSTATUS.UNAUTHORIZED).json({
                message: (info === null || info === void 0 ? void 0 : info.message) || "Invalid email or password",
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(http_config_1.HTTPSTATUS.OK).json({
                message: "Logged in successfully",
                user,
            });
        });
    })(req, res, next);
}));
exports.logOutController = (0, asyncHandler_middleware_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res
                .status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to log out" });
        }
    });
    req.session = null;
    return res
        .status(http_config_1.HTTPSTATUS.OK)
        .json({ message: "Logged out successfully" });
}));
//# sourceMappingURL=auth.controller.js.map