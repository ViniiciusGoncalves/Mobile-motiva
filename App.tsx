// App.tsx
// Ponto de entrada: apenas monta a tela de monitoramento.
// Toda a interface vive em src/screens e src/components.
import React from "react";

import MonitoramentoScreen from "./src/screens/MonitoramentoScreen";

export default function App() {
  return <MonitoramentoScreen />;
}
