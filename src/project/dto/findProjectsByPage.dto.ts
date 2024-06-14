import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';


export enum SortOrder {
  DescendingRating = 'descending',
  AscendingRating = 'ascending',
  Alphabetical = 'alph',
}
export class FindProjectsByPageDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  limit ?:number= 10;

  @IsOptional()
  // @IsArray()
  @IsString({ each: true })
  // @Type(() => String)
  categoriesIds?: string[];

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder = SortOrder.AscendingRating;
}