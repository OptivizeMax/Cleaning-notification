import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: [
      {
        title: 'First cleaning',
        body: 'Swept and mopped the floors',
        imageUrls: [],
      },
      {
        title: 'Second cleaning',
        body: 'Cleaned the windows',
        imageUrls: [],
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
