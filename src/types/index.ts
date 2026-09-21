// src/types/index.ts
// Tipos de domínio do app — o que a interface consome depois de tratado.

export type StatusTipo = "normal" | "alerta" | "critico";

export type Sensor = {
  id: number;
  nome: string;
  tipo: string;
  unidade: string;
  /** Localização do sensor na rodovia (opcional: nem toda origem informa) */
  local?: string;
};

export type Medicao = {
  id: number;
  sensor: Sensor;
  valor: number;
  data: Date;
  /** Status já resolvido, para a interface não recalcular a cada render */
  status: StatusTipo;
};
