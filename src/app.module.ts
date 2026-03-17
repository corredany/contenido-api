import { Module } from '@nestjs/common';
import { AuthController } from './application/controllers/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
