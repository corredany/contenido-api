export class UsuarioNoEncontradoException extends Error {
  constructor(id: number) {
    super(`Usuario con id ${id} no encontrado`);
    this.name = 'UsuarioNoEncontradoException';
  }
}

export class EmailDuplicadoException extends Error {
  constructor() {
    super('El email ya está registrado');
    this.name = 'EmailDuplicadoException';
  }
}

export class UsuarioSinPermisosException extends Error {
  constructor() {
    super('No tienes permisos para realizar esta acción');
    this.name = 'UsuarioSinPermisosException';
  }
}