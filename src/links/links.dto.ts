import { IsBoolean, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

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

export class GetAppQueryDto {
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @Type(() => Number)
  page: number;
}
