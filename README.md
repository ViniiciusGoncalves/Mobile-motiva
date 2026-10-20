# 📱 Motiva Perseverance — App Mobile

Aplicativo **React Native (Expo + TypeScript)** do sistema **Motiva Perseverance**,
que monitora a **vegetação nas faixas de domínio de rodovias**.

O app consome a API REST [`API-Motiva`](https://github.com/ViniiciusGoncalves/API-Motiva) (Spring Boot): lista as
medições reais registradas no backend, pede novas coletas simuladas e exibe o
status de cada leitura como **NORMAL**, **ALERTA** ou **CRÍTICO**.

---

## 🏁 Sprint 4 — Entrega Final

| Item | Link |
|------|------|
| 📱 Frontend (este repositório) | https://github.com/ViniiciusGoncalves/Mobile-motiva |
| 🖥️ Backend (API Spring Boot) | https://github.com/ViniiciusGoncalves/API-Motiva |
| 🎬 Vídeo de demonstração (YouTube, não listado) | https://youtu.be/XSIzXgMms2Q |

**Stack:** Spring Boot (Java 17) no backend + React Native / Expo / TypeScript no app.

### 👤 Equipe

| Nome | RM |
|------|----|
| Vinicius Gonçalves Carneiro | RM561784 |
| Henrique Augusto Cruz | RM564586 |
| Leonardo Martins Trevisan | RM563752 |
| Guilherme Gama Massela | RM563635 |
| Cristiano dos Santos | RM566444 |
| Leonardo Eiji Fabian Kowata | RM562934 |

**Turma:** 2EMR

---

## 🌿 O que o sistema monitora

Sensores instalados às margens das rodovias medem indicadores que denunciam o
crescimento excessivo da vegetação — risco de obstrução de placas, invasão de
pista e queda de árvores:

| Tipo          | O que mede                              | Unidade |
|---------------|------------------------------------------|---------|
| `vegetacao`   | Índice de vegetação (densidade e saúde)  | NDVI    |
| `umidade`     | Umidade do solo                          | %       |
| `crescimento` | Altura da vegetação na faixa de domínio  | cm      |

Cada sensor tem **limites mínimo e máximo**. O backend compara o valor lido com
esses limites e devolve o status já calculado.

---

## ▶️ Como rodar

O projeto só funciona com as **duas stacks no ar**: primeiro o backend, depois o app.

### 1. Backend (porta 8080)

Requer **Java 17**. O Maven não precisa estar instalado: o backend traz o Maven Wrapper.

```bash
git clone https://github.com/ViniiciusGoncalves/API-Motiva.git
cd API-Motiva
./mvnw spring-boot:run   # Windows cmd/PowerShell: mvnw.cmd spring-boot:run
```

Confira se a API respondeu antes de abrir o app:

```bash
curl http://localhost:8080/sensores
```

> ⚠️ Se a porta 8080 já estiver ocupada na sua máquina (Apache/XAMPP, por exemplo),
> pare o outro serviço — o app espera o backend em 8080.

### 2. App (Expo)

```bash
npm install
npx expo start
```

Depois escolha onde abrir: `w` (web), `a` (Android) ou o QR Code no Expo Go.

---

## 🔌 BASE_URL — para onde o app aponta

Celular e emulador **não enxergam `localhost` da mesma forma que o navegador**.
O endereço fica centralizado em [`src/services/api.ts`](src/services/api.ts):

| Onde o app roda                  | Host que deve ser usado          |
|----------------------------------|----------------------------------|
| Web e iOS (simulador)            | `http://localhost:8080`          |
| Emulador Android                 | `http://10.0.2.2:8080`           |
| Celular físico (Expo Go)         | `http://<IP-DA-SUA-MAQUINA>:8080` |

Web e Android são resolvidos automaticamente via `Platform.OS`. Para testar em
um **celular físico**, edite duas linhas em `src/services/api.ts`:

```ts
const HOSTS = {
  ...
  dispositivoFisico: "192.168.0.10", // troque pelo IP da sua máquina (ipconfig)
};

const EM_DISPOSITIVO_FISICO = true;  // mude para true
```

O celular precisa estar na **mesma rede Wi-Fi** da máquina que roda o backend.

---

## 🛰️ Endpoints consumidos pelo app

Todos concentrados em [`src/services/api.ts`](src/services/api.ts) — nenhuma tela
monta URL ou chama `fetch` diretamente.

| Função do serviço          | Método e rota                   | Para quê |
|----------------------------|---------------------------------|----------|
| `listarMedicoes()`         | `GET /medicoes`                 | Lista o histórico (mais recentes primeiro) ao abrir o app |
| `listarSensores()`         | `GET /sensores`                 | Catálogo de sensores instalados |
| `listarMedicoesDoSensor()` | `GET /medicoes/sensor/{id}`     | Histórico de um sensor específico |
| `simularMedicao()`         | `POST /medicoes/simular`        | Botão de simular coleta |
| `simularMedicao(sensorId)` | `POST /medicoes/simular/{id}`   | Simula a coleta em um sensor escolhido |
| `registrarMedicao()`       | `POST /medicoes`                | Registra uma leitura com valor informado |

---

## 🔘 O que o botão **SIMULAR COLETA** faz

1. Dispara `POST /medicoes/simular` no backend;
2. O **servidor** sorteia um sensor ativo, gera um valor a partir dos limites
   daquele sensor, calcula o status e **persiste** a medição no banco;
3. O app então refaz `GET /medicoes` e redesenha a tela com a lista atualizada.

Ou seja: nada é inventado no `useState`. A lista exibida é sempre a que veio da API.

---

## 🖥️ O que a tela mostra

Sempre com base no que a API devolveu:

- **sensor** (nome, tipo e localização na rodovia)
- **valor + unidade** da leitura
- **data/hora** da coleta
- **status** com cor e selo pulsante: 🟢 NORMAL, 🟡 ALERTA, 🔴 CRÍTICO
- **histórico** das 4 leituras anteriores
- **contador** de medições registradas

### Estados da interface

| Situação                        | O que aparece |
|---------------------------------|---------------|
| Carregando                      | Spinner + "CONSULTANDO A API" com a `BASE_URL` em uso |
| **Backend parado / fora do ar** | Bloco **"BACKEND INDISPONÍVEL"** em vermelho, com a mensagem `Não foi possível falar com a API em http://localhost:8080. Confira se o backend está no ar.` e o botão **TENTAR NOVAMENTE** |
| Falha depois de já ter dados    | Os dados continuam na tela e uma faixa vermelha explica o erro |
| API no ar, sem medições         | "NENHUMA MEDIÇÃO REGISTRADA — toque em SIMULAR COLETA" |
| Tudo certo                      | Card da leitura atual, escala de status e histórico |

O app nunca trava esperando: requisições têm **timeout de 8 segundos**.

---

## 🗂️ Estrutura do projeto

```
App.tsx                      # apenas monta a tela
src/
  components/                # peças visuais reutilizáveis
    BotaoAcao.tsx            # botão com estado de carregando
    Cabecalho.tsx            # título + contador de medições
    CardMedicao.tsx          # card da leitura atual (animação de entrada)
    EscalaStatus.tsx         # barra de referência NORMAL/ALERTA/CRÍTICO
    EstadoMensagem.tsx       # estados de carregando, vazio e erro
    FaixaErro.tsx            # aviso de erro quando já há dados na tela
    HistoricoMedicoes.tsx    # últimas leituras com badge colorido
    IndicadorStatus.tsx      # selo de status com pulso animado
  interfaces/
    index.ts                 # contratos do JSON da API (SensorApi, MedicaoApi)
  screens/
    MonitoramentoScreen.tsx  # tela: estados + composição dos componentes
  services/
    api.ts                   # BASE_URL, fetch, tratamento de erro e timeout
    mapeadores.ts            # JSON da API -> tipos de domínio
  theme/
    cores.ts                 # paleta e configuração visual de cada status
  types/
    index.ts                 # Sensor, Medicao, StatusTipo
  utils/
    logica.ts                # calcularStatus (plano B da Sprint 2)
```

### Tipos de domínio (`src/types/index.ts`)

```ts
export type StatusTipo = "normal" | "alerta" | "critico";

export type Sensor = {
  id: number;
  nome: string;
  tipo: string;
  unidade: string;
  local?: string;
};

export type Medicao = {
  id: number;
  sensor: Sensor;
  valor: number;
  data: Date;
  status: StatusTipo;
};
```

A API devolve a medição em **formato plano** (`sensorId`, `sensorNome`,
`sensorTipo`, `unidade`, …) e a data como **string ISO-8601**. Quem converte esse
JSON no tipo acima — com o `Sensor` aninhado e `data` como `Date` — é
[`src/services/mapeadores.ts`](src/services/mapeadores.ts). O `status` da API
(`NORMAL` / `ALERTA` / `CRITICO`) vira `StatusTipo`; se a resposta vier sem
status, entra o `calcularStatus` local como fallback.

---

## 🚦 Como o status é calculado

A regra principal fica **no backend** (`MedicaoService`), que conhece os limites
de cada sensor e aplica uma margem de alerta de 10% sobre a faixa segura:

```
faixa  = limiteMaximo - limiteMinimo
margem = faixa * 0.10

CRITICO → valor < limiteMinimo  OU  valor > limiteMaximo
ALERTA  → valor <= limiteMinimo + margem  OU  valor >= limiteMaximo - margem
NORMAL  → caso contrário
```

O app só exibe o status recebido. O `calcularStatus` de
[`src/utils/logica.ts`](src/utils/logica.ts) é um **plano B**, usado apenas se a
resposta vier sem o campo `status`.

---

## 🔌 O que acontece ao parar o backend

1. Com o app aberto, pare a API (`Ctrl+C` no terminal do backend).
2. Recarregue o app.
3. Aparece "CONSULTANDO A API" e, logo depois, o bloco vermelho **"BACKEND INDISPONÍVEL"**.
   Nenhuma lista é exibida: o app **não tem dados locais nem simulação no front**.
4. Suba o backend de novo e toque em **TENTAR NOVAMENTE**: as medições voltam.

---

## 🧰 Stack

- Expo SDK 55 · React Native 0.83 · React 19
- TypeScript em modo `strict`
- `fetch` nativo, sem dependências extras de HTTP
