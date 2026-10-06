import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(100)
  apellido: string;

  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El DNI es obligatorio' })
  @MaxLength(20)
  dni: string;

  @IsEmail({}, { message: 'El formato de email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @MaxLength(30)
  telefono: string;

  @IsString({ message: 'El cargo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El cargo es obligatorio' })
  @MaxLength(100)
  cargo: string;

  @IsDateString({}, { message: 'La fecha de ingreso debe tener formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'La fecha de ingreso es obligatoria' })
  fechaIngreso: string;
}