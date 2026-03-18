import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { ImagenService } from '../services/imagen.service';
import { ImagenRepository } from '../../infrastructure/repositories/imagen.repository';
import type { ActualizarImagenDto } from '../../domain/dtos/imagen.dto';
import {
  ImagenNoEncontradaException,
  ErrorSubidaImagenException,
} from '../../domain/exceptions/imagen.exception';

const imagenRepository = new ImagenRepository();
const imagenService = new ImagenService(imagenRepository);

@Controller('imagenes')
export class ImagenController {
  @Get()
  async obtenerTodos() {
    try {
      return await imagenService.obtenerTodos();
    } catch (error) {
      return { error: 'Error al obtener imágenes' };
    }
  }

  @Get('seccion/:seccionId')
  async obtenerPorSeccion(@Param('seccionId') seccionId: string) {
    try {
      return await imagenService.obtenerPorSeccion(Number(seccionId));
    } catch (error) {
      return { error: 'Error al obtener imágenes de la sección' };
    }
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    try {
      return await imagenService.obtenerPorId(Number(id));
    } catch (error) {
      if (error instanceof ImagenNoEncontradaException) {
        return { error: error.message };
      }
      return { error: 'Error al obtener imagen' };
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('archivo', { storage: memoryStorage() }))
  async subir(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() body: { seccionId?: string; orden?: string },
  ) {
    try {
      return await imagenService.subir(
        archivo,
        body.seccionId ? Number(body.seccionId) : undefined,
        body.orden ? Number(body.orden) : undefined,
      );
    } catch (error) {
      if (error instanceof ErrorSubidaImagenException) {
        return { error: error.message };
      }
      return { error: 'Error al subir imagen' };
    }
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarImagenDto) {
    try {
      return await imagenService.actualizar(Number(id), dto);
    } catch (error) {
      if (error instanceof ImagenNoEncontradaException) {
        return { error: error.message };
      }
      return { error: 'Error al actualizar imagen' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async eliminar(@Param('id') id: string) {
    try {
      await imagenService.eliminar(Number(id));
      return { mensaje: 'Imagen eliminada correctamente' };
    } catch (error) {
      if (error instanceof ImagenNoEncontradaException) {
        return { error: error.message };
      }
      return { error: 'Error al eliminar imagen' };
    }
  }
}