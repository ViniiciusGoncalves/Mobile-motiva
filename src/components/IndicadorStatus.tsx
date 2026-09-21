// src/components/IndicadorStatus.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { StatusTipo } from "../types";
import { CORES, STATUS_CONFIG } from "../theme/cores";

type Props = {
  status: StatusTipo;
  /** Texto opcional exibido à direita (ex.: hora da leitura) */
  detalhe?: string;
};

/**
 * Selo de status com pulso contínuo: a bolinha "respira" para indicar
 * que o monitoramento está ativo.
 */
export default function IndicadorStatus({ status, detalhe }: Props) {
  const pulso = useRef(new Animated.Value(1)).current;
  const cfg = STATUS_CONFIG[status];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, {
          toValue: 1.25,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulso, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulso]);

  return (
    <View style={styles.linha}>
      <Animated.View
        style={[
          styles.bolinha,
          { backgroundColor: cfg.cor, transform: [{ scale: pulso }] },
        ]}
      />
      <Text style={[styles.texto, { color: cfg.cor }]}>{cfg.label}</Text>
      {detalhe ? <Text style={styles.detalhe}>{detalhe}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  texto: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    flex: 1,
  },
  detalhe: {
    fontSize: 12,
    color: CORES.textoSecundario,
    fontWeight: "600",
  },
});
