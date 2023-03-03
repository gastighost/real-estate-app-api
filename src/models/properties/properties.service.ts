import { Injectable } from '@nestjs/common';
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
    return this.prisma.property.findUnique({ where: { id } });
  }

  async editProperty(id: string, property: Prisma.PropertyUpdateInput) {
    return this.prisma.property.update({ where: { id }, data: property });
  }
}
