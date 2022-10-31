import { IsNotEmpty, IsString } from 'class-validator';

export class loginDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
