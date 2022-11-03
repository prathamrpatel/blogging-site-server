"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCTION = exports.PORT = void 0;
exports.PORT = process.env.PORT || 4000;
exports.PRODUCTION = process.env.NODE_ENV == 'production';
//# sourceMappingURL=constants.js.map