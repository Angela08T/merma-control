import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchDto } from '../../common/dto';
import { paginationHelper, timezoneHelper } from '../../common/helpers';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStockDto) {
    return await this.prisma.stock.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
  }

  async findAll(dto: SearchDto) {
    const { search, ...pagination } = dto;
    const where: any = { deleted_at: null };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    return await paginationHelper(
      this.prisma.stock,
      {
        where,
        orderBy: { name: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string) {
    const result = await this.prisma.stock.findFirst({ where: { id } });
    if (!result) throw new BadRequestException('Registro no encontrado');
    if (result.deleted_at) throw new BadRequestException('Registro eliminado');
    return result;
  }

  async update(id: string, dto: UpdateStockDto) {
    await this.findOne(id);
    return await this.prisma.stock.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.stock.update({
      data: {
        updated_at: timezoneHelper(),
        deleted_at: timezoneHelper(),
      },
      where: { id },
    });
  }
}
