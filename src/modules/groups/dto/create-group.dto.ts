import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateGroupDto {

    @IsString()
    @MaxLength(24)
    @MinLength(4)
    cn: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(16)
    ou: string;

    @IsOptional()
    @IsString()
    description?: string;

    @Matches(/^[\w\s]+(,[\w\s]+)*$/)
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.split(',').map((memberUid: string) => memberUid.trim()))
    memberUid?: string[];
    
}
