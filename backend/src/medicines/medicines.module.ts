import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicinesService } from './medicines.service.js';
import { MedicinesController } from './medicines.controller.js';
import { Medicine } from './entities/medicine.entity.js';
import { Category } from '../categories/entities/category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine, Category])],
  controllers: [MedicinesController],
  providers: [MedicinesService],
})
export class MedicinesModule {}