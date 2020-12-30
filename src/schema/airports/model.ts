import { prop, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Airport {
  @Field(() => ID, { nullable: true })
  _id!: mongoose.Types.ObjectId;

  @Field({ nullable: true })
  @prop()
  public id?: string;

  @Field({ nullable: true })
  @prop()
  public ident?: string;

  @Field({ nullable: true })
  @prop()
  public type?: string;

  @Field({ nullable: true })
  @prop()
  public name?: string;

  @Field({ nullable: true })
  @prop()
  public latitude_deg?: string;

  @Field({ nullable: true })
  @prop()
  public longitude_deg?: string;

  @Field({ nullable: true })
  @prop()
  public elevation_ft?: string;

  @Field({ nullable: true })
  @prop()
  public continent?: string;

  @Field({ nullable: true })
  @prop()
  public iso_country?: string;

  @Field({ nullable: true })
  @prop()
  public iso_region?: string;

  @Field({ nullable: true })
  @prop()
  public municipality?: string;

  @Field({ nullable: true })
  @prop()
  public scheduled_service?: string;

  @Field({ nullable: true })
  @prop()
  public gps_code?: string;

  @Field({ nullable: true })
  @prop()
  public iata_code?: string;

  @Field({ nullable: true })
  @prop()
  public local_code?: string;

  @Field({ nullable: true })
  @prop()
  public home_link?: string;

  @Field({ nullable: true })
  @prop()
  public wikipedia_link?: string;

  @Field({ nullable: true })
  @prop()
  public keywords?: string;
}

export const AirportModel = getModelForClass(Airport);
