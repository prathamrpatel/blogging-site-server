"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePost = void 0;
const validatePost = (title, body) => {
    if (title.length === 0) {
        return [
            {
                field: 'title',
                message: 'Enter a title',
            },
        ];
    }
    if (body.length === 0) {
        return [
            {
                field: 'body',
                message: 'Body cannot be left empty',
            },
        ];
    }
    return null;
};
exports.validatePost = validatePost;
//# sourceMappingURL=validateUpdatePost.js.map