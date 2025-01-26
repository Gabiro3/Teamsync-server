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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const app_config_1 = require("./app.config");
const appError_1 = require("../utils/appError");
const account_provider_enum_1 = require("../enums/account-provider.enum");
const auth_service_1 = require("../services/auth.service");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: app_config_1.config.GOOGLE_CLIENT_ID,
    clientSecret: app_config_1.config.GOOGLE_CLIENT_SECRET,
    callbackURL: app_config_1.config.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, sub: googleId, picture } = profile._json;
        console.log(profile, "profile");
        console.log(googleId, "googleId");
        if (!googleId) {
            throw new appError_1.NotFoundException("Google ID (sub) is missing");
        }
        const { user } = yield (0, auth_service_1.loginOrCreateAccountService)({
            provider: account_provider_enum_1.ProviderEnum.GOOGLE,
            displayName: profile.displayName,
            providerId: googleId,
            picture: picture,
            email: email,
        });
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
})));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
    session: true,
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.verifyUserService)({ email, password });
        return done(null, user);
    }
    catch (error) {
        return done(error, false, { message: error === null || error === void 0 ? void 0 : error.message });
    }
})));
passport_1.default.serializeUser((user, done) => done(null, user));
passport_1.default.deserializeUser((user, done) => done(null, user));
//# sourceMappingURL=passport.config.js.map