import { IImagenRepository } from '../../domain/interfaces/imagen.repository.interface';
import { Imagen } from '../../domain/entities/imagen.entity';
import { CloudinaryHelper } from '../../infrastructure/helpers/cloudinary.helper';
import { ActualizarImagenDto } from '../../domain/dtos/imagen.dto';
import { ImagenNoEncontradaException, ErrorSubidaImagenException } from '../../domain/exceptions/imagen.exception';

export class ImagenService {
  constructor(private readonly imagenRepository: IImagenRepository) {}

  async obtenerTodos(): Promise<Imagen[]> {
    return this.imagenRepository.encontrarTodos();
  }

  async obtenerPorSeccion(seccionId: number): Promise<Imagen[]> {
    return this.imagenRepository.encontrarPorSeccion(seccionId);
  }

  async obtenerPorId(id: number): Promise<Imagen> {
    const imagen = await this.imagenRepository.encontrarPorId(id);
    if (!imagen) throw new ImagenNoEncontradaException(id);
    return imagen;
  }

  async subir(
    archivo: Express.Multer.File,
    seccionId?: number,
    orden?: number,
  ): Promise<Imagen> {
    try {
      const { url, publicId } = await CloudinaryHelper.subirImagen(archivo);
      return this.imagenRepository.crear({
        url,
        publicId,
        seccionId: seccionId || null,
        orden: orden || 0,
      });
    } catch {
      throw new ErrorSubidaImagenException();
    }
  }

  async actualizar(id: number, dto: ActualizarImagenDto): Promise<Imagen> {
    await this.obtenerPorId(id);
    return this.imagenRepository.actualizar(id, dto);
  }

  async eliminar(id: number): Promise<void> {
    const imagen = await this.obtenerPorId(id);
    await CloudinaryHelper.eliminarImagen(imagen.publicId);
    return this.imagenRepository.eliminar(id);
  }
  
}