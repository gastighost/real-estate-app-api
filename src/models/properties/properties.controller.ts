import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { CreatePropertyDto } from './dto/create-property.dto';
import { EditPropertyDto } from './dto/edit-property.dto';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProperties() {
    const properties = await this.propertiesService.getAllProperties();

    return { message: 'Properties successfully retrieved!', properties };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProperty(@Body() body: CreatePropertyDto, @Req() req) {
    const { id } = req.user;

    const {
      name,
      houseNumber,
      street,
      suburb,
      zipcode,
      sellStatus,
      price,
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
    } = body;

    const postDate = new Date().toISOString();

    const property = await this.propertiesService.createProperty({
      name,
      houseNumber,
      street,
      suburb,
      zipcode,
      sellStatus,
      price,
      postDate,
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
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
      houseNumber,
      street,
      suburb,
      zipcode,
      sellStatus,
      price,
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
    } = body;

    const property = await this.propertiesService.editProperty(id, {
      name,
      houseNumber,
      street,
      suburb,
      zipcode,
      sellStatus,
      price,
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
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
