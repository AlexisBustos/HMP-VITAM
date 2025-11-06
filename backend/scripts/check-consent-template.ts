import prisma from '../src/config/prisma';

async function checkConsentTemplate() {
  try {
    const templates = await prisma.consentTemplate.findMany({
      orderBy: { version: 'desc' },
      take: 3,
    });

    console.log('📋 Plantillas de consentimiento en la base de datos:');
    console.log('');
    
    if (templates.length === 0) {
      console.log('❌ NO HAY PLANTILLAS EN LA BASE DE DATOS');
      console.log('   Ejecuta: npm run seed');
      return;
    }

    templates.forEach((t) => {
      const status = t.isActive ? '✅ ACTIVA' : '⚪ Inactiva';
      console.log(`  v${t.version}: ${status}`);
      console.log(`    ID: ${t.id}`);
      console.log(`    Título: ${t.title}`);
      console.log(`    Hash: ${t.hash.substring(0, 32)}...`);
      console.log(`    Creada: ${t.createdAt.toISOString()}`);
      console.log('');
    });

    const active = templates.find((t) => t.isActive);
    
    if (!active) {
      console.log('⚠️  NO HAY PLANTILLA ACTIVA');
      console.log('');
      console.log('Para activar la v1, ejecuta:');
      console.log('  UPDATE consent_templates SET is_active = true WHERE version = 1;');
    } else {
      console.log(`✅ Plantilla activa encontrada: v${active.version}`);
      console.log('');
      
      // Check acceptances
      const acceptanceCount = await prisma.consentAcceptance.count({
        where: { templateId: active.id },
      });
      
      console.log(`📊 Aceptaciones de esta plantilla: ${acceptanceCount}`);
    }

  } catch (error) {
    console.error('❌ Error al verificar plantillas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConsentTemplate();

