// src/services/mapeadores.ts
// Tradução entre o JSON da API (src/interfaces) e os tipos de domínio do app
// (src/types). É aqui que o formato plano do MedicaoResponseDTO vira uma
// Medicao com o Sensor aninhado, e que a data ISO vira Date.

import { MedicaoApi, SensorApi, StatusApi } from "../interfaces";
import { Medicao, Sensor, StatusTipo } from "../types";
import { calcularStatus } from "../utils/logica";

const STATUS_POR_API: Record<StatusApi, StatusTipo> = {
  NORMAL: "normal",
  ALERTA: "alerta",
  CRITICO: "critico",
};

/** Usa o status da API; se ele não vier, cai na regra local da Sprint 2. */
export function paraStatus(
  status: StatusApi | null | undefined,
  valor: number
): StatusTipo {
  if (status && STATUS_POR_API[status]) {
    return STATUS_POR_API[status];
  }
  return calcularStatus(valor);
}

function paraData(iso: string | null | undefined): Date {
  if (!iso) {
    return new Date();
  }

  const data = new Date(iso);
  return isNaN(data.getTime()) ? new Date() : data;
}

export function paraSensor(dto: SensorApi): Sensor {
  return {
    id: dto.id,
    nome: dto.nome,
    tipo: dto.tipo,
    unidade: dto.unidade,
    local: dto.local ?? undefined,
  };
}

export function paraMedicao(dto: MedicaoApi): Medicao {
  const valor = dto.valor ?? 0;

  return {
    id: dto.id,
    sensor: {
      id: dto.sensorId,
      nome: dto.sensorNome ?? "Sensor sem nome",
      tipo: dto.sensorTipo ?? "—",
      unidade: dto.unidade ?? "",
      local: dto.sensorLocal ?? undefined,
    },
    valor,
    data: paraData(dto.data),
    status: paraStatus(dto.status, valor),
  };
}
