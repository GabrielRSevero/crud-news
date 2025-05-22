import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { DatabaseModule } from 'src/database.module';
import { newsProviders } from './news.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [NewsController],
  providers: [...newsProviders, NewsService],
})
export class NewsModule {}
