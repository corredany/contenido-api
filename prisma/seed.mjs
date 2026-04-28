import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const rol = await prisma.rol.upsert({
  where: { nombre: 'admin' },
  update: {},
  create: { nombre: 'admin' },
});

await prisma.rol.upsert({
  where: { nombre: 'editor' },
  update: {},
  create: { nombre: 'editor' },
});

await prisma.rol.upsert({
  where: { nombre: 'recepcionista' },
  update: {},
  create: { nombre: 'recepcionista' },
});

const hash = await bcrypt.hash('admin123', 10);

await prisma.usuario.upsert({
  where: { email: 'admin@santino.com' },
  update: {},
  create: {
    nombre: 'Administrador',
    email: 'admin@santino.com',
    contrasena: hash,
    rolId: rol.id,
  },
});

console.log('Rol admin y usuario admin creados en contenido_db (admin@santino.com / admin123)');
await prisma.$disconnect();
