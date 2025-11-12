import { Field, ID, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UserWhereUniqueInput {
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  id: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @Field(() => String, { nullable: true })
  email: string;
}

@InputType()
export class UsersWhereInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @Field(() => String, { nullable: true })
  email?: string;
}

@InputType()
export class UserCreateInput {
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String)
  name: string;
}

@InputType()
export class UserUpdateInput {
  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @Field(() => String)
  email: string;

  @IsOptional()
  @IsString()
  @Field(() => String)
  name: string;
}
