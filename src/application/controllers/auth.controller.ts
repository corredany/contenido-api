import { Controller, Post, Body, Req, Res, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';
import type { LoginDto } from '../../domain/dtos/auth.dto';
import {
  CredencialesInvalidasException,
  TokenInvalidoException,
  TokenRevocadoException,
} from '../../domain/exceptions/auth.exception';
import type { Request, Response } from 'express';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

@Controller('auth')
export class AuthController {
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res() res: Response) {
    try {
      const ipAddress = req.ip || '';
      const userAgent = req.headers['user-agent'] || '';
      const resultado = await authService.login(dto, ipAddress, userAgent);
      return res.json(resultado);
    } catch (error) {
      if (error instanceof CredencialesInvalidasException) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() dto: { token: string }, @Res() res: Response) {
    try {
      const resultado = await authService.refresh(dto.token);
      return res.json(resultado);
    } catch (error) {
      if (error instanceof TokenInvalidoException || error instanceof TokenRevocadoException) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Body() dto: { token: string }, @Res() res: Response) {
    try {
      await authService.logout(dto.token);
      return res.json({ mensaje: 'Sesión cerrada correctamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}