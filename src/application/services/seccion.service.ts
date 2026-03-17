import { ISeccionRepository } from '../../domain/interfaces/seccion.repository.interface';
import { Seccion } from '../../domain/entities/seccion.entity';
import { CrearSeccionDto, ActualizarSeccionDto, ActualizarOrdenDto } from '../../domain/dtos/seccion.dto';
import {
  SeccionNoEncontradaException,
  SeccionFijaException,
} from '../../domain/exceptions/seccion.exception';

export class SeccionService {
  constructor(private readonly seccionRepository: ISeccionRepository) {}

  async obtenerTodos(): Promise<Seccion[]> {
    return this.seccionRepository.encontrarTodos();
  }

  async obtenerVisibles(): Promise<Seccion[]> {
    return this.seccionRepository.encontrarVisibles();
  }

  async obtenerPorId(id: number): Promise<Seccion> {
    const seccion = await this.seccionRepository.encontrarPorId(id);
    if (!seccion) throw new SeccionNoEncontradaException(id);
    return seccion;
  }

  async crear(dto: CrearSeccionDto): Promise<Seccion> {
    return this.seccionRepository.crear({
      ...dto,
      esFija: false,
      visible: true,
    });
  }

  async actualizar(id: number, dto: ActualizarSeccionDto): Promise<Seccion> {
    const seccion = await this.obtenerPorId(id);
    return this.seccionRepository.actualizar(id, dto);
  }

  async actualizarOrden(secciones: ActualizarOrdenDto[]): Promise<void> {
    return this.seccionRepository.actualizarOrden(secciones);
  }

  async toggleVisible(id: number): Promise<Seccion> {
    const seccion = await this.obtenerPorId(id);
    return this.seccionRepository.actualizar(id, { visible: !seccion.visible });
  }

  async eliminar(id: number): Promise<void> {
    const seccion = await this.obtenerPorId(id);
    if (!seccion.puedeEliminarse()) throw new SeccionFijaException();
    return this.seccionRepository.eliminar(id);
  }
}