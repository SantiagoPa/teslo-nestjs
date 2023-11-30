import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @ApiProperty({
        default: "jhon@test.com",
        description: "User email (unique)",
        uniqueItems: true,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "User password",
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        default: "Jhon Dow",
        description: "User fullName",
        minLength: 3
    })
    @IsString()
    @MinLength(3)
    fullName: string;

}