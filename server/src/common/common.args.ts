import { InputType } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';

@InputType()
export class FindManyBaseArgs {
  @IsOptional()
  @IsInt()
  skip?: number;

  @IsOptional()
  @IsInt()
  take?: number;
}
