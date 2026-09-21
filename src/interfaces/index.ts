// src/interfaces/index.ts
// Contratos do JSON devolvido pela API Spring Boot (sensor-api).
// Refletem exatamente o corpo das respostas — por isso `data` é string (ISO-8601)
// e o status vem em maiúsculas. A conversão para os tipos de domínio
// (src/types) acontece em src/services/mapeadores.ts.

export type StatusApi = "NORMAL" | "ALERTA" | "CRITICO";

/** GET /sensores — entidade Sensor serializada pela API */
export interface SensorApi {
  id: number;
  nome: string;
  tipo: string;
  local: string | null;
  unidade: string;
  limiteMinimo: number | null;
  limiteMaximo: number | null;
  ativo: boolean | null;
}

/** GET|POST /medicoes — MedicaoResponseDTO (formato plano, sensor "achatado") */
export interface MedicaoApi {
  id: number;
  sensorId: number;
  sensorNome: string | null;
  sensorTipo: string | null;
  sensorLocal: string | null;
  unidade: string | null;
  valor: number | null;
  /** ISO-8601, ex.: "2026-09-20T19:51:16.024" */
  data: string | null;
  limiteMinimo: number | null;
  limiteMaximo: number | null;
  status: StatusApi | null;
}

/** Corpo de erro padronizado pelo GlobalExceptionHandler */
export interface ErroApi {
  timestamp: string;
  status: number;
  erro: string;
  mensagem: string;
}
