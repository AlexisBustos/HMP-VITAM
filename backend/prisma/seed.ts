import { PrismaClient, RoleName } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

interface SeedUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: RoleName[];
}

const seedUsers: SeedUser[] = [
  {
    email: 'admin@vitam.cl',
    password: 'Admin123!',
    firstName: 'Administrador',
    lastName: 'General',
    roles: [RoleName.SUPER_ADMIN],
  },
  {
    email: 'clinadmin@vitam.cl',
    password: 'ClinAdmin123!',
    firstName: 'Administrador',
    lastName: 'Clínico',
    roles: [RoleName.CLINICAL_ADMIN],
  },
  {
    email: 'persona@vitam.cl',
    password: 'Persona123!',
    firstName: 'Persona',
    lastName: 'Natural',
    roles: [RoleName.PERSON],
  },
];

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create roles first
  console.log('📋 Creating roles...');
  const roles = await Promise.all(
    Object.values(RoleName).map((roleName) =>
      prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName },
      })
    )
  );
  console.log(`✅ Created ${roles.length} roles\n`);

  // Create users
  console.log('👥 Creating seed users...\n');
  
  for (const userData of seedUsers) {
    // Hash password with Argon2id
    const passwordHash = await argon2.hash(userData.password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });

    // Create user
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isEmailVerified: true, // Pre-verified for seed users
      },
    });

    // Assign roles
    for (const roleName of userData.roles) {
      const role = roles.find((r) => r.name === roleName);
      if (role) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId: {
              userId: user.id,
              roleId: role.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }
    }

    console.log(`✅ Created user: ${userData.email}`);
    console.log(`   Password: ${userData.password}`);
    console.log(`   Roles: ${userData.roles.join(', ')}`);
    console.log(`   Name: ${userData.firstName} ${userData.lastName}\n`);
  }

  console.log('🎉 Seed completed successfully!\n');
  console.log('📝 Login credentials:\n');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│  SUPER_ADMIN                                            │');
  console.log('│  Email: admin@vitam.cl                                  │');
  console.log('│  Password: Admin123!                                    │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│  CLINICAL_ADMIN                                         │');
  console.log('│  Email: clinadmin@vitam.cl                              │');
  console.log('│  Password: ClinAdmin123!                                │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│  PERSON                                                 │');
  console.log('│  Email: persona@vitam.cl                                │');
  console.log('│  Password: Persona123!                                  │');
  console.log('└─────────────────────────────────────────────────────────┘\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

