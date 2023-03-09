import { Type } from '@prisma/client';
import { Transform, Type as TransformerType } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class GetPropertiesQueryDto {
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(Type)
  type: Type;

  @IsOptional()
  @TransformerType(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @TransformerType(() => Number)
  @IsNumber()
  rooms: number;

  @IsOptional()
  @TransformerType(() => Number)
  @IsNumber()
  bathrooms: number;

  @IsOptional()
  @TransformerType(() => Number)
  @IsNumber()
  sqm: number;
}
