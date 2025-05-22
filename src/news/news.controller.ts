import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsDto } from './News.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Creates new record in news table',
    schema: {
      type: 'object',
      example: {
        id: 1,
        title: 'Your news title',
        content: 'Your news content',
        createdAt: '2025-05-21T00:00:00.000Z',
        updatedAt: '2025-05-21T00:00:00.000Z',
      },
    },
  })
  async create(@Body() createDto: NewsDto) {
    const response = await this.newsService.create(createDto);

    return response;
  }

  @Get()
  @ApiOkResponse({
    description: 'List all news with pagination',
    schema: {
      type: 'object',
      example: {
        data: [
          {
            id: 1,
            title: 'Your news title',
            content: 'Your news contec.',
            createdAt: '2025-05-21T21:00:00.000Z',
            updatedAt: '2025-05-21T21:00:00.000Z',
          },
        ],
        total: 1,
        limit: 10,
        offset: 0,
      },
    },
  })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiQuery({ name: 'dateOrder', required: false, example: 'ASC' })
  async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('dateOrder') dateOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('search') search: string,
  ) {
    const response = await this.newsService.findAll(
      Number(limit),
      Number(offset),
      dateOrder,
      search,
    );

    return response;
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get news by id',
    schema: {
      type: 'object',
      example: {
        id: 1,
        title: 'Your news',
        content: 'Your content.',
        createdAt: '2025-05-21T21:00:00.000Z',
        updatedAt: '2025-05-21T21:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'News not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    const response = await this.newsService.findOne(+id);

    return response;
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Update news record',
    schema: {
      type: 'object',
      example: {
        id: 1,
        title: 'Your news updated',
        content: 'Your content updated.',
        createdAt: '2025-05-21T21:00:00.000Z',
        updatedAt: '2025-05-21T21:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'News not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Id 1 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBody({ type: NewsDto })
  async update(@Param('id') id: string, @Body() updateDto: Partial<NewsDto>) {
    const response = await this.newsService.update(+id, updateDto);

    return response;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Record deleted successfully',
    schema: {
      type: 'object',
      example: {
        message: 'Id 1 deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'News not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async remove(@Param('id') id: string) {
    const response = await this.newsService.remove(+id);

    return response;
  }
}
