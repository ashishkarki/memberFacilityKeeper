import { InputType, Field } from '@nestjs/graphql';
import { MembershipInput } from './membership.input';
import { VisitInput } from './visit.input';

@InputType()
export class MemberInput {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => MembershipInput)
  membership: MembershipInput;

  @Field(() => [VisitInput], { nullable: true })
  visits?: VisitInput[];
}
