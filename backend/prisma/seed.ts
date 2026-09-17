import { PrismaClient } from '@prisma/client';
import { CHARACTER_PRESETS } from '../src/characters/presets';

const prisma = new PrismaClient();

async function main() {
  for (const preset of CHARACTER_PRESETS) {
    await prisma.character.upsert({
      where: { id: preset.id },
      update: preset,
      create: preset,
    });
  }
  console.log(`Seeded ${CHARACTER_PRESETS.length} characters.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
