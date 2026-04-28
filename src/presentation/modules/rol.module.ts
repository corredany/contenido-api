import { Module } from '@nestjs/common';
import { RolController } from '../controllers/rol.controller';

@Module({
  controllers: [RolController],
})
export class RolModule {}
