import { Field, ObjectType } from "type-graphql/dist/decorators";

@ObjectType()
export class ResponseError {
  @Field()
  type!: string;
  @Field()
  message!: string;
}
