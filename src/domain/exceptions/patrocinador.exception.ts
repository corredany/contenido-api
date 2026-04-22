export class PatrocinadorNoEncontradoException extends Error {
  constructor(id: number) {
    super(`Patrocinador con id ${id} no encontrado`);
    this.name = 'PatrocinadorNoEncontradoException';
  }
}

export class ErrorSubidaPatrocinadorException extends Error {
  constructor() {
    super('Error al subir la imagen del patrocinador a Cloudinary');
    this.name = 'ErrorSubidaPatrocinadorException';
  }
}
