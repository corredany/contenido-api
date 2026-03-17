import { IUsuarioRepository } from '../../domain/interfaces/usuario.repository.interface';
import { Usuario } from '../../domain/entities/usuario.entity';
import { prisma } from '../database/prisma';

export class UsuarioRepository implements IUsuarioRepository {
  async encontrarTodos(): Promise<Usuario[]> {
    const usuarios = await prisma.usuario.findMany({
      include: { rol: true },
      omit: { contrasena: true },
    });
    return usuarios.map((u) => new Usuario(u));
  }

  async encontrarPorId(id: number): Promise<Usuario | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { rol: true },
      omit: { contrasena: true },
    });
    return usuario ? new Usuario(usuario) : null;
  }

  async encontrarPorEmail(email: string): Promise<Usuario | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });
    return usuario ? new Usuario(usuario) : null;
  }

  async crear(data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await prisma.usuario.create({
      data: data as any,
      include: { rol: true },
      omit: { contrasena: true },
    });
    return new Usuario(usuario);
  }

  async actualizar(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: data as any,
      include: { rol: true },
      omit: { contrasena: true },
    });
    return new Usuario(usuario);
  }

  async eliminar(id: number): Promise<void> {
    await prisma.usuario.delete({
      where: { id },
    });
  }
}