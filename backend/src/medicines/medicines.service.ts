import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { CreateMedicineDto } from './dto/create-medicine.dto.js';
import { UpdateMedicineDto } from './dto/update-medicine.dto.js';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const { categoriaId, ...medicineData } = createMedicineDto;

    const categoria = await this.categoryRepository.findOneBy({ id: categoriaId });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${categoriaId} no encontrada`);
    }

    const medicine = this.medicineRepository.create({
      ...medicineData,
      categoria,
    });

    return await this.medicineRepository.save(medicine);
  }

  async findAll(): Promise<Medicine[]> {
    return await this.medicineRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOneBy({ id });
    if (!medicine) {
      throw new NotFoundException(`Medicamento con ID ${id} no encontrado`);
    }
    return medicine;
  }

  async update(id: number, updateMedicineDto: UpdateMedicineDto): Promise<Medicine> {
    const medicine = await this.findOne(id);
    const { categoriaId, ...medicineData } = updateMedicineDto;

    if (categoriaId) {
      const categoria = await this.categoryRepository.findOneBy({ id: categoriaId });
      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${categoriaId} no encontrada`);
      }
      medicine.categoria = categoria;
    }

    this.medicineRepository.merge(medicine, medicineData);
    return await this.medicineRepository.save(medicine);
  }

  async remove(id: number): Promise<{ message: string }> {
    const medicine = await this.findOne(id);
    await this.medicineRepository.remove(medicine);
    return { message: `Medicamento #${id} eliminado correctamente` };
  }
}