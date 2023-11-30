import { UseGuards, applyDecorators } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport";
import { RoleProtected } from "./role-protected.decorator";
import { UserRoleGuard } from "../guards";
import { ValidRoles } from "../interfaces"

export const Auth = (...roles: ValidRoles[]) => {
    return applyDecorators(
        RoleProtected( ...roles ),
        UseGuards( AuthGuard(), UserRoleGuard ),
    );
}