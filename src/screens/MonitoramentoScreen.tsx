// src/screens/MonitoramentoScreen.tsx
// Tela de monitoramento. Não monta URL nem chama fetch: só conversa com a
// camada de serviços (src/services/api.ts) e cuida dos estados da interface.

import React, { useCallback, useEffect, useState } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";

import BotaoAcao from "../components/BotaoAcao";
import Cabecalho from "../components/Cabecalho";
import CardMedicao from "../components/CardMedicao";
import EscalaStatus from "../components/EscalaStatus";
import EstadoMensagem from "../components/EstadoMensagem";
import FaixaErro from "../components/FaixaErro";
import HistoricoMedicoes from "../components/HistoricoMedicoes";
import { BASE_URL, ErroDeApi, listarMedicoes, simularMedicao } from "../services/api";
import { CORES } from "../theme/cores";
import { Medicao } from "../types";

const TAMANHO_HISTORICO = 4;

export default function MonitoramentoScreen() {
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [simulando, setSimulando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega o histórico vindo da API
  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      setMedicoes(await listarMedicoes());
    } catch (falha) {
      setErro(descreverErro(falha));
    } finally {
      setCarregando(false);
    }
  }, []);

  // Ao abrir o app: GET /medicoes
  useEffect(() => {
    carregar();
  }, [carregar]);

  // Botão: POST no backend e, em seguida, recarrega a lista da API
  async function simularColeta() {
    setSimulando(true);
    setErro(null);

    try {
      await simularMedicao();
      setMedicoes(await listarMedicoes());
    } catch (falha) {
      setErro(descreverErro(falha));
    } finally {
      setSimulando(false);
    }
  }

  const atual = medicoes[0];
  const historico = medicoes.slice(1, 1 + TAMANHO_HISTORICO);

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="light-content" backgroundColor={CORES.fundo} />

      <Cabecalho
        sistema="Motiva Perseverance"
        indicadorLabel="MEDIÇÕES"
        indicadorValor={medicoes.length}
      />

      <View style={styles.conteudo}>
        {carregando && medicoes.length === 0 ? (
          <EstadoMensagem
            tipo="carregando"
            titulo="CONSULTANDO A API"
            descricao={BASE_URL}
          />
        ) : erro && medicoes.length === 0 ? (
          <EstadoMensagem
            tipo="erro"
            titulo="BACKEND INDISPONÍVEL"
            descricao={erro}
            acao={{ titulo: "TENTAR NOVAMENTE", onPress: carregar }}
          />
        ) : !atual ? (
          <EstadoMensagem
            tipo="vazio"
            titulo="NENHUMA MEDIÇÃO REGISTRADA"
            descricao="Toque em SIMULAR COLETA para o backend gerar a primeira leitura."
          />
        ) : (
          <>
            <CardMedicao medicao={atual} />
            <EscalaStatus />
            <HistoricoMedicoes medicoes={historico} />
          </>
        )}
      </View>

      {erro && medicoes.length > 0 ? <FaixaErro mensagem={erro} /> : null}

      <BotaoAcao
        titulo="⟳  SIMULAR COLETA"
        onPress={simularColeta}
        carregando={simulando}
      />
    </SafeAreaView>
  );
}

/** Traduz a falha para uma frase exibível na interface. */
function descreverErro(falha: unknown): string {
  if (falha instanceof ErroDeApi) {
    return falha.message;
  }
  if (falha instanceof Error) {
    return falha.message;
  }
  return "Não foi possível concluir a operação.";
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 16,
  },
  conteudo: {
    flex: 1,
  },
});
