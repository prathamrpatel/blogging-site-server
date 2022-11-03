"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("./User");
const runtime_1 = require("@prisma/client/runtime");
const UserResponse_1 = require("./UserResponse");
const validateRegister_1 = require("../util/validateRegister");
const validateLogin_1 = require("../util/validateLogin");
let UserResolver = class UserResolver {
    async logout({ req, res }) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res.clearCookie('sid');
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
    async currentUser({ req, prisma }) {
        if (!req.session.userId) {
            return null;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });
        if (!user) {
            return null;
        }
        return user;
    }
    async register(username, password, { req, prisma }) {
        const errors = (0, validateRegister_1.validateRegister)(username, password);
        if (errors) {
            return { errors };
        }
        const hashedPassword = await argon2_1.default.hash(password);
        let user;
        try {
            user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                },
                include: {
                    posts: true,
                },
            });
        }
        catch (e) {
            if (e instanceof runtime_1.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    return {
                        errors: [
                            {
                                field: 'username',
                                message: 'Username is already taken',
                            },
                        ],
                    };
                }
            }
        }
        req.session.userId = user === null || user === void 0 ? void 0 : user.id;
        return { user };
    }
    async login(username, password, { req, prisma }) {
        const errors = (0, validateLogin_1.validateLogin)(username, password);
        if (errors) {
            return { errors };
        }
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'User not found',
                    },
                ],
            };
        }
        const isPasswordValid = await argon2_1.default.verify(user.password, password);
        if (!isPasswordValid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Password is incorrect',
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return { user };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "currentUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)('username')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)('username')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=userResolver.js.map