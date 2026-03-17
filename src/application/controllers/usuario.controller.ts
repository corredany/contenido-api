import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
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
export class UsuarioController {
  @Get()
  async obtenerTodos() {
    try {
      const usuarios = await usuarioService.obtenerTodos();
      return usuarios;
    } catch (error) {
      return { error: 'Error al obtener usuarios' };
    }
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    try {
      const usuario = await usuarioService.obtenerPorId(Number(id));
      return usuario;
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
      const usuario = await usuarioService.crear(dto);
      return usuario;
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
      const usuario = await usuarioService.actualizar(Number(id), dto);
      return usuario;
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