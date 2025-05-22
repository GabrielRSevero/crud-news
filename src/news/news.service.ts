import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NewsDto } from './News.dto';
import { Repository } from 'typeorm';
import { News } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @Inject('NEWS_REPOSITORY')
    private newsRepository: Repository<News>,
  ) {}

  async create(createDto: NewsDto) {
    const newsItem = this.newsRepository.create(createDto);

    return await this.newsRepository.save(newsItem);
  }

  async findAll(limit = 10, offset = 0, dateOrder: 'ASC' | 'DESC' = 'DESC') {
    const [data, total] = await this.newsRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { date: dateOrder },
    });

    return {
      data,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: number) {
    const newsItem = await this.newsRepository.findOne({ where: { id } });

    if (!newsItem) {
      throw new NotFoundException(`Id ${id} not found`);
    }

    return newsItem;
  }

  async update(id: number, updateDto: Partial<NewsDto>) {
    const result = await this.newsRepository.update(id, updateDto);

    if (!result) {
      throw new NotFoundException(`Id ${id} not found`);
    }

    const newsItem = this.findOne(id);

    return newsItem;
  }

  async remove(id: number) {
    const result = await this.newsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Id ${id} not found`);
    }

    return { message: `Id ${id} deleted successfully` };
  }
}
