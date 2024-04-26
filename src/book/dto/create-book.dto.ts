import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(50, { message: 'Title must be at most 50 characters long' })
  title: string;

  @IsString({ message: 'Author must be a string' })
  @IsNotEmpty({ message: 'Author is required' })
  author: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Price is required' })
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Quantity is required' })
  @Min(0, { message: 'Quantity must be a positive number' })
  quantity: number;

  @IsString({ each: true })
  @IsNotEmpty({ message: 'Bookstore info is required' })
  stores: string[];
}
