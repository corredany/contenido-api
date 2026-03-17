import { IUsuarioRepository } from '../../domain/interfaces/usuario.repository.interface';
import { HashHelper } from '../../infrastructure/helpers/hash.helper';
import { CrearUsuarioDto, ActualizarUsuarioDto } from '../../domain/dtos/usuario.dto';
import { Usuario } from '../../domain/entities/usuario.entity';
import {
  UsuarioNoEncontradoException,
  EmailDuplicadoException,
} from '../../domain/exceptions/usuario.exception';

export class UsuarioService {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepository.encontrarTodos();
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.encontrarPorId(id);
    if (!usuario) throw new UsuarioNoEncontradoException(id);
    return usuario;
  }

  async crear(dto: CrearUsuarioDto): Promise<Usuario> {
    // Verificar si el email ya existe
    const emailExiste = await this.usuarioRepository.encontrarPorEmail(dto.email);
    if (emailExiste) throw new EmailDuplicadoException();

    // Encriptar contraseña
    const contrasenaEncriptada = await HashHelper.encriptar(dto.contrasena);

    return this.usuarioRepository.crear({
      ...dto,
      contrasena: contrasenaEncriptada,
    });
  }

  async actualizar(id: number, dto: ActualizarUsuarioDto): Promise<Usuario> {
    await this.obtenerPorId(id);

    if (dto.contrasena) {
      dto.contrasena = await HashHelper.encriptar(dto.contrasena);
    }

    if (dto.email) {
      const emailExiste = await this.usuarioRepository.encontrarPorEmail(dto.email);
      if (emailExiste) throw new EmailDuplicadoException();
    }

    return this.usuarioRepository.actualizar(id, dto);
  }

  async eliminar(id: number): Promise<void> {
    await this.obtenerPorId(id);
    return this.usuarioRepository.eliminar(id);
  }
}