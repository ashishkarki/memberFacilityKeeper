import { Field, ObjectType } from '@nestjs/graphql';

export enum MembershipType {
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  BRONZE = 'BRONZE',
}

@ObjectType()
export class Membership {
  @Field(() => String) // ensure properly serialized in GraphQL
  membershipType: MembershipType;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;
}
