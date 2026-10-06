import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateMedicineDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  descripcion?: string;

  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsString({ message: 'El laboratorio debe ser un texto' })
  @IsNotEmpty({ message: 'El laboratorio es obligatorio' })
  laboratorio: string;

  @IsDateString({}, { message: 'La fecha de vencimiento debe tener formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'La fecha de vencimiento es obligatoria' })
  fechaVencimiento: string;

  @IsInt({ message: 'El ID de categoría debe ser un número entero' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoriaId: number;
}