import { Module } from '@nestjs/common';
import { AuthController } from './application/controllers/auth.controller';
import { UsuarioController } from './application/controllers/usuario.controller';
import { SeccionController } from './application/controllers/seccion.controller';
import { ImagenController } from './application/controllers/imagen.controller';

@Module({
  imports: [],
  controllers: [AuthController, UsuarioController, SeccionController, ImagenController],
  providers: [],
})
export class AppModule {}
