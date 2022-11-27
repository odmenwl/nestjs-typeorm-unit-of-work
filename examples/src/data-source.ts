import { join } from 'path';

import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: Number(configService.getOrThrow('DB_PORT')),
  username: configService.getOrThrow('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.getOrThrow('DB_DATABASE'),
  entities: [join('src', 'entities', '**', '*.entity.ts')],
  migrations: [join('src', 'migrations', '**', '*.ts')],
});
