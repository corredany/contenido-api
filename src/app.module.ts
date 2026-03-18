import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './application/controllers/auth.controller';
import { UsuarioController } from './application/controllers/usuario.controller';
import { SeccionController } from './application/controllers/seccion.controller';
import { ImagenController } from './application/controllers/imagen.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
  ],
  controllers: [AuthController, UsuarioController, SeccionController, ImagenController],
  providers: [JwtStrategy],
})
export class AppModule {}