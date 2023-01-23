import { IsBoolean, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class NewLinkDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  target: string;
}

export class UpdateLinkDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  target: string;

  @IsNotEmpty()
  @IsString()
  extension: string;

  @IsBoolean()
  @IsNotEmpty()
  extensionChanged: boolean;
}
