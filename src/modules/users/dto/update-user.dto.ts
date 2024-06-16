import { IsString, MaxLength, MinLength, IsNotEmpty, IsStrongPassword, Matches, IsEmail, IsMobilePhone, IsOptional, IsPhoneNumber, IsEmpty, IsIn, IsAlpha, IsNumberString, Length, IsArray } from 'class-validator';

export class UpdateUserDto {
    
    @IsAlpha()
    @IsIn(['add','delete','replace'])
    action: string;

    @IsOptional()
    @IsArray()
    fields?: string[];

    @IsOptional()
    @IsAlpha()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(16)
    ou?: string;

    @IsOptional()
    @MaxLength(50)
    @MinLength(3)
    @IsString()
    givenName?: string;

    @IsOptional()
    @MaxLength(50)
    @MinLength(3)
    @IsString()
    sn?: string;
    
    @IsOptional()
    @MaxLength(100)
    @MinLength(6)
    @IsString()
    cn?: string;

    @IsOptional()
    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    @MinLength(12)
    @Matches(/(?=.*[a-z])/)
    @Matches(/(?=.*[A-Z])/)
    @Matches(/(?=.*\d)/)
    @Matches(/(?=.*[@$!%*?{}&])/)
    userPassword?: string;

    @IsOptional()
    @IsEmail()
    mail?: string;

    @IsOptional()
    @IsString()
    @Length(11)
    mobile?: string;

    @IsOptional()
    @MinLength(3)
    @IsString()
    st?: string;

    @IsOptional()
    @MinLength(3)
    @IsString()
    title?: string;

    @IsOptional()
    @MinLength(3)
    @IsString()
    l?: string;

    @IsOptional()
    @IsAlpha()
    group?: string;

    @IsOptional()
    @Length(4)
    @IsNumberString()
    telephoneNumber?: string;

    @IsOptional()
    @IsString()
    description?: string;

}
