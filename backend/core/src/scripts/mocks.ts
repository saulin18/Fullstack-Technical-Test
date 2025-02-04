
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {

  const users = await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: await bcrypt.hash('admin123', SALT_ROUNDS),
        role: 'admin'
      },
      {
        username: 'user1',
        password: await bcrypt.hash('password1', SALT_ROUNDS),
      },
      {
        username: 'user2',
        password: await bcrypt.hash('password2', SALT_ROUNDS),
      }
    ],
    skipDuplicates: true,
  });

 
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Restaurantes' },
      { name: 'Viajes' },
      { name: 'Entretenimiento' },
      { name: 'Belleza' },
      { name: 'Deportes' }
    ],
    skipDuplicates: true,
  });


  const [admin, user1, user2] = await prisma.user.findMany();
  const [restaurantes, viajes, entretenimiento, belleza, deportes] = 
    await prisma.category.findMany();


  await prisma.offer.createMany({
    data: [
      {
        title: 'Cena para dos en Parrilla Premium',
        shortDesc: 'Menú degustación + vino',
        description: 'Menú de 5 tiempos con maridaje de vinos...',
        price: 5000,
        discount: 20,
        placeName: 'El Buen Corte',
        location: 'Santiago Centro',
        image: 'restaurant.jpg',
        categoryId: restaurantes.id,
        userId: admin.id
      },
      {
        title: 'Paquete Weekend en Viña del Mar',
        shortDesc: '2 noches en hotel 4 estrellas',
        description: 'Incluye desayuno buffet y acceso a spa...',
        price: 150000,
        discount: 30,
        placeName: 'Hotel Marbella',
        location: 'Viña del Mar',
        image: 'hotel.jpg',
        categoryId: viajes.id,
        userId: user1.id
      },
      {
        title: 'Entradas dobles para concierto',
        shortDesc: 'Tributo a Los Beatles',
        description: 'Vive la experiencia de los clásicos...',
        price: 20000,
        placeName: 'Teatro Caupolicán',
        location: 'Santiago',
        image: 'concierto.jpg',
        categoryId: entretenimiento.id,
        userId: user2.id
      }
    ]
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });