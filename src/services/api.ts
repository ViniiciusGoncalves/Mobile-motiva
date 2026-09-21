// src/services/api.ts
// Camada de serviços: é o ÚNICO lugar do app que monta URL e dispara HTTP.
// As telas importam estas funções e recebem tipos de domínio já prontos.

import { Platform } from "react-native";

import { ErroApi, MedicaoApi, SensorApi } from "../interfaces";
import { Medicao, Sensor } from "../types";
import { paraMedicao, paraSensor } from "./mapeadores";

// ─── Endereço do backend ────────────────────────────────────────────────────
// O celular/emulador não enxerga "localhost" da mesma forma que o navegador:
//   • web e iOS (simulador)  -> localhost
//   • emulador Android       -> 10.0.2.2 (alias do localhost da máquina)
//   • celular físico         -> IP da máquina na rede Wi-Fi (ex.: 192.168.0.10)
const PORTA = 8080;

const HOSTS = {
  padrao: "localhost",
  android: "10.0.2.2",
  dispositivoFisico: "192.168.0.10", // ajuste para o IP da sua máquina
};

// Mude para true ao rodar o app em um celular físico com o Expo Go
const EM_DISPOSITIVO_FISICO = false;

function resolverHost(): string {
  if (EM_DISPOSITIVO_FISICO) {
    return HOSTS.dispositivoFisico;
  }
  return Platform.OS === "android" ? HOSTS.android : HOSTS.padrao;
}

export const BASE_URL = `http://${resolverHost()}:${PORTA}`;

// Tempo máximo de espera antes de considerar o backend fora do ar
const TIMEOUT_MS = 8000;

// ─── Erro de API ────────────────────────────────────────────────────────────
export class ErroDeApi extends Error {
  readonly status?: number;

  constructor(mensagem: string, status?: number) {
    super(mensagem);
    this.name = "ErroDeApi";
    this.status = status;
  }
}

// ─── Requisição base ────────────────────────────────────────────────────────
async function requisicao<T>(caminho: string, init?: RequestInit): Promise<T> {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  try {
    const resposta = await fetch(`${BASE_URL}${caminho}`, {
      ...init,
      signal: controlador.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!resposta.ok) {
      throw new ErroDeApi(await extrairMensagem(resposta), resposta.status);
    }

    if (resposta.status === 204) {
      return undefined as T;
    }

    return (await resposta.json()) as T;
  } catch (erro) {
    if (erro instanceof ErroDeApi) {
      throw erro;
    }
    // Backend fora do ar, IP errado, Wi-Fi diferente ou timeout
    throw new ErroDeApi(
      `Não foi possível falar com a API em ${BASE_URL}. Confira se o backend está no ar.`
    );
  } finally {
    clearTimeout(timer);
  }
}

async function extrairMensagem(resposta: Response): Promise<string> {
  try {
    const corpo = (await resposta.json()) as Partial<ErroApi>;
    return corpo.mensagem ?? `A API respondeu ${resposta.status}.`;
  } catch {
    return `A API respondeu ${resposta.status}.`;
  }
}

// ─── Endpoints usados pelo app ──────────────────────────────────────────────

/** GET /sensores — catálogo de sensores instalados nas rodovias */
export async function listarSensores(): Promise<Sensor[]> {
  const dados = await requisicao<SensorApi[]>("/sensores");
  return dados.map(paraSensor);
}

/** GET /medicoes — histórico completo, mais recentes primeiro */
export async function listarMedicoes(): Promise<Medicao[]> {
  const dados = await requisicao<MedicaoApi[]>("/medicoes");
  return dados.map(paraMedicao);
}

/** GET /medicoes/sensor/{id} — histórico de um sensor específico */
export async function listarMedicoesDoSensor(
  sensorId: number
): Promise<Medicao[]> {
  const dados = await requisicao<MedicaoApi[]>(`/medicoes/sensor/${sensorId}`);
  return dados.map(paraMedicao);
}

/** POST /medicoes — registra uma leitura informando o valor */
export async function registrarMedicao(
  sensorId: number,
  valor: number
): Promise<Medicao> {
  const dado = await requisicao<MedicaoApi>("/medicoes", {
    method: "POST",
    body: JSON.stringify({ sensorId, valor }),
  });

  return paraMedicao(dado);
}

/**
 * POST /medicoes/simular[/{sensorId}] — pede ao backend que simule uma coleta.
 * O valor é sorteado no servidor a partir dos limites do sensor, e o status
 * já volta calculado.
 */
export async function simularMedicao(sensorId?: number): Promise<Medicao> {
  const caminho =
    sensorId !== undefined ? `/medicoes/simular/${sensorId}` : "/medicoes/simular";

  const dado = await requisicao<MedicaoApi>(caminho, { method: "POST" });
  return paraMedicao(dado);
}
