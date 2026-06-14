import { Sensor, Medicao, StatusTipo } from "../types";

export function calcularStatus(valor: number): StatusTipo {
  if (valor > 100) return "critico";
  if (valor > 80) return "alerta";
  return "normal";
}

// Catálogo simulado de múltiplos sensores
const SENSORES: Sensor[] = [
  { id: 1, nome: "Motor Principal", tipo: "Temperatura", unidade: "°C" },
  { id: 2, nome: "Válvula de Entrada", tipo: "Pressão", unidade: "bar" },
  { id: 3, nome: "Câmara Interna", tipo: "Umidade", unidade: "%" },
  { id: 4, nome: "Eixo Frontal", tipo: "Vibração", unidade: "Hz" },
  { id: 5, nome: "Bateria Auxiliar", tipo: "Tensão", unidade: "V" },
];

let contadorId = 1;

export function gerarMedicao(): Medicao {
  const sensor = SENSORES[Math.floor(Math.random() * SENSORES.length)];
  const valor = parseFloat((Math.random() * 120).toFixed(2)); 
  const status = calcularStatus(valor);

  return { 
    id: contadorId++, 
    sensor, 
    valor, 
    data: new Date(), 
    status 
  };
}