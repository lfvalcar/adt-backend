import { IsAlphanumeric, IsString, MinLength } from "class-validator";


export class CreateOusDto {

    @MinLength(2)
    @IsString()
    @IsAlphanumeric()
    ou: string;

    @IsString()
    description: string;

}
