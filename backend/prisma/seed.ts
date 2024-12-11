import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Memberships
  const memberships = await prisma.membership.createMany({
    data: [
      {
        membershipType: 'GOLD',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
      },
      {
        membershipType: 'SILVER',
        startDate: new Date('2022-06-15'),
        endDate: new Date('2023-06-15'),
      },
      {
        membershipType: 'BRONZE',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
      },
    ],
  });

  console.log(`Seeded ${memberships.count} memberships.`);

  // Seed Members
  const members = await prisma.member.createMany({
    data: [
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        membershipId: 1, // GOLD
      },
      {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        membershipId: 2, // SILVER
      },
      {
        email: 'bob.jones@example.com',
        firstName: 'Bob',
        lastName: 'Jones',
        membershipId: 3, // BRONZE
      },
    ],
  });

  console.log(`Seeded ${members.count} members.`);

  // Seed Visits
  const visits = await prisma.visit.createMany({
    data: [
      {
        facilityName: 'Gym A',
        visitDateTime: new Date('2023-02-01T10:00:00Z'),
        memberId: 1, // John Doe
      },
      {
        facilityName: 'Pool B',
        visitDateTime: new Date('2023-03-05T14:30:00Z'),
        memberId: 1, // John Doe
      },
      {
        facilityName: 'Yoga Center',
        visitDateTime: new Date('2023-05-01T09:00:00Z'),
        memberId: 2, // Jane Smith
      },
      {
        facilityName: 'Goldie Gym',
        visitDateTime: new Date('2023-02-01T10:00:00Z'),
        memberId: 3, // Bob Jones
      },
      {
        facilityName: "Sammy's Bathhouse",
        visitDateTime: new Date('2023-03-05T14:30:00Z'),
        memberId: 3, // Bob Jones
      },
    ],
  });

  console.log(`Seeded ${visits.count} visits.`);
}

main()
  .then(() => console.log('Seeding complete'))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
