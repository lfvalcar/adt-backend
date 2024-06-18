import { IsAlphanumeric, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateOusDto {

    @IsString()
    @IsIn(['add', 'delete','replace'])
    action: string;

    @IsOptional()
    @MinLength(4)
    @IsString()
    @IsAlphanumeric()
    ou?: string;

    @IsOptional()
    @IsString()
    description?: string;
    
}
