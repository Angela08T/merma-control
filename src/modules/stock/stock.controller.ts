import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
<<<<<<< HEAD
  Query,
=======
>>>>>>> f6a35adec5d28cf111d9a37795fdbe486e2c79e1
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
<<<<<<< HEAD
import { SearchDto } from '../../common/dto';
=======
>>>>>>> f6a35adec5d28cf111d9a37795fdbe486e2c79e1

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
<<<<<<< HEAD
  findAll(@Query() dto: SearchDto) {
    return this.stockService.findAll(dto);
=======
  findAll() {
    return this.stockService.findAll();
>>>>>>> f6a35adec5d28cf111d9a37795fdbe486e2c79e1
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
<<<<<<< HEAD
    return this.stockService.findOne(id);
=======
    return this.stockService.findOne(+id);
>>>>>>> f6a35adec5d28cf111d9a37795fdbe486e2c79e1
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
<<<<<<< HEAD
    return this.stockService.update(id, updateStockDto);
=======
    return this.stockService.update(+id, updateStockDto);
>>>>>>> f6a35adec5d28cf111d9a37795fdbe486e2c79e1
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
<<<<<<< HEAD
    return this.stockService.remove(id);
=======
    return this.stockService.remove(+id);
>>>>>>> f6a35adec5d28cf111d9a37795fdbe486e2c79e1
  }
}
