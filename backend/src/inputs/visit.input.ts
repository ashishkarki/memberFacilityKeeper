import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VisitInput {
  @Field()
  facilityName: string;

  @Field()
  visitDateTime: Date;
}
