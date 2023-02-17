import { IsBoolean, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class NewLinkDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  target: string;

  public?: boolean;
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

  @IsBoolean()
  @IsNotEmpty()
  public: boolean;
}

export class GetAppQueryDto {
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @Type(() => Number)
  page: number;
}
