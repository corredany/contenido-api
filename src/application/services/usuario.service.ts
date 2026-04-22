import { Injectable, Inject } from '@nestjs/common';
import type { IUsuarioRepository } from '../../domain/interfaces/usuario.repository.interface';
import { USUARIO_REPOSITORY } from '../../domain/tokens';
import { HashHelper } from '../../infrastructure/helpers/hash.helper';
import { CrearUsuarioDto, ActualizarUsuarioDto } from '../../domain/dtos/usuario.dto';
import { Usuario } from '../../domain/entities/usuario.entity';
import {
  UsuarioNoEncontradoException,
  EmailDuplicadoException,
} from '../../domain/exceptions/usuario.exception';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepository.encontrarTodos();
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.encontrarPorId(id);
    if (!usuario) throw new UsuarioNoEncontradoException(id);
    return usuario;
  }

  async crear(dto: CrearUsuarioDto, usuarioId: number): Promise<Usuario> {
    const emailExiste = await this.usuarioRepository.encontrarPorEmail(dto.email);
    if (emailExiste) throw new EmailDuplicadoException();

    const contrasenaEncriptada = await HashHelper.encriptar(dto.contrasena);

    return this.usuarioRepository.crear({
      ...dto,
      contrasena: contrasenaEncriptada,
      creadoPor: usuarioId,
      actualizadoPor: usuarioId,
    });
  }

  async actualizar(id: number, dto: ActualizarUsuarioDto, usuarioId: number): Promise<Usuario> {
    await this.obtenerPorId(id);

    if (dto.contrasena) {
      dto.contrasena = await HashHelper.encriptar(dto.contrasena);
    }

    if (dto.email) {
      const emailExiste = await this.usuarioRepository.encontrarPorEmail(dto.email);
      if (emailExiste) throw new EmailDuplicadoException();
    }

    return this.usuarioRepository.actualizar(id, { ...dto, actualizadoPor: usuarioId });
  }

  async eliminar(id: number): Promise<void> {
    await this.obtenerPorId(id);
    return this.usuarioRepository.eliminar(id);
  }
}
