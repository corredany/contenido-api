import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { SeccionService } from '../services/seccion.service';
import { SeccionRepository } from '../../infrastructure/repositories/seccion.repository';
import type { CrearSeccionDto, ActualizarSeccionDto, ActualizarOrdenDto } from '../../domain/dtos/seccion.dto';
import {
  SeccionNoEncontradaException,
  SeccionFijaException,
} from '../../domain/exceptions/seccion.exception';

const seccionRepository = new SeccionRepository();
const seccionService = new SeccionService(seccionRepository);

@Controller('secciones')
export class SeccionController {
  @Get()
  async obtenerTodos() {
    try {
      return await seccionService.obtenerTodos();
    } catch (error) {
      return { error: 'Error al obtener secciones' };
    }
  }

  @Get('visibles')
  async obtenerVisibles() {
    try {
      return await seccionService.obtenerVisibles();
    } catch (error) {
      return { error: 'Error al obtener secciones visibles' };
    }
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    try {
      return await seccionService.obtenerPorId(Number(id));
    } catch (error) {
      if (error instanceof SeccionNoEncontradaException) {
        return { error: error.message };
      }
      return { error: 'Error al obtener sección' };
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  async crear(@Body() dto: CrearSeccionDto) {
    try {
      return await seccionService.crear(dto);
    } catch (error) {
      return { error: 'Error al crear sección' };
    }
  }

  @Put('orden')
  @UseGuards(JwtGuard)
  async actualizarOrden(@Body() secciones: ActualizarOrdenDto[]) {
    try {
      await seccionService.actualizarOrden(secciones);
      return { mensaje: 'Orden actualizado correctamente' };
    } catch (error) {
      return { error: 'Error al actualizar orden' };
    }
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarSeccionDto) {
    try {
      return await seccionService.actualizar(Number(id), dto);
    } catch (error) {
      if (error instanceof SeccionNoEncontradaException) {
        return { error: error.message };
      }
      return { error: 'Error al actualizar sección' };
    }
  }

  @Put(':id/toggle-visible')
  @UseGuards(JwtGuard)
  async toggleVisible(@Param('id') id: string) {
    try {
      return await seccionService.toggleVisible(Number(id));
    } catch (error) {
      if (error instanceof SeccionNoEncontradaException) {
        return { error: error.message };
      }
      return { error: 'Error al cambiar visibilidad' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async eliminar(@Param('id') id: string) {
    try {
      await seccionService.eliminar(Number(id));
      return { mensaje: 'Sección eliminada correctamente' };
    } catch (error) {
      if (error instanceof SeccionNoEncontradaException) {
        return { error: error.message };
      }
      if (error instanceof SeccionFijaException) {
        return { error: error.message };
      }
      return { error: 'Error al eliminar sección' };
    }
  }
}