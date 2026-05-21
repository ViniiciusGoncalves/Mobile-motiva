import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";

// ─── Tipagem ────────────────────────────────────────────────────────────────
type StatusTipo = "normal" | "alerta" | "critico";

type Medicao = {
  id: number;
  sensor: string;
  valor: number;
  status: StatusTipo;
};

// ─── Constantes ─────────────────────────────────────────────────────────────
const SENSORES = [
  "Temperatura (°C)",
  "Pressão (bar)",
  "Umidade (%)",
  "Vibração (Hz)",
  "Tensão (V)",
];

const STATUS_CONFIG: Record<
  StatusTipo,
  { label: string; cor: string; corFundo: string; corBorda: string }
> = {
  normal: {
    label: "NORMAL",
    cor: "#00FF9C",
    corFundo: "#00FF9C18",
    corBorda: "#00FF9C55",
  },
  alerta: {
    label: "ALERTA",
    cor: "#FFD600",
    corFundo: "#FFD60018",
    corBorda: "#FFD60055",
  },
  critico: {
    label: "CRÍTICO",
    cor: "#FF3B3B",
    corFundo: "#FF3B3B18",
    corBorda: "#FF3B3B55",
  },
};

// ─── Gerador de medição aleatória ────────────────────────────────────────────
let contadorId = 1;

function gerarMedicao(): Medicao {
  const sensor = SENSORES[Math.floor(Math.random() * SENSORES.length)];
  const valor = parseFloat((Math.random() * 100).toFixed(2));
  let status: StatusTipo;

  if (valor < 40) status = "normal";
  else if (valor < 75) status = "alerta";
  else status = "critico";

  return { id: contadorId++, sensor, valor, status };
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function App() {
  const [medicao, setMedicao] = useState<Medicao>(gerarMedicao());
  const [historico, setHistorico] = useState<Medicao[]>([]);
  const [leituras, setLeituras] = useState(0);

  // Animações
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Pulso contínuo no indicador de status
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Animação ao trocar medição
  function animarTroca(novaMedicao: Medicao) {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMedicao(novaMedicao);
      setHistorico((h) => [novaMedicao, ...h].slice(0, 4));
      setLeituras((l) => l + 1);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function novaLeitura() {
    animarTroca(gerarMedicao());
  }

  const cfg = STATUS_CONFIG[medicao.status];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0C10" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sistemaLabel}>SISTEMA</Text>
          <Text style={styles.sistemaNome}>Motiva Perseverance</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.leituraLabel}>LEITURAS</Text>
          <Text style={styles.leituraValor}>{leituras}</Text>
        </View>
      </View>

      {/* ── Linha divisória ── */}
      <View style={styles.divisor} />

      {/* ── Card principal ── */}
      <Animated.View
        style={[
          styles.card,
          {
            borderColor: cfg.corBorda,
            backgroundColor: cfg.corFundo,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Indicador de status piscante */}
        <View style={styles.statusRow}>
          <Animated.View
            style={[
              styles.bolinha,
              { backgroundColor: cfg.cor, transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Text style={[styles.statusTexto, { color: cfg.cor }]}>
            {cfg.label}
          </Text>
        </View>

        {/* Nome do sensor */}
        <Text style={styles.sensorLabel}>SENSOR</Text>
        <Text style={styles.sensorNome}>{medicao.sensor}</Text>

        {/* Valor */}
        <Text style={styles.valorLabel}>LEITURA ATUAL</Text>
        <View style={styles.valorContainer}>
          <Text style={[styles.valorNumero, { color: cfg.cor }]}>
            {medicao.valor.toFixed(2)}
          </Text>
        </View>

        {/* ID */}
        <Text style={styles.idTexto}>ID #{medicao.id.toString().padStart(4, "0")}</Text>
      </Animated.View>

      {/* ── Barra de status visual ── */}
      <View style={styles.barraContainer}>
        <View style={[styles.barraSegmento, { backgroundColor: "#00FF9C" }]} />
        <View style={[styles.barraSegmento, { backgroundColor: "#FFD600" }]} />
        <View style={[styles.barraSegmento, { backgroundColor: "#FF3B3B" }]} />
      </View>
      <View style={styles.barraLabels}>
        <Text style={[styles.barraLabel, { color: "#00FF9C" }]}>NORMAL</Text>
        <Text style={[styles.barraLabel, { color: "#FFD600" }]}>ALERTA</Text>
        <Text style={[styles.barraLabel, { color: "#FF3B3B" }]}>CRÍTICO</Text>
      </View>

      {/* ── Histórico ── */}
      {historico.length > 0 && (
        <View style={styles.historicoContainer}>
          <Text style={styles.historicoTitulo}>HISTÓRICO RECENTE</Text>
          {historico.map((m) => (
            <View key={m.id} style={styles.historicoItem}>
              <View
                style={[
                  styles.historicoBoinha,
                  { backgroundColor: STATUS_CONFIG[m.status].cor },
                ]}
              />
              <Text style={styles.historicoSensor} numberOfLines={1}>
                {m.sensor}
              </Text>
              <Text style={styles.historicoValor}>{m.valor.toFixed(2)}</Text>
              <Text
                style={[
                  styles.historicoStatus,
                  { color: STATUS_CONFIG[m.status].cor },
                ]}
              >
                {STATUS_CONFIG[m.status].label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Botão ── */}
      <TouchableOpacity
        style={styles.botao}
        onPress={novaLeitura}
        activeOpacity={0.75}
      >
        <Text style={styles.botaoTexto}>⟳  NOVA LEITURA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0A0C10",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 16,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  headerLeft: {},
  headerRight: { alignItems: "flex-end" },
  sistemaLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#555C6E",
    fontWeight: "700",
    marginBottom: 2,
  },
  sistemaNome: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E8ECF4",
    letterSpacing: 0.5,
  },
  leituraLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#555C6E",
    fontWeight: "700",
    marginBottom: 2,
  },
  leituraValor: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E8ECF4",
  },

  divisor: {
    height: 1,
    backgroundColor: "#1C2130",
    marginBottom: 20,
  },

  // Card principal
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  statusRow: {
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
  statusTexto: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
  },
  sensorLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#555C6E",
    fontWeight: "700",
    marginBottom: 4,
  },
  sensorNome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E8ECF4",
    marginBottom: 20,
  },
  valorLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#555C6E",
    fontWeight: "700",
    marginBottom: 4,
  },
  valorContainer: {
    marginBottom: 16,
  },
  valorNumero: {
    fontSize: 52,
    fontWeight: "800",
    letterSpacing: -1,
  },
  idTexto: {
    fontSize: 11,
    color: "#2E3545",
    fontWeight: "700",
    letterSpacing: 2,
  },

  // Barra de status
  barraContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  barraSegmento: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  barraLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  barraLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    flex: 1,
    textAlign: "center",
  },

  // Histórico
  historicoContainer: {
    marginBottom: 20,
  },
  historicoTitulo: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#555C6E",
    fontWeight: "700",
    marginBottom: 10,
  },
  historicoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1C2130",
    gap: 10,
  },
  historicoBoinha: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  historicoSensor: {
    flex: 1,
    fontSize: 12,
    color: "#8892A4",
    fontWeight: "500",
  },
  historicoValor: {
    fontSize: 13,
    color: "#E8ECF4",
    fontWeight: "700",
    marginRight: 8,
  },
  historicoStatus: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    minWidth: 52,
    textAlign: "right",
  },

  // Botão
  botao: {
    backgroundColor: "#161B27",
    borderWidth: 1,
    borderColor: "#2E3B50",
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 8,
  },
  botaoTexto: {
    color: "#E8ECF4",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
  },
});
