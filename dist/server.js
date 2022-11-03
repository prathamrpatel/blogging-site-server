"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const helloResolver_1 = require("./graphql/helloResolver");
const constants_1 = require("./constants");
const client_1 = require("@prisma/client");
const postResolver_1 = require("./graphql/postResolver");
const userResolver_1 = require("./graphql/userResolver");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_core_1 = require("apollo-server-core");
const ioredis_1 = __importDefault(require("ioredis"));
const server = async () => {
    const app = (0, express_1.default)();
    const prisma = new client_1.PrismaClient();
    const redisClient = new ioredis_1.default(process.env.REDIS_URL);
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    app.use((0, cors_1.default)({
        origin: ['http://localhost:3000'],
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: 'sid',
        store: new RedisStore({
            client: redisClient,
            disableTouch: true,
        }),
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'lax',
            secure: constants_1.PRODUCTION,
        },
    }));
    const server = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [helloResolver_1.HelloResolver, postResolver_1.PostResolver, userResolver_1.UserResolver],
            emitSchemaFile: true,
        }),
        context: ({ req, res }) => ({ req, res, prisma }),
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
    });
    await server.start();
    server.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(constants_1.PORT, () => {
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    });
};
server().catch((err) => console.log(err));
//# sourceMappingURL=server.js.map