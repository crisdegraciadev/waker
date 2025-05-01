import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Match } from "../decorators/match.decorator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match("password",{message: "password and confirmPassword doesn't match"})
  confirmPassword: string;
}
