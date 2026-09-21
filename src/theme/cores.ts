// src/theme/cores.ts
// Paleta e identidade visual do app, centralizadas em um único lugar
// para que nenhum componente precise repetir código hexadecimal.

import { StatusTipo } from "../types";

export const CORES = {
  fundo: "#0A0C10",
  superficie: "#161B27",
  borda: "#1C2130",
  bordaClara: "#2E3B50",
  texto: "#E8ECF4",
  textoSecundario: "#8892A4",
  textoTerciario: "#555C6E",
  textoApagado: "#2E3545",
};

export type StatusVisual = {
  label: string;
  cor: string;
  corFundo: string;
  corBorda: string;
};

export const STATUS_CONFIG: Record<StatusTipo, StatusVisual> = {
  normal: {
    label: "NORMAL",
    cor: "#00FF9C",
    corFundo: "#00FF9C18",
    corBorda: "#00FF9C55",
  },
  alerta: {
    label: "ALERTA",
    cor: "#FFD600",
    corFundo: "#FFD60018",
    corBorda: "#FFD60055",
  },
  critico: {
    label: "CRÍTICO",
    cor: "#FF3B3B",
    corFundo: "#FF3B3B18",
    corBorda: "#FF3B3B55",
  },
};

// Ordem usada na escala visual (do melhor para o pior cenário)
export const ORDEM_STATUS: StatusTipo[] = ["normal", "alerta", "critico"];
