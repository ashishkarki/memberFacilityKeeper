import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class MembershipInput {
  @Field()
  membershipType: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}
