export interface Policies {
  imagePolicies?: string;
  informationalMessage?: string;
  imageConfa?: string;
  tratamientoDeDatos?: TratamientoDeDatos;
  condicionesDeUsoDelServicio?: CondicionesDeUsoDelServicio;
  tratamientoDeDatosMenores?: TratamientoDeDatosMenores;
}

export interface TratamientoDeDatos {
  title?: string;
  subtitle?: string;
  titleBody?: string;
  paragraphs?: Paragraph[];
}

export interface CondicionesDeUsoDelServicio {
  title?: string;
  subtitle?: string;
  paragraphs?: Paragraph[];
}
export interface TratamientoDeDatosMenores {
  title?: string;
  subtitle?: string;
  titleBody?: string;
  paragraphs?: Paragraph[];
}

export interface Paragraph {
  paragraph?: string;
  paragraph1?: string;
}
