import { TokenRefresco } from '../entities/token-refresco.entity';
import { Usuario } from '../entities/usuario.entity';

export interface IAuthRepository {
  encontrarUsuarioPorEmail(email: string): Promise<Usuario | null>;
  encontrarUsuarioPorId(id: number): Promise<Usuario | null>;
  guardarTokenRefresco(data: Omit<TokenRefresco, 'id' | 'creadoEn'>): Promise<TokenRefresco>;
  encontrarTokenRefresco(token: string): Promise<TokenRefresco | null>;
  revocarTokenRefresco(token: string): Promise<void>;
  revocarTodosLosTokens(usuarioId: number): Promise<void>;
}