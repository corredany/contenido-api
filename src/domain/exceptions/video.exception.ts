export class VideoNoEncontradoException extends Error {
  constructor(id: number) {
    super(`Video con id ${id} no encontrado`);
    this.name = 'VideoNoEncontradoException';
  }
}

export class ErrorSubidaVideoException extends Error {
  constructor() {
    super('Error al subir el video a Cloudinary');
    this.name = 'ErrorSubidaVideoException';
  }
}
