import prisma from '../src/config/prisma';

async function checkUserConsent() {
  try {
    const email = 'test.consent@vitam.cl';
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      console.log('❌ Usuario no encontrado:', email);
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
    console.log('');

    const acceptances = await prisma.consentAcceptance.findMany({
      where: { userId: user.id },
      include: {
        template: {
          select: {
            id: true,
            version: true,
            isActive: true,
            hash: true,
          },
        },
      },
      orderBy: { acceptedAt: 'desc' },
    });

    console.log(`📋 Aceptaciones de consentimiento: ${acceptances.length}`);
    console.log('');

    if (acceptances.length === 0) {
      console.log('⚠️  El usuario NO ha aceptado ningún consentimiento');
    } else {
      acceptances.forEach((a, i) => {
        console.log(`${i + 1}. Versión ${a.template.version}:`);
        console.log(`   Template ID: ${a.templateId}`);
        console.log(`   Activa: ${a.template.isActive ? 'Sí' : 'No'}`);
        console.log(`   Hash en template: ${a.template.hash.substring(0, 32)}...`);
        console.log(`   Hash al aceptar: ${a.hashAtAcceptance.substring(0, 32)}...`);
        console.log(`   Match: ${a.template.hash === a.hashAtAcceptance ? '✅' : '❌'}`);
        console.log(`   Aceptado: ${a.acceptedAt.toISOString()}`);
        console.log('');
      });
    }

    // Check latest active template
    const latest = await prisma.consentTemplate.findFirst({
      where: { isActive: true },
      orderBy: { version: 'desc' },
    });

    if (latest) {
      console.log(`📄 Plantilla activa actual: v${latest.version}`);
      console.log(`   ID: ${latest.id}`);
      console.log(`   Hash: ${latest.hash.substring(0, 32)}...`);
      console.log('');

      const hasAccepted = acceptances.find(
        (a) => a.templateId === latest.id && a.hashAtAcceptance === latest.hash
      );

      if (hasAccepted) {
        console.log('✅ El usuario YA aceptó la plantilla activa actual');
        console.log('   mustAcceptConsent debería ser FALSE');
      } else {
        console.log('❌ El usuario NO ha aceptado la plantilla activa actual');
        console.log('   mustAcceptConsent debería ser TRUE');
      }
    } else {
      console.log('⚠️  No hay plantilla activa en el sistema');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserConsent();

