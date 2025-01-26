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
exports.verifyUserService = exports.registerUserService = exports.loginOrCreateAccountService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const account_model_1 = __importDefault(require("../models/account.model"));
const workspace_model_1 = __importDefault(require("../models/workspace.model"));
const roles_permission_model_1 = __importDefault(require("../models/roles-permission.model"));
const role_enum_1 = require("../enums/role.enum");
const appError_1 = require("../utils/appError");
const member_model_1 = __importDefault(require("../models/member.model"));
const account_provider_enum_1 = require("../enums/account-provider.enum");
const loginOrCreateAccountService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { providerId, provider, displayName, email, picture } = data;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        console.log("Started Session...");
        let user = yield user_model_1.default.findOne({ email }).session(session);
        if (!user) {
            // Create a new user if it doesn't exist
            user = new user_model_1.default({
                email,
                name: displayName,
                profilePicture: picture || null,
            });
            yield user.save({ session });
            const account = new account_model_1.default({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            });
            yield account.save({ session });
            // 3. Create a new workspace for the new user
            const workspace = new workspace_model_1.default({
                name: `My Workspace`,
                description: `Workspace created for ${user.name}`,
                owner: user._id,
            });
            yield workspace.save({ session });
            const ownerRole = yield roles_permission_model_1.default.findOne({
                name: role_enum_1.Roles.OWNER,
            }).session(session);
            if (!ownerRole) {
                throw new appError_1.NotFoundException("Owner role not found");
            }
            const member = new member_model_1.default({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });
            yield member.save({ session });
            user.currentWorkspace = workspace._id;
            yield user.save({ session });
        }
        yield session.commitTransaction();
        session.endSession();
        console.log("End Session...");
        return { user };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.loginOrCreateAccountService = loginOrCreateAccountService;
const registerUserService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = body;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const existingUser = yield user_model_1.default.findOne({ email }).session(session);
        if (existingUser) {
            throw new appError_1.BadRequestException("Email already exists");
        }
        const user = new user_model_1.default({
            email,
            name,
            password,
        });
        yield user.save({ session });
        const account = new account_model_1.default({
            userId: user._id,
            provider: account_provider_enum_1.ProviderEnum.EMAIL,
            providerId: email,
        });
        yield account.save({ session });
        // 3. Create a new workspace for the new user
        const workspace = new workspace_model_1.default({
            name: `My Workspace`,
            description: `Workspace created for ${user.name}`,
            owner: user._id,
        });
        yield workspace.save({ session });
        const ownerRole = yield roles_permission_model_1.default.findOne({
            name: role_enum_1.Roles.OWNER,
        }).session(session);
        if (!ownerRole) {
            throw new appError_1.NotFoundException("Owner role not found");
        }
        const member = new member_model_1.default({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        });
        yield member.save({ session });
        user.currentWorkspace = workspace._id;
        yield user.save({ session });
        yield session.commitTransaction();
        session.endSession();
        console.log("End Session...");
        return {
            userId: user._id,
            workspaceId: workspace._id,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.registerUserService = registerUserService;
const verifyUserService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, provider = account_provider_enum_1.ProviderEnum.EMAIL, }) {
    const account = yield account_model_1.default.findOne({ provider, providerId: email });
    if (!account) {
        throw new appError_1.NotFoundException("Invalid email or password");
    }
    const user = yield user_model_1.default.findById(account.userId);
    if (!user) {
        throw new appError_1.NotFoundException("User not found for the given account");
    }
    const isMatch = yield user.comparePassword(password);
    if (!isMatch) {
        throw new appError_1.UnauthorizedException("Invalid email or password");
    }
    return user.omitPassword();
});
exports.verifyUserService = verifyUserService;
//# sourceMappingURL=auth.service.js.map