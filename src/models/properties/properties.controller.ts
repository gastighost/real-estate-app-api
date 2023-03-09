import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../services/auth/jwt-auth.guard';
import { CreatePropertyDto } from './dto/create-property.dto';
import { EditPropertyDto } from './dto/edit-property.dto';
import { GetPropertiesQueryDto } from './dto/get-properties-query.dto';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProperties(@Query() query: GetPropertiesQueryDto) {
    const { type, price, rooms, bathrooms, sqm } = query;

    const properties = await this.propertiesService.getAllProperties({
      where: {
        type,
        price: { gte: price },
        rooms,
        bathrooms,
        sqm: { gte: sqm },
      },
    });

    return { message: 'Properties successfully retrieved!', properties };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProperty(@Body() body: CreatePropertyDto, @Req() req) {
    const { id } = req.user;

    const {
      name,
      photoUrl,
      houseNumber,
      street,
      suburb,
      zipcode,
      sellStatus,
      price,
      currency,
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
      type,
    } = body;

    const property = await this.propertiesService.createProperty({
      name,
      photoUrl,
      houseNumber,
      street,
      suburb,
      zipcode,
      sellStatus,
      price,
      currency,
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
      type,
      seller: { connect: { id } },
    });

    return { message: 'Property successfully created!', property };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProperty(@Param('id') id: string) {
    const property = await this.propertiesService.getProperty(id);

    return { message: 'Property successfully retrieved!', property };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editProperty(@Param('id') id: string, @Body() body: EditPropertyDto) {
    const {
      name,
      photoUrl,
      houseNumber,
      street,
      suburb,
      zipcode,
      sellStatus,
      price,
      currency,
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
      type,
    } = body;

    const property = await this.propertiesService.editProperty(id, {
      name,
      photoUrl,
      houseNumber,
      street,
      suburb,
      zipcode,
      sellStatus,
      price,
      currency,
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
      type,
    });

    return { message: 'Property successfully updated!', property };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProperty(@Param('id') id: string) {
    const property = await this.propertiesService.deleteProperty(id);

    return { message: 'Property successfully deleted!', property };
  }
}
