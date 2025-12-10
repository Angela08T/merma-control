import { IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  barcode: string;

  @IsString()
  name: string;

  @IsUUID()
  category_id: string;
}
