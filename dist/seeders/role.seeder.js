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
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const database_config_1 = __importDefault(require("../config/database.config"));
const roles_permission_model_1 = __importDefault(require("../models/roles-permission.model"));
const role_permission_1 = require("../utils/role-permission");
const seedRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Seeding roles started...");
    try {
        yield (0, database_config_1.default)();
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        console.log("Clearing existing roles...");
        yield roles_permission_model_1.default.deleteMany({}, { session });
        for (const roleName in role_permission_1.RolePermissions) {
            const role = roleName;
            const permissions = role_permission_1.RolePermissions[role];
            // Check if the role already exists
            const existingRole = yield roles_permission_model_1.default.findOne({ name: role }).session(session);
            if (!existingRole) {
                const newRole = new roles_permission_model_1.default({
                    name: role,
                    permissions: permissions,
                });
                yield newRole.save({ session });
                console.log(`Role ${role} added with permissions.`);
            }
            else {
                console.log(`Role ${role} already exists.`);
            }
        }
        yield session.commitTransaction();
        console.log("Transaction committed.");
        session.endSession();
        console.log("Session ended.");
        console.log("Seeding completed successfully.");
    }
    catch (error) {
        console.error("Error during seeding:", error);
    }
});
seedRoles().catch((error) => console.error("Error running seed script:", error));
//# sourceMappingURL=role.seeder.js.map