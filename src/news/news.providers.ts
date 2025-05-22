import { DataSource } from 'typeorm';
import { News } from './news.entity';

export const newsProviders = [
  {
    provide: 'NEWS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(News),
    inject: ['DATA_SOURCE'],
  },
];
