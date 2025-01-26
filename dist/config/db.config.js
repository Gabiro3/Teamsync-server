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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
            socketTimeoutMS: 45000, // Increase socket timeout
            connectTimeoutMS: 20000, // Connection timeout
        });
        console.log("MongoDB Connected...");
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
// Add connection error handler
mongoose_1.default.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});
//# sourceMappingURL=db.config.js.map