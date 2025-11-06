import prisma from '../src/config/prisma';
import { hashPassword } from '../src/utils/password';

async function createTestUser() {
  try {
    const email = 'test.consent@vitam.cl';
    const password = 'TestConsent123!';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      console.log('   To test consent flow, delete this user first or use a different email.');
      
      // Check if user has accepted consent
      const acceptance = await prisma.consentAcceptance.findFirst({
        where: { userId: existingUser.id },
      });
      
      if (acceptance) {
        console.log('   ⚠️  User has already accepted consent.');
        console.log('   To test, delete the consent acceptance:');
        console.log(`   DELETE FROM consent_acceptances WHERE user_id = '${existingUser.id}';`);
      } else {
        console.log('   ✅ User has NOT accepted consent yet - ready for testing!');
      }
      
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: 'Test',
        lastName: 'Consentimiento',
        isActive: true,
        isEmailVerified: true,
      },
    });

    console.log('✅ Test user created successfully!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 User ID:', user.id);
    console.log('');
    console.log('🧪 To test consent flow:');
    console.log('1. Go to https://hmp-vitam-aws.vercel.app/login');
    console.log('2. Login with the credentials above');
    console.log('3. You should be redirected to /consentimiento');
    console.log('4. Accept the consent');
    console.log('5. You should be redirected to /dashboard or /mi-ficha');
    console.log('');
    console.log('📝 Note: This user has NO consent acceptance record,');
    console.log('   so mustAcceptConsent will be true on login.');

    // Assign PERSON role
    const personRole = await prisma.role.findUnique({
      where: { name: 'PERSON' },
    });

    if (personRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: personRole.id,
        },
      });
      console.log('✅ PERSON role assigned');
    }

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();

