import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Visit {
  @Field()
  facilityName: string;

  @Field(() => Date)
  visitDateTime: Date;
}
