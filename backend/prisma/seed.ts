import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  
  const roles = ["ADMIN_GENERAL", "ADMIN_PRO_CLINICO", "PERSONA_NATURAL"];
  
  for (const name of roles) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    console.log(`✓ Role created/updated: ${role.name} (id: ${role.id})`);
  }
  
  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

