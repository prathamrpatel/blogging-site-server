"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const validateLogin = (username, password) => {
    if (username.length === 0) {
        return [
            {
                field: 'username',
                message: 'Please enter a username',
            },
        ];
    }
    if (password.length === 0) {
        return [
            {
                field: 'password',
                message: 'Please enter a password',
            },
        ];
    }
    return null;
};
exports.validateLogin = validateLogin;
//# sourceMappingURL=validateLogin.js.map