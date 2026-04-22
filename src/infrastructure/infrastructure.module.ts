import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [PassportModule],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class InfrastructureModule {}
