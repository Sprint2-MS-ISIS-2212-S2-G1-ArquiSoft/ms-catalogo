import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoModule } from './catalogo/catalogo.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'catalogo'),
        password: config.get<string>('DB_PASSWORD', 'catalogo'),
        database: config.get<string>('DB_NAME', 'catalogo'),
        autoLoadEntities: true,
        synchronize: true,
        logging: config.get<string>('DB_LOGGING') === 'true',
      }),
    }),
    CatalogoModule,
    HealthModule,
  ],
})
export class AppModule {}
