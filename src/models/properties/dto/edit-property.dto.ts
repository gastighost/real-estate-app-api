import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { SellStatus, Type } from '@prisma/client';

export class EditPropertyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  photoUrl: string;

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
  @IsString()
  currency: string;

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

  @IsOptional()
  @IsEnum(Type)
  type: Type;
}
