// src/utils/logica.ts
// Regra de classificação usada como PLANO B: a partir da Sprint 3 o status
// vem calculado pela API (que conhece os limites de cada sensor). Esta função
// só entra em ação se a resposta vier sem o campo `status`.

import { StatusTipo } from "../types";

export function calcularStatus(valor: number): StatusTipo {
  if (valor > 100) return "critico";
  if (valor > 80) return "alerta";
  return "normal";
}
