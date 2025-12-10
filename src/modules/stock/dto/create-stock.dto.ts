<<<<<<< HEAD
import { IsDate, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { Status } from '@prisma/client';
=======
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
>>>>>>> f6a35adec5d28cf111d9a37795fdbe486e2c79e1

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
<<<<<<< HEAD

  @IsEnum(Status)
  status: Status;
=======
>>>>>>> f6a35adec5d28cf111d9a37795fdbe486e2c79e1
}
