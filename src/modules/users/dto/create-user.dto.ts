import { IsAlpha, IsAlphanumeric, IsEmail, IsInt, IsMobilePhone, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length, Matches, Max, MaxLength, Min, MinLength, isNotEmpty } from "class-validator";

export class CreateUserDto {

    @MaxLength(32)
    @MinLength(2)
    @IsNotEmpty()
    @IsAlpha()
    uid: string;

    @IsAlphanumeric()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(16)
    ou: string;

    @MaxLength(50)
    @MinLength(3)
    @IsString()
    @Matches(/^[a-zA-Z ]$/)
    givenName: string;

    @MaxLength(50)
    @MinLength(3)
    @IsString()
    @Matches(/^[a-zA-Z ]$/)
    sn: string;
    
    @MaxLength(100)
    @MinLength(6)
    @IsString()
    @Matches(/^[a-zA-Z ]$/)
    cn: string;

    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    @MinLength(12)
    @Matches(/(?=.*[a-z])/)
    @Matches(/(?=.*[A-Z])/)
    @Matches(/(?=.*\d)/)
    @Matches(/(?=.*[@$!%*?{}&])/)
    userPassword: string;

    @IsEmail()
    mail: string;

    @IsString()
    @Length(11)
    mobile: string;

    @MinLength(3)
    @IsString()
    @Matches(/^[a-zA-Z ]$/)
    st: string;

    @MinLength(3)
    @IsString()
    @Matches(/^[a-zA-Z0-9 ]$/)
    title: string;

    @MinLength(3)
    @IsString()
    @Matches(/^[a-zA-Z ]$/)
    l: string;

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
