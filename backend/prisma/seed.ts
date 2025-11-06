import { PrismaClient, RoleName } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

interface SeedUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: RoleName[];
  createPatient?: boolean; // Flag to create a patient record for this user
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
    firstName: 'Juan',
    lastName: 'Pérez García',
    roles: [RoleName.PERSON],
    createPatient: true, // This user will have a patient record
  },
];

// Survey templates data
const surveyTemplates = [
  {
    code: 'PHQ9',
    title: 'Cuestionario de Salud del Paciente (PHQ-9)',
    description: 'Cuestionario de detección de síntomas depresivos. 9 preguntas sobre el estado de ánimo en las últimas 2 semanas.',
    items: [
      {
        id: 'q1',
        text: 'Poco interés o placer en hacer las cosas',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q2',
        text: 'Sentirse desanimado/a, deprimido/a o sin esperanza',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q3',
        text: 'Problemas para dormir o dormir demasiado',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q4',
        text: 'Sentirse cansado/a o con poca energía',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q5',
        text: 'Poco apetito o comer en exceso',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q6',
        text: 'Sentirse mal consigo mismo/a, sentir que es un fracaso o que ha decepcionado a su familia',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q7',
        text: 'Problemas para concentrarse (leer el periódico o ver televisión)',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q8',
        text: 'Moverse o hablar tan lento que otras personas lo han notado, o estar tan inquieto/a que se mueve más de lo habitual',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q9',
        text: 'Pensamientos de que estaría mejor muerto/a o de hacerse daño de alguna manera',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      }
    ],
    scoring: {
      min: 0,
      max: 27,
      interpretation: [
        { range: [0, 4], label: 'Mínima o ninguna depresión' },
        { range: [5, 9], label: 'Depresión leve' },
        { range: [10, 14], label: 'Depresión moderada' },
        { range: [15, 19], label: 'Depresión moderadamente severa' },
        { range: [20, 27], label: 'Depresión severa' }
      ]
    }
  },
  {
    code: 'GAD7',
    title: 'Escala de Ansiedad Generalizada (GAD-7)',
    description: 'Cuestionario de detección de síntomas de ansiedad. 7 preguntas sobre nerviosismo y preocupación en las últimas 2 semanas.',
    items: [
      {
        id: 'q1',
        text: 'Sentirse nervioso/a, ansioso/a o muy alterado/a',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q2',
        text: 'No poder dejar de preocuparse o no poder controlar la preocupación',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q3',
        text: 'Preocuparse demasiado por diferentes cosas',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q4',
        text: 'Dificultad para relajarse',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q5',
        text: 'Estar tan inquieto/a que es difícil quedarse quieto/a',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q6',
        text: 'Irritarse o enojarse fácilmente',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      },
      {
        id: 'q7',
        text: 'Sentir miedo como si algo terrible pudiera pasar',
        type: 'likert',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Varios días' },
          { value: 2, label: 'Más de la mitad de los días' },
          { value: 3, label: 'Casi todos los días' }
        ]
      }
    ],
    scoring: {
      min: 0,
      max: 21,
      interpretation: [
        { range: [0, 4], label: 'Ansiedad mínima' },
        { range: [5, 9], label: 'Ansiedad leve' },
        { range: [10, 14], label: 'Ansiedad moderada' },
        { range: [15, 21], label: 'Ansiedad severa' }
      ]
    }
  },
  {
    code: 'AUDIT',
    title: 'Test de Identificación de Trastornos por Uso de Alcohol (AUDIT)',
    description: 'Cuestionario de detección de consumo de riesgo y perjudicial de alcohol. 10 preguntas sobre hábitos de consumo.',
    items: [
      {
        id: 'q1',
        text: '¿Con qué frecuencia consume alguna bebida alcohólica?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Una o menos veces al mes' },
          { value: 2, label: 'De 2 a 4 veces al mes' },
          { value: 3, label: 'De 2 a 3 veces a la semana' },
          { value: 4, label: '4 o más veces a la semana' }
        ]
      },
      {
        id: 'q2',
        text: '¿Cuántas consumiciones de bebidas alcohólicas suele realizar en un día de consumo normal?',
        type: 'single-choice',
        options: [
          { value: 0, label: '1 o 2' },
          { value: 1, label: '3 o 4' },
          { value: 2, label: '5 o 6' },
          { value: 3, label: '7, 8 o 9' },
          { value: 4, label: '10 o más' }
        ]
      },
      {
        id: 'q3',
        text: '¿Con qué frecuencia toma 6 o más bebidas alcohólicas en un solo día?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Menos de una vez al mes' },
          { value: 2, label: 'Mensualmente' },
          { value: 3, label: 'Semanalmente' },
          { value: 4, label: 'A diario o casi a diario' }
        ]
      },
      {
        id: 'q4',
        text: '¿Con qué frecuencia en el curso del último año ha sido incapaz de parar de beber una vez había empezado?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Menos de una vez al mes' },
          { value: 2, label: 'Mensualmente' },
          { value: 3, label: 'Semanalmente' },
          { value: 4, label: 'A diario o casi a diario' }
        ]
      },
      {
        id: 'q5',
        text: '¿Con qué frecuencia en el curso del último año no pudo hacer lo que se esperaba de usted porque había bebido?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Menos de una vez al mes' },
          { value: 2, label: 'Mensualmente' },
          { value: 3, label: 'Semanalmente' },
          { value: 4, label: 'A diario o casi a diario' }
        ]
      },
      {
        id: 'q6',
        text: '¿Con qué frecuencia en el curso del último año ha necesitado beber en ayunas para recuperarse después de haber bebido mucho el día anterior?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Menos de una vez al mes' },
          { value: 2, label: 'Mensualmente' },
          { value: 3, label: 'Semanalmente' },
          { value: 4, label: 'A diario o casi a diario' }
        ]
      },
      {
        id: 'q7',
        text: '¿Con qué frecuencia en el curso del último año ha tenido remordimientos o sentimientos de culpa después de haber bebido?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Menos de una vez al mes' },
          { value: 2, label: 'Mensualmente' },
          { value: 3, label: 'Semanalmente' },
          { value: 4, label: 'A diario o casi a diario' }
        ]
      },
      {
        id: 'q8',
        text: '¿Con qué frecuencia en el curso del último año no ha podido recordar lo que sucedió la noche anterior porque había estado bebiendo?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'Nunca' },
          { value: 1, label: 'Menos de una vez al mes' },
          { value: 2, label: 'Mensualmente' },
          { value: 3, label: 'Semanalmente' },
          { value: 4, label: 'A diario o casi a diario' }
        ]
      },
      {
        id: 'q9',
        text: '¿Usted o alguna otra persona han resultado heridos porque usted había bebido?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'No' },
          { value: 2, label: 'Sí, pero no en el curso del último año' },
          { value: 4, label: 'Sí, en el último año' }
        ]
      },
      {
        id: 'q10',
        text: '¿Algún familiar, amigo, médico o profesional sanitario ha mostrado preocupación por su consumo de bebidas alcohólicas o le ha sugerido que deje de beber?',
        type: 'single-choice',
        options: [
          { value: 0, label: 'No' },
          { value: 2, label: 'Sí, pero no en el curso del último año' },
          { value: 4, label: 'Sí, en el último año' }
        ]
      }
    ],
    scoring: {
      min: 0,
      max: 40,
      interpretation: [
        { range: [0, 7], label: 'Consumo de bajo riesgo' },
        { range: [8, 15], label: 'Consumo de riesgo' },
        { range: [16, 19], label: 'Consumo perjudicial' },
        { range: [20, 40], label: 'Posible dependencia alcohólica' }
      ]
    }
  }
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

    // Create patient record if needed (for PERSON role)
    if (userData.createPatient) {
      const existingPatient = await prisma.paciente.findUnique({
        where: { userId: user.id },
      });

      if (!existingPatient) {
        await prisma.paciente.create({
          data: {
            rut: '12.345.678-9',
            firstName: userData.firstName,
            lastName: userData.lastName,
            birthDate: new Date('1985-05-15'),
            sex: 'M',
            email: userData.email,
            phone: '+56912345678',
            address: 'Av. Providencia 1234',
            city: 'Santiago',
            region: 'Región Metropolitana',
            userId: user.id,
          },
        });
        console.log(`✅ Created patient record for: ${userData.email}`);
      }
    }

    console.log(`✅ Created user: ${userData.email}`);
    console.log(`   Password: ${userData.password}`);
    console.log(`   Roles: ${userData.roles.join(', ')}`);
    console.log(`   Name: ${userData.firstName} ${userData.lastName}\n`);
  }

  // Create survey templates
  console.log('📝 Creating survey templates...\n');
  
  for (const template of surveyTemplates) {
    await prisma.surveyTemplate.upsert({
      where: { code: template.code },
      update: {
        title: template.title,
        description: template.description,
        items: template.items as any,
        isActive: true,
      },
      create: {
        code: template.code,
        title: template.title,
        description: template.description,
        items: template.items as any,
        isActive: true,
      },
    });
    console.log(`✅ Created survey template: ${template.code} - ${template.title}`);
  }

  console.log('\n🎉 Seed completed successfully!\n');
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
  console.log('│  PERSON (with patient record)                           │');
  console.log('│  Email: persona@vitam.cl                                │');
  console.log('│  Password: Persona123!                                  │');
  console.log('│  RUT: 12.345.678-9                                      │');
  console.log('└─────────────────────────────────────────────────────────┘\n');
  console.log('📊 Survey templates created:\n');
  console.log('  • PHQ-9: Cuestionario de Salud del Paciente (Depresión)');
  console.log('  • GAD-7: Escala de Ansiedad Generalizada');
  console.log('  • AUDIT: Test de Identificación de Trastornos por Uso de Alcohol\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

