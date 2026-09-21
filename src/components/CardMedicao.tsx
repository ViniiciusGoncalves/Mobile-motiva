// src/components/CardMedicao.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { Medicao } from "../types";
import { CORES, STATUS_CONFIG } from "../theme/cores";
import IndicadorStatus from "./IndicadorStatus";

type Props = {
  medicao: Medicao;
};

/**
 * Card principal da leitura atual. Anima a entrada (fade + slide) sempre
 * que a medição exibida muda.
 */
export default function CardMedicao({ medicao }: Props) {
  const cfg = STATUS_CONFIG[medicao.status];

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fade.setValue(0);
    slide.setValue(20);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [medicao.id, fade, slide]);

  const hora = medicao.data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: cfg.corBorda,
          backgroundColor: cfg.corFundo,
          opacity: fade,
          transform: [{ translateY: slide }],
        },
      ]}
    >
      <IndicadorStatus status={medicao.status} detalhe={hora} />

      <Text style={styles.rotulo}>SENSOR</Text>
      <Text style={styles.sensorNome}>{medicao.sensor.nome}</Text>
      <Text style={styles.sensorTipo}>
        Tipo: {medicao.sensor.tipo}
        {medicao.sensor.local ? `  •  ${medicao.sensor.local}` : ""}
      </Text>

      <Text style={styles.rotulo}>LEITURA ATUAL</Text>
      <View style={styles.valorContainer}>
        <Text style={[styles.valorNumero, { color: cfg.cor }]}>
          {medicao.valor.toFixed(2)}
          <Text style={styles.unidade}> {medicao.sensor.unidade}</Text>
        </Text>
      </View>

      <Text style={styles.identificadores}>
        MED #{medicao.id.toString().padStart(4, "0")}  |  SENS #
        {medicao.sensor.id}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 10,
    letterSpacing: 3,
    color: CORES.textoTerciario,
    fontWeight: "700",
    marginBottom: 4,
  },
  sensorNome: {
    fontSize: 18,
    fontWeight: "700",
    color: CORES.texto,
    marginBottom: 4,
  },
  sensorTipo: {
    fontSize: 13,
    color: CORES.textoSecundario,
    fontWeight: "500",
    marginBottom: 20,
  },
  valorContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "baseline",
  },
  valorNumero: {
    fontSize: 52,
    fontWeight: "800",
    letterSpacing: -1,
  },
  unidade: {
    fontSize: 24,
    fontWeight: "600",
    color: CORES.textoSecundario,
  },
  identificadores: {
    fontSize: 11,
    color: CORES.textoApagado,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
