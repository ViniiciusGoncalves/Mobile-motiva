// src/types/index.ts

export type StatusTipo = "normal" | "alerta" | "critico";

export type Sensor = {
  id: number;
  nome: string;
  tipo: string;
  unidade: string;
};

export type Medicao = {
  id: number;
  sensor: Sensor;
  valor: number;
  data: Date;
  status: StatusTipo; // Adicionado para facilitar a vinculação com a interface
};