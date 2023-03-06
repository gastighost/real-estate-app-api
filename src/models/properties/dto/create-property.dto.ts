import {
  IsBoolean,
  IsEnum,
  IsISO4217CurrencyCode,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { SellStatus, Type } from '@prisma/client';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  photoUrl: string;

  @IsNumber()
  houseNumber: number;

  @IsString()
  street: string;

  @IsString()
  suburb: string;

  @IsNumber()
  zipcode: number;

  @IsEnum(SellStatus)
  sellStatus: SellStatus;

  @IsNumber()
  price: number;

  @IsISO4217CurrencyCode()
  currency: string;

  @IsNumber()
  rooms: number;

  @IsNumber()
  bathrooms: number;

  @IsBoolean()
  parking: boolean;

  @IsNumber()
  floors: number;

  @IsNumber()
  sqm: number;

  @IsEnum(Type)
  type: Type;
}
