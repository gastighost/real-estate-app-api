import { Prisma, PrismaClient, SellStatus, Type } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.deleteMany();
  await prisma.property.deleteMany();

  const password = await bcrypt.hash('Password123456', 12);
  const phone = '+61770101111';

  const user = await prisma.user.create({
    data: { username: 'gaston', email: 'gaston@gmail.com', password, phone },
  });

  const user2 = await prisma.user.create({
    data: { username: 'michael', email: 'michael@gmail.com', password, phone },
  });

  const generateProperty = (): Prisma.PropertyCreateInput => {
    const sellStatuses = Object.values(SellStatus);
    const randomIndex = Math.floor(Math.random() * sellStatuses.length);
    const sellStatus = sellStatuses[randomIndex];

    const rooms = Math.ceil(Math.random() * 15);
    const bathrooms = Math.ceil(Math.random() * 15);

    const parkingStatuses = [true, false];
    const randomIndex2 = Math.floor(Math.random() * parkingStatuses.length);
    const parking = parkingStatuses[randomIndex2];

    const floors = Math.ceil(Math.random() * 5);

    const sqm = Math.ceil(Math.random() * 3000) + 15;

    const types = Object.values(Type);
    const randomIndex3 = Math.floor(Math.random() * types.length);
    const type = types[randomIndex3];

    const userIds = [user.id, user2.id];
    const randomIndex4 = Math.floor(Math.random() * userIds.length);
    const id = userIds[randomIndex4];

    return {
      name: faker.name.fullName(),
      houseNumber: Number(faker.address.buildingNumber()),
      street: faker.address.street(),
      suburb: faker.address.county(),
      zipcode: Number(faker.address.zipCode()) || 4040,
      sellStatus,
      price: Number(faker.finance.amount()),
      currency: faker.finance.currencyCode(),
      postDate: faker.date.future(),
      rooms,
      bathrooms,
      parking,
      floors,
      sqm,
      type,
      seller: { connect: { id } },
    };
  };

  const randomProperties: Prisma.PropertyCreateInput[] = [];

  for (let i = 0; i < 100; i++) {
    randomProperties.push(generateProperty());
  }

  await Promise.all(
    randomProperties.map(async (property) => {
      await prisma.property.create({ data: property });

      console.log(`Property ${property.name} created!`);
    }),
  );
};

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
