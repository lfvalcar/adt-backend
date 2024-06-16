import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class UpdateGroupDto {

    @IsString()
    @IsIn(['add', 'delete','replace'])
    action: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(16)
    ou?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    memberUid: string[];
    
}
