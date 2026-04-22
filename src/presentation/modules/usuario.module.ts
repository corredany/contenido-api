import { Module } from '@nestjs/common';
import { UsuarioController } from '../controllers/usuario.controller';
import { UsuarioService } from '../../application/services/usuario.service';
import { UsuarioRepository } from '../../infrastructure/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from '../../domain/tokens';

@Module({
  controllers: [UsuarioController],
  providers: [
    { provide: USUARIO_REPOSITORY, useClass: UsuarioRepository },
    UsuarioService,
  ],
})
export class UsuarioModule {}
