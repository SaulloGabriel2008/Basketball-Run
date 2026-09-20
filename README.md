# Basketball Run — Simulador de Carreira de Basquetebol

Um simulador web de alta performance e fidelidade estatística para gestão de carreira de basquete (percurso completo: **NCAA → NBA G-League → NBA → Hall da Fama**), combinando o dinamismo e eventos narrativos do *Copero Carrera* com a densidade analítica, tipografia tabular e mutabilidade cromática contextual do *F1-Glory*.

---

## 🏀 Funcionalidades Principais

1. **Pirâmide Competitiva Oficial Completa**:
   - **NBA**: As 30 franquias oficiais mapeadas (conferências Leste e Oeste, 6 divisões, arenas reais e paletas cromáticas exatas).
   - **NBA G-League**: As 31 equipes oficiais, incluindo as 30 filiais diretas e o México City Capitanes (independente), atualizado com *Valley Suns*, *San Diego Clippers*, *Noblesville Boom* e *Rip City Remix*.
   - **NCAA Division I**: Mais de 30 programas das principais conferências (*ACC*, *Big Ten*, *Big 12*, *SEC*, *Big East* e *Mid-Majors*).
   - Consumo de logos oficiais via CDN pública da ESPN com gerador procedural vetorial em **SVG como fallback resiliente** automático.

2. **Motor Matemático Analítico por Posses de Bola (*Possession-Based Engine*)**:
   - Cálculo estocástico de ritmo de jogo (*Pace*) com distribuição normal:
     $$PACE_{game} = \frac{PACE_A + PACE_B}{2} + \epsilon_p, \quad \epsilon_p \sim \mathcal{N}(0, 2.5^2)$$
   - Resolução individual de posses baseada em minutos jogados e taxa de uso (*USG%*).
   - Decisões por arremessos (2PT, 3PT), faltas cavadas, lances livres, assistências, turnovers e rebotes confrontados contra o índice defensivo adversário.
   - Compilação em tempo real de métricas analíticas avançadas:
     - **True Shooting Percentage (TS%)**
     - **Effective Field Goal Percentage (eFG%)**
     - **Usage Rate (USG%)**
     - **Player Efficiency Rating (uPER)**
     - **Win Shares (OWS e DWS)**

3. **Curva Biológica de Envelhecimento e Maturação**:
   - Algoritmo contínuo que modela o ápice físico entre os 26 e 29 anos, declínio atlético acelerado pós-32 anos e crescimento dos atributos cognitivos/táticos até os 33 anos.

4. **Regras Contratuais Oficiais da NBA (CBA)**:
   - Contratos *Rookie Scale* de 1ª rodada no modelo 2+2 (2 anos garantidos + 2 opções de equipe).
   - Vínculos *Two-Way* limitados a 50 partidas na NBA com passagem pela G-League.
   - Mecânica de *Assignments* e *Call-ups* para jogadores com até 3 anos de experiência.
   - Sorteio da **Loteria do NBA Draft** com as 14 franquias e probabilidades matemáticas exatas das 4 primeiras escolhas e ordenamento 5 a 14.

5. **Consagração no Hall da Fama (Regressão Logística Oficial)**:
   - Ao se aposentar, a elegibilidade ao *Naismith Memorial Basketball Hall of Fame* é calculada rigorosamente pela fórmula de regressão logística do Basketball Reference:
     $$P(HoF) = \frac{1}{1 + \exp\Big(-\big(-0.20303 - 0.14203 \cdot Height + 0.80573 \cdot Championships + 0.01594 \cdot LeaderboardPts + 0.41568 \cdot PeakWS + 1.02443 \cdot AllStarSelections\big)\Big)}$$
   - Resultado $\ge 50.0\%$ garante consagração com cerimônia e memorial.

6. **Design System Dark Sports Dashboard & Dynamic Theming**:
   - Theming reativo injetado via CSS Variables no `:root` (`--team-primary`, `--team-secondary`, `--team-glow`) que adapta toda a paleta da interface às cores do time contratante.
   - Tipografia refinada: títulos condensados em caixa alta (*Barlow Condensed*) e fontes monoespaçadas com alinhamento tabular (*JetBrains Mono* com `tabular-nums`).

7. **Arquitetura de Alta Performance & Persistência Local**:
   - Persistência estruturada completa com **Dexie.js (IndexedDB)** sem restrições de 5MB do localStorage.
   - Execução assíncrona desacoplada da UI para estabilidade a 60 FPS.
   - Exportação e importação de saves completos em formato JSON.

---

## 🛠️ Stack Tecnológica

- **Frontend**: React 18+, TypeScript (modo estrito), Vite
- **Estilização**: Tailwind CSS, CSS Custom Properties (Theming Dinâmico)
- **Gerenciamento de Estado**: Zustand
- **Persistência**: Dexie.js (IndexedDB)
- **Ícones**: Lucide React
- **Testes & Benchmarks**: Vitest

---

## 🚀 Instalação e Execução Local

1. Clone o repositório:
```bash
git clone https://github.com/SaulloGabriel2008/Basketball-Run.git
cd Basketball-Run
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse a aplicação no seu navegador em `http://localhost:5173`.

---

## 🧪 Testes e Validação Estatística

Para executar toda a suíte de testes unitários automatizados cobrindo as 5 etapas da arquitetura:
```bash
npm run test
```

Para executar o teste de estresse e balanceamento contínuo de **100 temporadas completas da NBA (8.200 jogos simulados)**:
```bash
npm run benchmark
```

Para compilar o pacote de produção:
```bash
npm run build
```

---

## 🌐 Deploy em Produção

A aplicação é uma SPA estática otimizada e pode ser implantada diretamente em:
- **Vercel**: Configuração pré-definida em `vercel.json`
- **Netlify**: Configuração pré-definida em `netlify.toml`
- **Cloudflare Pages**: Conecte ao repositório GitHub com build command `npm run build` e diretório de saída `dist`.
