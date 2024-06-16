import { Module } from '@nestjs/common';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { OneModule } from './modules/one/one.module';
import { GroupsModule } from './modules/groups/groups.module';
import { OusModule } from './modules/ous/ous.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: true,
    logging: false
    }),
    UsersModule, OneModule, GroupsModule, OusModule, AuthModule, SeedModule, InventoryModule],
  controllers: [UsersController],
  providers: [UsersService],
})

export class AppModule {}
