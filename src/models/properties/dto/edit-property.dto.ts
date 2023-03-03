import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { SellStatus } from '@prisma/client';

export class EditPropertyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  houseNumber: number;

  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  suburb: string;

  @IsOptional()
  @IsNumber()
  zipcode: number;

  @IsOptional()
  @IsEnum(SellStatus)
  sellStatus: SellStatus;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  rooms: number;

  @IsOptional()
  @IsNumber()
  bathrooms: number;

  @IsOptional()
  @IsBoolean()
  parking: boolean;

  @IsOptional()
  @IsNumber()
  floors: number;

  @IsOptional()
  @IsNumber()
  sqm: number;
}
