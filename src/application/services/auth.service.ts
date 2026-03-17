import { IAuthRepository } from '../../domain/interfaces/auth.repository.interface';
import { HashHelper } from '../../infrastructure/helpers/hash.helper';
import { JwtHelper } from '../../infrastructure/helpers/jwt.helper';
import { LoginDto, AuthResponseDto } from '../../domain/dtos/auth.dto';
import {
  CredencialesInvalidasException,
  TokenInvalidoException,
  TokenRevocadoException,
  UsuarioNoEncontradoException,
} from '../../domain/exceptions/auth.exception';

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(dto: LoginDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    // 1. Buscar usuario por email
    const usuario = await this.authRepository.encontrarUsuarioPorEmail(dto.email);
    if (!usuario) throw new CredencialesInvalidasException();

    // 2. Verificar contraseña
    const contrasenaValida = await HashHelper.verificar(dto.contrasena, usuario.contrasena);
    if (!contrasenaValida) throw new CredencialesInvalidasException();

    // 3. Generar tokens
    const accessToken = JwtHelper.generarAccessToken({
      id: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
    });

    const refreshToken = JwtHelper.generarRefreshToken({ id: usuario.id });

    // 4. Guardar refresh token en BD
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    await this.authRepository.guardarTokenRefresco({
      token: refreshToken,
      usuarioId: usuario.id,
      expiraEn,
      revocado: false,
      revocadoEn: null,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: String(usuario.rolId),
      },
    };
  }

  async refresh(token: string): Promise<{ accessToken: string }> {
    // 1. Verificar que el token es válido
    const payload = JwtHelper.verificarToken(token);
    if (!payload) throw new TokenInvalidoException();

    // 2. Buscar token en BD
    const tokenRefresco = await this.authRepository.encontrarTokenRefresco(token);
    if (!tokenRefresco) throw new TokenInvalidoException();

    // 3. Verificar que no está revocado ni expirado
    if (!tokenRefresco.estaVigente()) throw new TokenRevocadoException();

    // 4. Buscar usuario
    const usuario = await this.authRepository.encontrarUsuarioPorId(payload.id);
    if (!usuario) throw new UsuarioNoEncontradoException();

    // 5. Generar nuevo access token
    const accessToken = JwtHelper.generarAccessToken({
      id: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
    });

    return { accessToken };
  }

  async logout(token: string): Promise<void> {
    await this.authRepository.revocarTokenRefresco(token);
  }
}