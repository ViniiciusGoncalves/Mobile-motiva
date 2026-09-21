// src/components/Cabecalho.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CORES } from "../theme/cores";

type Props = {
  sistema: string;
  indicadorLabel: string;
  indicadorValor: string | number;
};

export default function Cabecalho({
  sistema,
  indicadorLabel,
  indicadorValor,
}: Props) {
  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.rotulo}>SISTEMA</Text>
          <Text style={styles.sistemaNome}>{sistema}</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.rotulo}>{indicadorLabel}</Text>
          <Text style={styles.indicadorValor}>{indicadorValor}</Text>
        </View>
      </View>

      <View style={styles.divisor} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  headerRight: { alignItems: "flex-end" },
  rotulo: {
    fontSize: 10,
    letterSpacing: 3,
    color: CORES.textoTerciario,
    fontWeight: "700",
    marginBottom: 2,
  },
  sistemaNome: {
    fontSize: 20,
    fontWeight: "800",
    color: CORES.texto,
    letterSpacing: 0.5,
  },
  indicadorValor: {
    fontSize: 20,
    fontWeight: "800",
    color: CORES.texto,
  },
  divisor: {
    height: 1,
    backgroundColor: CORES.borda,
    marginBottom: 20,
  },
});
