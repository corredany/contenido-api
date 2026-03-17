import { Module } from '@nestjs/common';
import { AuthController } from './application/controllers/auth.controller';
import { UsuarioController } from './application/controllers/usuario.controller';

@Module({
  imports: [],
  controllers: [AuthController, UsuarioController],
  providers: [],
})
export class AppModule {}
