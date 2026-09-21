// src/components/EstadoMensagem.tsx
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CORES, STATUS_CONFIG } from "../theme/cores";

type Props = {
  tipo: "carregando" | "vazio" | "erro";
  titulo: string;
  descricao?: string;
  acao?: { titulo: string; onPress: () => void };
};

/** Bloco central usado nos estados de carregando, lista vazia e erro. */
export default function EstadoMensagem({
  tipo,
  titulo,
  descricao,
  acao,
}: Props) {
  const corTitulo = tipo === "erro" ? STATUS_CONFIG.critico.cor : CORES.texto;

  return (
    <View style={styles.container}>
      {tipo === "carregando" && (
        <ActivityIndicator
          size="large"
          color={CORES.textoSecundario}
          style={styles.spinner}
        />
      )}

      <Text style={[styles.titulo, { color: corTitulo }]}>{titulo}</Text>

      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}

      {acao ? (
        <TouchableOpacity
          style={styles.acao}
          onPress={acao.onPress}
          activeOpacity={0.75}
        >
          <Text style={styles.acaoTexto}>{acao.titulo}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  spinner: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 13,
    color: CORES.textoSecundario,
    textAlign: "center",
    lineHeight: 20,
  },
  acao: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  acaoTexto: {
    color: CORES.texto,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
