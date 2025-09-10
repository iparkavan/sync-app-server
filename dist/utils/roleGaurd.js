"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGaurd = void 0;
const appError_1 = require("./appError");
const role_permission_1 = require("./role-permission");
const roleGaurd = (role, requiredPermissions) => {
    const permissions = role_permission_1.RolePermissions[role];
    const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission));
    if (!hasPermission) {
        throw new appError_1.UnauthorizedException("You do not have the necessary permission to perform this action");
    }
};
exports.roleGaurd = roleGaurd;
