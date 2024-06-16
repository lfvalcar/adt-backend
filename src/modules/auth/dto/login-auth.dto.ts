import { IsAlpha, IsString } from "class-validator";


export class LoginAuthDto {

    @IsAlpha()
    username: string;

    @IsString()
    password: string;
}
