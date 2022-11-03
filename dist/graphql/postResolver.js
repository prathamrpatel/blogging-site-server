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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const validatePost_1 = require("../util/validatePost");
const PaginatedPosts_1 = require("./PaginatedPosts");
const Post_1 = require("./Post");
const PostResponse_1 = require("./PostResponse");
let PostResolver = class PostResolver {
    bodySnippet(post) {
        return post.body.slice(0, 50);
    }
    async posts(take, cursor, { prisma }) {
        const realTake = Math.min(50, take);
        const realTakePlusOne = realTake + 1;
        let posts = null;
        if (cursor) {
            posts = await prisma.post.findMany({
                take: realTakePlusOne,
                skip: 1,
                cursor: cursor ? { createdAt: cursor } : undefined,
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
        else {
            posts = await prisma.post.findMany({
                take: realTakePlusOne,
                cursor: cursor ? { createdAt: cursor } : undefined,
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
        return {
            posts,
            hasMore: posts.length === realTakePlusOne,
        };
    }
    async post(postId, { prisma }) {
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post) {
            return null;
        }
        return post;
    }
    async createPost(title, body, { req, prisma }) {
        const errors = (0, validatePost_1.validatePost)(title, body);
        if (errors) {
            return { errors };
        }
        const post = await prisma.post.create({
            data: {
                title,
                body,
                authorId: req.session.userId,
            },
        });
        return { post };
    }
    async updatePost(postId, title, body, { req, prisma }) {
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post || post.authorId !== req.session.userId) {
            return null;
        }
        const errors = (0, validatePost_1.validatePost)(title, body);
        if (errors) {
            return { errors };
        }
        const updatedPost = await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                title,
                body,
            },
        });
        return updatedPost;
    }
    async deletePost(postId, { req, prisma }) {
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post) {
            return true;
        }
        if (post.authorId === req.session.userId) {
            await prisma.post.delete({
                where: {
                    id: postId,
                },
            });
            return true;
        }
        return false;
    }
    async getPostsByUser({ req, prisma }) {
        const posts = await prisma.post.findMany({
            where: {
                authorId: req.session.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return posts;
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "bodySnippet", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedPosts_1.PaginatedPosts),
    __param(0, (0, type_graphql_1.Arg)('take', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('cursor', { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('postId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse_1.PostResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('title')),
    __param(1, (0, type_graphql_1.Arg)('body')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse_1.PostResponse, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('postId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title')),
    __param(2, (0, type_graphql_1.Arg)('body')),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('postId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Post_1.Post]),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPostsByUser", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=postResolver.js.map