import { Field, ObjectType } from '@nestjs/graphql';
import { Membership } from './membership.model';
import { Visit } from './visit.model';

@ObjectType()
export class Member {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Membership)
  membership: Membership;

  @Field(() => [Visit])
  visits: Visit[];
}
