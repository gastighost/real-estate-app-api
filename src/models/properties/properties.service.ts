import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProperties() {
    return this.prisma.property.findMany();
  }

  async createProperty(property: Prisma.PropertyCreateInput) {
    return this.prisma.property.create({ data: property });
  }

  async getProperty(id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });

    if (!property) {
      throw new HttpException(
        'Property with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return property;
  }

  async editProperty(id: string, property: Prisma.PropertyUpdateInput) {
    const existingProperty = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      throw new HttpException(
        'Property with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.property.update({ where: { id }, data: property });
  }

  async deleteProperty(id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });

    if (!property) {
      throw new HttpException(
        'Property with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.property.delete({ where: { id } });
  }
}
