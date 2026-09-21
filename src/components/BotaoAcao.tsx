// src/components/BotaoAcao.tsx
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { CORES } from "../theme/cores";

type Props = {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  desabilitado?: boolean;
};

export default function BotaoAcao({
  titulo,
  onPress,
  carregando = false,
  desabilitado = false,
}: Props) {
  const inativo = desabilitado || carregando;

  return (
    <TouchableOpacity
      style={[styles.botao, inativo && styles.botaoInativo]}
      onPress={onPress}
      disabled={inativo}
      activeOpacity={0.75}
    >
      {carregando ? (
        <ActivityIndicator color={CORES.texto} />
      ) : (
        <Text style={styles.texto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
    marginTop: "auto",
    marginBottom: 8,
  },
  botaoInativo: {
    opacity: 0.55,
  },
  texto: {
    color: CORES.texto,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
  },
});
