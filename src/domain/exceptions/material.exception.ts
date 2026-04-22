export class MaterialNoEncontradoException extends Error {
  constructor(id: number) {
    super(`Material con id ${id} no encontrado`);
    this.name = 'MaterialNoEncontradoException';
  }
}

export class ErrorSubidaMaterialException extends Error {
  constructor() {
    super('Error al subir el material a Cloudinary');
    this.name = 'ErrorSubidaMaterialException';
  }
}
