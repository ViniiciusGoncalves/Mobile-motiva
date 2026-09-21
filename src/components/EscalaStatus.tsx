// src/components/EscalaStatus.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ORDEM_STATUS, STATUS_CONFIG } from "../theme/cores";

/**
 * Barra de referência dos três níveis de status, para o usuário
 * entender onde a leitura atual se encaixa.
 */
export default function EscalaStatus() {
  return (
    <>
      <View style={styles.barra}>
        {ORDEM_STATUS.map((status) => (
          <View
            key={status}
            style={[
              styles.segmento,
              { backgroundColor: STATUS_CONFIG[status].cor },
            ]}
          />
        ))}
      </View>

      <View style={styles.legendas}>
        {ORDEM_STATUS.map((status) => (
          <Text
            key={status}
            style={[styles.legenda, { color: STATUS_CONFIG[status].cor }]}
          >
            {STATUS_CONFIG[status].label}
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  segmento: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  legendas: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  legenda: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    flex: 1,
    textAlign: "center",
  },
});
