import { Field, Float, ObjectType } from '@nestjs/graphql';

import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@ObjectType('CommandMenuItemDefaultValues')
export class CommandMenuItemDefaultValuesDTO {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => UUIDScalarType)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  label: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  shortLabel?: string | null;

  @IsBoolean()
  @Field()
  isPinned: boolean;

  @IsNumber()
  @Field(() => Float)
  position: number;
}
