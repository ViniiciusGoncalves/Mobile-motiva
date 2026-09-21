// src/components/FaixaErro.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { STATUS_CONFIG } from "../theme/cores";

type Props = {
  mensagem: string;
};

/** Aviso discreto usado quando já existem dados na tela, mas a última
 *  chamada à API falhou. */
export default function FaixaErro({ mensagem }: Props) {
  const cfg = STATUS_CONFIG.critico;

  return (
    <View
      style={[
        styles.faixa,
        { borderColor: cfg.corBorda, backgroundColor: cfg.corFundo },
      ]}
    >
      <Text style={[styles.texto, { color: cfg.cor }]} numberOfLines={3}>
        {mensagem}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  texto: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
});
