import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NotFoundException } from '@nestjs/common';

describe('NewsController', () => {
  let controller: NewsController;
  let service: Partial<Record<keyof NewsService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [{ provide: NewsService, useValue: service }],
    }).compile();

    controller = module.get<NewsController>(NewsController);
  });

  it('should create news and return it', async () => {
    const dto = {
      title: 'title',
      content: 'content',
      date: new Date().toISOString(),
    };
    const created = { id: 1, ...dto };

    service.create.mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('should return paginated news list', async () => {
    const response = {
      data: [{ id: 1, title: 'title', content: 'content', date: new Date() }],
      total: 1,
      limit: 10,
      offset: 0,
    };

    service.findAll.mockResolvedValue(response);

    const result = await controller.findAll(10, 0, 'DESC');

    expect(service.findAll).toHaveBeenCalledWith(10, 0, 'DESC');
    expect(result).toEqual(response);
  });

  it('should throw NotFoundException if news not found', async () => {
    service.findOne.mockRejectedValue(new NotFoundException('Id 1 not found'));

    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should return news item by id', async () => {
    const news = {
      id: 1,
      title: 'title',
      content: 'content',
      date: new Date(),
    };
    service.findOne.mockResolvedValue(news);

    const result = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(news);
  });

  it('should throw NotFoundException if update fails', async () => {
    service.update.mockRejectedValue(new NotFoundException('Id 1 not found'));

    await expect(controller.update('1', { title: 'updated' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update news item and return it', async () => {
    const updated = {
      id: 1,
      title: 'updated',
      content: 'updated',
      date: new Date(),
    };
    const updateDto = { title: 'updated' };

    service.update.mockResolvedValue(updated);

    const result = await controller.update('1', updateDto);

    expect(service.update).toHaveBeenCalledWith(1, updateDto);
    expect(result).toEqual(updated);
  });

  it('should throw NotFoundException if remove fails', async () => {
    service.remove.mockRejectedValue(new NotFoundException('Id 1 not found'));

    await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
  });

  it('should remove news item and return success message', async () => {
    const message = { message: 'Id 1 deleted successfully' };
    service.remove.mockResolvedValue(message);

    const result = await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(message);
  });
});
