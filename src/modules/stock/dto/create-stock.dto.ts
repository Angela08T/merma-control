import { IsDate, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateStockDto {
  @IsString()
  batch: string;

  @IsNumber()
  quantity: number;

  @IsUUID()
  location_id: string;

  @IsUUID()
  product_id: string;

  @IsUUID()
  user_id: string;

  @IsDate()
  expired_at: Date;

  @IsEnum(Status)
  status: Status;
}
