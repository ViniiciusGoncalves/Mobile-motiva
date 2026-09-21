// src/components/HistoricoMedicoes.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Medicao } from "../types";
import { CORES, STATUS_CONFIG } from "../theme/cores";

type Props = {
  medicoes: Medicao[];
  titulo?: string;
};

/** Lista compacta das leituras mais recentes, com badge colorido de status. */
export default function HistoricoMedicoes({
  medicoes,
  titulo = "HISTÓRICO RECENTE",
}: Props) {
  if (medicoes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>

      {medicoes.map((medicao) => {
        const cfg = STATUS_CONFIG[medicao.status];

        return (
          <View key={medicao.id} style={styles.item}>
            <View style={[styles.bolinha, { backgroundColor: cfg.cor }]} />

            <Text style={styles.sensor} numberOfLines={1}>
              {medicao.sensor.nome}
            </Text>

            <Text style={styles.valor}>
              {medicao.valor.toFixed(1)} {medicao.sensor.unidade}
            </Text>

            <Text style={[styles.status, { color: cfg.cor }]}>
              {cfg.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 10,
    letterSpacing: 3,
    color: CORES.textoTerciario,
    fontWeight: "700",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    gap: 10,
  },
  bolinha: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sensor: {
    flex: 1,
    fontSize: 12,
    color: CORES.textoSecundario,
    fontWeight: "500",
  },
  valor: {
    fontSize: 13,
    color: CORES.texto,
    fontWeight: "700",
    marginRight: 8,
  },
  status: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    minWidth: 52,
    textAlign: "right",
  },
});
