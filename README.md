## Como o Projeto está ficando(No Mobile)

- Página Principal:

<img src="./screens/dashboard.png" />

- Login:

<img src="./screens/login.png" />

- Página da Barbearia:

<img src="./screens/barberPage.png" />

- Agendamento:

<img src="./screens/booking.png" />

- Página Todos Agendamentos:

<img src="./screens/all-bookings.png" />

## Comandos

- Criação do Projeto: npx create-next-app@14 fsw-barber

### Prisma

npm install prisma --save-dev

npx prisma init --datasource-provider postgresql

DATABASE_URL="postgresql://neondb_owner:npg_ukdF1iLPamr7@ep-crimson-sun-a5q6fpjr-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

npx prisma migrate dev --name init_db

npm install ts-node -D

npx prisma db seed

npx prisma migrate deploy

### TailwindCSS e Shadcn/ui

npm install tailwindcss @tailwindcss/postcss postcss

`npx shadcn@latest init` não `npx shadcn-ui@latest init`

npx shadcn@latest add button

npx shadcn@latest add card

npx shadcn@latest add input

npx shadcn@latest add badge

npx shadcn@latest add avatar

npx shadcn@latest add sonner

npx shadcn@latest add sheet

npx shadcn@latest add dialog

npx shadcn@latest add form

npx shadcn@latest add calendar

### Next-Auth

npm install next-auth

npm install @prisma/client @auth/prisma-adapter

npm install prisma --save-dev

npm install @hookform/resolvers

### Configuração ao fazer commits

npm install -D husky lint-staged

npx husky init

### Outros

npm install date-fns

npm run dev

npm run build

## Tabelas:

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model User { // Usuario
id String @id @default(uuid())
email String
name String
bookings Booking[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Barbershop { // Barbearia
id String @id @default(uuid())
name String
address String
phones String[]
imageUrl String
description String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
services BarbershopService[]
}

model BarbershopService { // Service da Barbearia
id String @id @default(uuid())
name String
description String
imageUrl String
price Decimal @db.Decimal(10, 2)
barbershopId String
barbershop Barbershop @relation(fields: [barbershopId], references: [id])
bookings Booking[]
}

model Booking { // Agendamento
id String @id @default(uuid())
userId String
user User @relation(fields: [userId], references: [id])
serviceId String
service BarbershopService @relation(fields: [serviceId], references: [id])
date DateTime
}

## Dados

||||| Package.json
"prisma": {
"seed": "ts-node ./prisma/seed.ts"
},

||||| Seeds.ts
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedDatabase() {
try {
const images = [
"https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
"https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
"https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png",
"https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png",
"https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png",
"https://utfs.io/f/2f9278ba-3975-4026-af46-64af78864494-16u.png",
"https://utfs.io/f/988646ea-dcb6-4f47-8a03-8d4586b7bc21-16v.png",
"https://utfs.io/f/60f24f5c-9ed3-40ba-8c92-0cd1dcd043f9-16w.png",
"https://utfs.io/f/f64f1bd4-59ce-4ee3-972d-2399937eeafc-16x.png",
"https://utfs.io/f/e995db6d-df96-4658-99f5-11132fd931e1-17j.png",
"https://utfs.io/f/3bcf33fc-988a-462b-8b98-b811ee2bbd71-17k.png",
"https://utfs.io/f/5788be0e-2307-4bb4-b603-d9dd237950a2-17l.png",
"https://utfs.io/f/6b0888f8-b69f-4be7-a13b-52d1c0c9cab2-17m.png",
"https://utfs.io/f/ef45effa-415e-416d-8c4a-3221923cd10f-17n.png",
"https://utfs.io/f/ef45effa-415e-416d-8c4a-3221923cd10f-17n.png",
"https://utfs.io/f/a55f0f39-31a0-4819-8796-538d68cc2a0f-17o.png",
"https://utfs.io/f/5c89f046-80cd-4443-89df-211de62b7c2a-17p.png",
"https://utfs.io/f/23d9c4f7-8bdb-40e1-99a5-f42271b7404a-17q.png",
"https://utfs.io/f/9f0847c2-d0b8-4738-a673-34ac2b9506ec-17r.png",
"https://utfs.io/f/07842cfb-7b30-4fdc-accc-719618dfa1f2-17s.png",
"https://utfs.io/f/0522fdaf-0357-4213-8f52-1d83c3dcb6cd-18e.png",
];
// Nomes criativos para as barbearias
const creativeNames = [
"Barbearia Vintage",
"Corte & Estilo",
"Barba & Navalha",
"The Dapper Den",
"Cabelo & Cia.",
"Machado & Tesoura",
"Barbearia Elegance",
"Aparência Impecável",
"Estilo Urbano",
"Estilo Clássico",
];

    // Endereços fictícios para as barbearias
    const addresses = [
      "Rua da Barbearia, 123",
      "Avenida dos Cortes, 456",
      "Praça da Barba, 789",
      "Travessa da Navalha, 101",
      "Alameda dos Estilos, 202",
      "Estrada do Machado, 303",
      "Avenida Elegante, 404",
      "Praça da Aparência, 505",
      "Rua Urbana, 606",
      "Avenida Clássica, 707",
    ];

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ];

    // Criar 10 barbearias com nomes e endereços fictícios
    const barbershops = [];
    for (let i = 0; i < 10; i++) {
      const name = creativeNames[i];
      const address = addresses[i];
      const imageUrl = images[i];

      const barbershop = await prisma.barbershop.create({
        data: {
          name,
          address,
          imageUrl: imageUrl,
          phones: ["(11) 99999-9999", "(11) 99999-9999"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus. Phasellus pharetra erat ac libero efficitur tempus. Donec pretium convallis iaculis. Etiam eu felis sollicitudin, cursus mi vitae, iaculis magna. Nam non erat neque. In hac habitasse platea dictumst. Pellentesque molestie accumsan tellus id laoreet.",
        },
      });

      for (const service of services) {
        await prisma.barbershopService.create({
          data: {
            name: service.name,
            description: service.description,
            price: service.price,
            barbershop: {
              connect: {
                id: barbershop.id,
              },
            },
            imageUrl: service.imageUrl,
          },
        });
      }

      barbershops.push(barbershop);
    }

    // Fechar a conexão com o banco de dados
    await prisma.$disconnect();

} catch (error) {
console.error("Erro ao criar as barbearias:", error);
}
}

seedDatabase();
