import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { News } from './news.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('NewsService', () => {
  let service: NewsService;
  let newsRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(News),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    newsRepository = module.get<MockRepository>(getRepositoryToken(News));
  });

  it('should create and save a news item', async () => {
    const dto = {
      title: 'Title',
      content: 'Content',
      date: new Date().toISOString(),
    };
    const created = { id: 1, ...dto };

    newsRepository.create.mockReturnValue(created);
    newsRepository.save.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(newsRepository.create).toHaveBeenCalledWith(dto);
    expect(newsRepository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('should return paginated list of news', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    const total = 2;
    newsRepository.findAndCount.mockResolvedValue([items, total]);

    const result = await service.findAll(10, 0, 'DESC');

    expect(newsRepository.findAndCount).toHaveBeenCalledWith({
      take: 10,
      skip: 0,
      order: { date: 'DESC' },
    });
    expect(result).toEqual({
      data: items,
      total,
      limit: 10,
      offset: 0,
    });
  });

  it('should return a news item if found', async () => {
    const item = { id: 1 };
    newsRepository.findOne.mockResolvedValue(item);

    const result = await service.findOne(1);

    expect(newsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(item);
  });

  it('should throw NotFoundException if news not found', async () => {
    newsRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a news item and return it', async () => {
    newsRepository.update.mockResolvedValue({ affected: 1 });

    const updatedItem: News = {
      id: 1,
      title: 'updated',
      content: 'some content',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(updatedItem);

    const result = await service.update(1, { title: 'updated' });

    expect(newsRepository.update).toHaveBeenCalledWith(1, { title: 'updated' });
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(updatedItem);
  });

  it('should throw NotFoundException if update affects 0 rows', async () => {
    newsRepository.update.mockResolvedValue({ affected: 0 });

    await expect(service.update(1, { title: 'updated' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a news item', async () => {
    newsRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(1);

    expect(newsRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Id 1 deleted successfully' });
  });

  it('should throw NotFoundException if delete affects 0 rows', async () => {
    newsRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });
});
