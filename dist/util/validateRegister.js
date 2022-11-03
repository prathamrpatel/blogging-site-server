"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (username, password) => {
    if (username.length <= 0) {
        return [
            {
                field: 'username',
                message: 'Please enter a username',
            },
        ];
    }
    if (password.length < 5) {
        return [
            {
                field: 'password',
                message: 'Password must be at least 5 characters long',
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map