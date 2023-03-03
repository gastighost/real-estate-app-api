import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { SellStatus } from '@prisma/client';

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
}
