import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { SeccionService } from '../../application/services/seccion.service';
import { GetUser } from '../decorators/get-user.decorator';
import type { UsuarioAutenticado } from '../decorators/get-user.decorator';
import { CrearSeccionDto, ActualizarSeccionDto, ActualizarOrdenDto } from '../../domain/dtos/seccion.dto';

@Controller('secciones')
export class SeccionController {
  constructor(private readonly seccionService: SeccionService) {}

  @Get()
  obtenerTodos() {
    return this.seccionService.obtenerTodos();
  }

  @Get('visibles')
  obtenerVisibles() {
    return this.seccionService.obtenerVisibles();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.seccionService.obtenerPorId(Number(id));
  }

  @Post()
  @UseGuards(JwtGuard)
  crear(@Body() dto: CrearSeccionDto, @GetUser() usuario: UsuarioAutenticado) {
    return this.seccionService.crear(dto, usuario.id);
  }

  @Put('orden')
  @UseGuards(JwtGuard)
  async actualizarOrden(@Body() secciones: ActualizarOrdenDto[]) {
    await this.seccionService.actualizarOrden(secciones);
    return { mensaje: 'Orden actualizado correctamente' };
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarSeccionDto,
    @GetUser() usuario: UsuarioAutenticado,
  ) {
    return this.seccionService.actualizar(Number(id), dto, usuario.id);
  }

  @Put(':id/toggle-visible')
  @UseGuards(JwtGuard)
  toggleVisible(@Param('id') id: string, @GetUser() usuario: UsuarioAutenticado) {
    return this.seccionService.toggleVisible(Number(id), usuario.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async eliminar(@Param('id') id: string) {
    await this.seccionService.eliminar(Number(id));
    return { mensaje: 'Sección eliminada correctamente' };
  }
}
