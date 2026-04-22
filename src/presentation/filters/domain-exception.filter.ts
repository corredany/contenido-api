import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { UsuarioNoEncontradoException, EmailDuplicadoException } from '../../domain/exceptions/usuario.exception';
import { SeccionNoEncontradaException, SeccionFijaException } from '../../domain/exceptions/seccion.exception';
import { ImagenNoEncontradaException, ErrorSubidaImagenException } from '../../domain/exceptions/imagen.exception';
import { VideoNoEncontradoException, ErrorSubidaVideoException } from '../../domain/exceptions/video.exception';
import { MaterialNoEncontradoException, ErrorSubidaMaterialException } from '../../domain/exceptions/material.exception';
import { PatrocinadorNoEncontradoException, ErrorSubidaPatrocinadorException } from '../../domain/exceptions/patrocinador.exception';

const STATUS_MAP = new Map<new (...args: any[]) => Error, HttpStatus>([
  [UsuarioNoEncontradoException, HttpStatus.NOT_FOUND],
  [EmailDuplicadoException, HttpStatus.CONFLICT],
  [SeccionNoEncontradaException, HttpStatus.NOT_FOUND],
  [SeccionFijaException, HttpStatus.UNPROCESSABLE_ENTITY],
  [ImagenNoEncontradaException, HttpStatus.NOT_FOUND],
  [ErrorSubidaImagenException, HttpStatus.BAD_GATEWAY],
  [VideoNoEncontradoException, HttpStatus.NOT_FOUND],
  [ErrorSubidaVideoException, HttpStatus.BAD_GATEWAY],
  [MaterialNoEncontradoException, HttpStatus.NOT_FOUND],
  [ErrorSubidaMaterialException, HttpStatus.BAD_GATEWAY],
  [PatrocinadorNoEncontradoException, HttpStatus.NOT_FOUND],
  [ErrorSubidaPatrocinadorException, HttpStatus.BAD_GATEWAY],
]);

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    for (const [ExceptionClass, status] of STATUS_MAP) {
      if (exception instanceof ExceptionClass) {
        return response.status(status).json({ error: exception.message });
      }
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor' });
  }
}
