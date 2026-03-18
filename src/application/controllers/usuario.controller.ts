import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioRepository } from '../../infrastructure/repositories/usuario.repository';
import type { CrearUsuarioDto, ActualizarUsuarioDto } from '../../domain/dtos/usuario.dto';
import {
  UsuarioNoEncontradoException,
  EmailDuplicadoException,
} from '../../domain/exceptions/usuario.exception';

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);

@Controller('usuarios')
@UseGuards(JwtGuard)
export class UsuarioController {
  @Get()
  async obtenerTodos() {
    try {
      return await usuarioService.obtenerTodos();
    } catch (error) {
      return { error: 'Error al obtener usuarios' };
    }
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    try {
      return await usuarioService.obtenerPorId(Number(id));
    } catch (error) {
      if (error instanceof UsuarioNoEncontradoException) {
        return { error: error.message };
      }
      return { error: 'Error al obtener usuario' };
    }
  }

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    try {
      return await usuarioService.crear(dto);
    } catch (error) {
      if (error instanceof EmailDuplicadoException) {
        return { error: error.message };
      }
      return { error: 'Error al crear usuario' };
    }
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    try {
      return await usuarioService.actualizar(Number(id), dto);
    } catch (error) {
      if (error instanceof UsuarioNoEncontradoException) {
        return { error: error.message };
      }
      if (error instanceof EmailDuplicadoException) {
        return { error: error.message };
      }
      return { error: 'Error al actualizar usuario' };
    }
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    try {
      await usuarioService.eliminar(Number(id));
      return { mensaje: 'Usuario eliminado correctamente' };
    } catch (error) {
      if (error instanceof UsuarioNoEncontradoException) {
        return { error: error.message };
      }
      return { error: 'Error al eliminar usuario' };
    }
  }
}