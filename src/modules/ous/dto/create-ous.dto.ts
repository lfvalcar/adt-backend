import { IsString, MinLength } from "class-validator";


export class CreateOusDto {

    @MinLength(2)
    @IsString()
    ou: string;

    @IsString()
    description: string;

}
