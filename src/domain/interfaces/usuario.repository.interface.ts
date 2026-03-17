import { Usuario } from '../entities/usuario.entity';

export interface IUsuarioRepository {
  encontrarTodos(): Promise<Usuario[]>;
  encontrarPorId(id: number): Promise<Usuario | null>;
  encontrarPorEmail(email: string): Promise<Usuario | null>;
  crear(data: Partial<Usuario>): Promise<Usuario>;
  actualizar(id: number, data: Partial<Usuario>): Promise<Usuario>;
  eliminar(id: number): Promise<void>;
}