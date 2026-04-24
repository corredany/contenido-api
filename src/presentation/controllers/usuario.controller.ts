import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { UsuarioService } from '../../application/services/usuario.service';
import { GetUser } from '../decorators/get-user.decorator';
import type { UsuarioAutenticado } from '../decorators/get-user.decorator';
import { CrearUsuarioDto, ActualizarUsuarioDto } from '../../domain/dtos/usuario.dto';

@Controller('usuarios')
@UseGuards(JwtGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  obtenerTodos() {
    return this.usuarioService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.usuarioService.obtenerPorId(Number(id));
  }

  @Post()
  crear(@Body() dto: CrearUsuarioDto, @GetUser() usuario: UsuarioAutenticado) {
    return this.usuarioService.crear(dto, usuario.id);
  }

  @Put(':id')
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarUsuarioDto,
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.usuarioService.actualizar(Number(id), dto, usuario.id);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    await this.usuarioService.eliminar(Number(id));
    return { mensaje: 'Usuario eliminado correctamente' };
  }
}
