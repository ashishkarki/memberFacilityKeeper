import { Member } from '../models/member.model';
import { MembershipType } from '../models/membership.model';

export const members: Member[] = [
  {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    membership: {
      membershipType: MembershipType.GOLD,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
    },
    visits: [
      {
        facilityName: 'Gym A',
        visitDateTime: new Date('2023-02-01T10:00:00Z'),
      },
      {
        facilityName: 'Pool B',
        visitDateTime: new Date('2023-03-05T14:30:00Z'),
      },
    ],
  },
  {
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    membership: {
      membershipType: MembershipType.SILVER,
      startDate: new Date('2022-06-15'),
      endDate: new Date('2023-06-15'),
    },
    visits: [
      {
        facilityName: 'Yoga Center',
        visitDateTime: new Date('2023-05-01T09:00:00Z'),
      },
    ],
  },
  {
    email: 'bob.jones@example.com',
    firstName: 'Bob',
    lastName: 'Jones',
    membership: {
      membershipType: MembershipType.BRONZE,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
    },
    visits: [
      {
        facilityName: 'Goldie Gym',
        visitDateTime: new Date('2023-02-01T10:00:00Z'),
      },
      {
        facilityName: "Sammy's Bathhouse",
        visitDateTime: new Date('2023-03-05T14:30:00Z'),
      },
    ],
  },
];
