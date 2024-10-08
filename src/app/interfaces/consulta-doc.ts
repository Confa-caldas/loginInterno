export interface ConsultaDoc {
  debeActualizarDatos?: boolean;
  debeRealizarValidacion?: boolean;
  puedeIngresar?: boolean;
  exitoso: boolean;
}
export interface consulta {
  mensaje: string;
  fechas: temp[];
}

export interface temp {
  nombreCompleto: String;
  anio: number;
  codigo_depto: null;
  estadoInscripcion: string;
  fechaFinInscripcion: string;
  fechaInicioInscripcion: string;
  idSorteo: number;
  nombreTemporada: string;
}
export interface alojamiento {
  nombre: string;
  tipos: Dias[];
}
export interface Dias {
  nombreCompleto: String;
}
