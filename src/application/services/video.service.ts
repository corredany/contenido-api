import { Injectable, Inject } from '@nestjs/common';
import type { IVideoRepository } from '../../domain/interfaces/video.repository.interface';
import { VIDEO_REPOSITORY } from '../../domain/tokens';
import { Video } from '../../domain/entities/video.entity';
import { CloudinaryHelper } from '../../infrastructure/helpers/cloudinary.helper';
import { ActualizarVideoDto } from '../../domain/dtos/video.dto';
import { VideoNoEncontradoException, ErrorSubidaVideoException } from '../../domain/exceptions/video.exception';

@Injectable()
export class VideoService {
  constructor(
    @Inject(VIDEO_REPOSITORY)
    private readonly videoRepository: IVideoRepository,
  ) {}

  async obtenerTodos(): Promise<Video[]> {
    return this.videoRepository.encontrarTodos();
  }

  async obtenerPorSeccion(seccionId: number): Promise<Video[]> {
    return this.videoRepository.encontrarPorSeccion(seccionId);
  }

  async obtenerPorId(id: number): Promise<Video> {
    const video = await this.videoRepository.encontrarPorId(id);
    if (!video) throw new VideoNoEncontradoException(id);
    return video;
  }

  async subir(
    archivo: Express.Multer.File,
    usuarioId: number,
    seccionId?: number,
    orden?: number,
  ): Promise<Video> {
    try {
      const { url, publicId } = await CloudinaryHelper.subirImagen(archivo, 'videos');
      return this.videoRepository.crear({
        url,
        publicId,
        seccionId: seccionId || null,
        orden: orden || 0,
        creadoPor: usuarioId,
        actualizadoPor: usuarioId,
      });
    } catch {
      throw new ErrorSubidaVideoException();
    }
  }

  async actualizar(id: number, dto: ActualizarVideoDto, usuarioId: number): Promise<Video> {
    await this.obtenerPorId(id);
    return this.videoRepository.actualizar(id, { ...dto, actualizadoPor: usuarioId });
  }

  async eliminar(id: number): Promise<void> {
    const video = await this.obtenerPorId(id);
    await CloudinaryHelper.eliminarImagen(video.publicId);
    return this.videoRepository.eliminar(id);
  }
}
