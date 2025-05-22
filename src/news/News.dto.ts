import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsDateString } from 'class-validator';

export class NewsDto {
  @ApiProperty({ example: 'Your news title', minLength: 5 })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;
  @ApiProperty({ example: 'Your news content.', minLength: 10 })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;
  @ApiProperty({ example: '2025-05-21', format: 'date' })
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
