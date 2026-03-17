import { IAuthRepository } from '../../domain/interfaces/auth.repository.interface';
import { Usuario } from '../../domain/entities/usuario.entity';
import { TokenRefresco } from '../../domain/entities/token-refresco.entity';
import { prisma } from '../database/prisma';

export class AuthRepository implements IAuthRepository {
  async encontrarUsuarioPorEmail(email: string): Promise<Usuario | null> {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { rol: true },
  });
  return usuario ? new Usuario(usuario) : null;
}

  async encontrarUsuarioPorId(id: number): Promise<Usuario | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });
    return usuario ? new Usuario(usuario) : null;
  }

  async guardarTokenRefresco(data: Partial<TokenRefresco>): Promise<TokenRefresco> {
    const token = await prisma.tokenRefresco.create({ data: data as any });
    return new TokenRefresco(token);
  }

  async encontrarTokenRefresco(token: string): Promise<TokenRefresco | null> {
    const tokenRefresco = await prisma.tokenRefresco.findUnique({
      where: { token },
    });
    return tokenRefresco ? new TokenRefresco(tokenRefresco) : null;
  }

  async revocarTokenRefresco(token: string): Promise<void> {
    await prisma.tokenRefresco.update({
      where: { token },
      data: {
        revocado: true,
        revocadoEn: new Date(),
      },
    });
  }

  async revocarTodosLosTokens(usuarioId: number): Promise<void> {
    await prisma.tokenRefresco.updateMany({
      where: { usuarioId },
      data: {
        revocado: true,
        revocadoEn: new Date(),
      },
    });
  }
}