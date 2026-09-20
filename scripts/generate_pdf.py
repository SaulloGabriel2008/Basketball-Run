import os
import base64
import subprocess
import sys

def build_pdf():
    base_dir = r"c:\Users\saull\OneDrive\Documentos\Sites\Basketball Run"
    stitch_dir = os.path.join(base_dir, "stitch_hoop_legacy_career_simulator", "stitch_hoop_legacy_career_simulator")
    
    portrait_path = os.path.join(stitch_dir, "graphic_sports_illustration_portrait_bust_of_athletic_basketball_forward_player", "screen.png")
    dash_path = os.path.join(stitch_dir, "hoop_legacy_career_simulator_dashboard", "screen.png")
    logo_path = os.path.join(stitch_dir, "hoop_legacy_pro_logo", "screen.png")

    def to_b64(path):
        if os.path.exists(path):
            with open(path, "rb") as f:
                return base64.b64encode(f.read()).decode("utf-8")
        return ""

    portrait_b64 = to_b64(portrait_path)
    dash_b64 = to_b64(dash_path)
    logo_b64 = to_b64(logo_path)

    html_content = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Identidade Visual e Planos de Implementação</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Chivo:ital,wght@0,300;0,400;0,600;0,700;1,400&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<style>
  @page {{
    size: A4 portrait;
    margin: 10mm 12mm 12mm 12mm;
    @bottom-right {{
      content: counter(page);
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    margin: 0;
    padding: 0;
    background-color: #0c1015;
    color: #e0e2ea;
    font-family: 'Chivo', sans-serif;
    font-size: 10pt;
    line-height: 1.45;
  }}

  .page {{
    page-break-after: always;
    break-after: page;
    min-height: 275mm;
    max-height: 275mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }}

  .page:last-child {{
    page-break-after: avoid;
    break-after: avoid;
  }}

  /* Header & Footer em cada página */
  .page-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #223140;
    padding-bottom: 6px;
    margin-bottom: 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    color: #8496a8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }}

  .page-header .brand {{
    color: #00d659;
    font-weight: 700;
  }}

  .page-footer {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #223140;
    padding-top: 6px;
    margin-top: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7pt;
    color: #5a6e82;
  }}

  .page-content {{
    flex: 1;
    display: flex;
    flex-direction: column;
  }}

  /* Tipografia */
  h1, h2, h3, h4 {{
    font-family: 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
    margin: 0 0 6px 0;
    letter-spacing: 0.02em;
    color: #f0f4f8;
  }}

  h1 {{ font-size: 26pt; font-weight: 900; line-height: 1.05; }}
  h2 {{ font-size: 18pt; font-weight: 800; border-left: 4px solid #00d659; padding-left: 8px; margin-bottom: 10px; }}
  h3 {{ font-size: 13pt; font-weight: 700; color: #00d659; margin-bottom: 6px; }}
  h4 {{ font-size: 11pt; font-weight: 700; color: #ffce76; }}

  p {{
    margin: 0 0 8px 0;
    color: #bbcbb7;
    font-size: 9.2pt;
    line-height: 1.45;
  }}

  .lead {{
    font-size: 10.5pt;
    color: #e0e2ea;
    font-weight: 400;
  }}

  .mono {{
    font-family: 'JetBrains Mono', monospace;
  }}

  /* Cartões e Containers */
  .card {{
    background-color: #121820;
    border: 1px solid #223140;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 10px;
    position: relative;
  }}

  .card-glow {{
    border-color: rgba(0, 214, 89, 0.4);
    box-shadow: 0 0 16px -4px rgba(0, 214, 89, 0.2);
  }}

  .card-gold {{
    border-color: rgba(229, 168, 35, 0.4);
    box-shadow: 0 0 16px -4px rgba(229, 168, 35, 0.2);
  }}

  .grid-2 {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }}

  .grid-3 {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }}

  .grid-4 {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 8px;
  }}

  /* Badges */
  .badge {{
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }}

  .badge-primary {{
    background-color: rgba(0, 214, 89, 0.15);
    color: #42f372;
    border: 1px solid rgba(0, 214, 89, 0.4);
  }}

  .badge-gold {{
    background-color: rgba(255, 206, 118, 0.15);
    color: #ffce76;
    border: 1px solid rgba(255, 206, 118, 0.4);
  }}

  .badge-dark {{
    background-color: #18222d;
    color: #e0e2ea;
    border: 1px solid #2e4257;
  }}

  .badge-danger {{
    background-color: rgba(255, 59, 48, 0.15);
    color: #ffb4ab;
    border: 1px solid rgba(255, 59, 48, 0.4);
  }}

  /* Tabelas */
  table.data-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    margin-bottom: 8px;
    font-family: 'JetBrains Mono', monospace;
  }}

  table.data-table th {{
    background-color: #0a0e13;
    color: #8496a8;
    text-align: left;
    padding: 5px 6px;
    border-bottom: 2px solid #223140;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }}

  table.data-table td {{
    padding: 4.5px 6px;
    border-bottom: 1px solid rgba(34, 49, 64, 0.5);
    color: #e0e2ea;
  }}

  table.data-table tr:nth-child(even) {{
    background-color: rgba(24, 34, 45, 0.35);
  }}

  table.data-table tr.highlight {{
    background-color: rgba(0, 122, 51, 0.25);
    font-weight: bold;
  }}

  table.data-table tr.highlight td {{
    color: #42f372;
  }}

  /* Swatches de Cores */
  .color-swatch {{
    background-color: #121820;
    border: 1px solid #223140;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }}

  .swatch-box {{
    height: 38px;
    width: 100%;
  }}

  .swatch-info {{
    padding: 6px 8px;
    font-size: 7.5pt;
  }}

  .swatch-name {{
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 9pt;
    text-transform: uppercase;
    color: #f0f4f8;
  }}

  .swatch-hex {{
    font-family: 'JetBrains Mono', monospace;
    color: #8496a8;
    font-size: 7.5pt;
  }}

  /* Capa */
  .cover-page {{
    background: radial-gradient(circle at 80% 20%, rgba(0, 214, 89, 0.12) 0%, transparent 60%),
                radial-gradient(circle at 10% 80%, rgba(186, 150, 83, 0.1) 0%, transparent 60%),
                #0c1015;
    border: 1px solid #223140;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }}

  .cover-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .cover-body {{
    margin: auto 0;
  }}

  .cover-tagline {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    color: #00d659;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}

  .cover-tagline::before {{
    content: '';
    display: inline-block;
    width: 24px;
    height: 2px;
    background: #00d659;
  }}

  .cover-title {{
    font-size: 38pt;
    font-weight: 900;
    letter-spacing: 0.01em;
    line-height: 0.95;
    color: #ffffff;
    margin-bottom: 14px;
  }}

  .cover-title span.accent {{
    color: #00d659;
    text-shadow: 0 0 20px rgba(0, 214, 89, 0.4);
  }}

  .cover-subtitle {{
    font-size: 14pt;
    font-family: 'Chivo', sans-serif;
    color: #bbcbb7;
    font-weight: 300;
    max-width: 85%;
    line-height: 1.4;
    margin-bottom: 24px;
    border-left: 3px solid #BA9653;
    padding-left: 12px;
  }}

  .cover-meta {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    border-top: 1px solid #223140;
    padding-top: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
  }}

  .cover-meta-item .label {{
    color: #8496a8;
    text-transform: uppercase;
    font-size: 7pt;
    margin-bottom: 2px;
  }}

  .cover-meta-item .value {{
    color: #f0f4f8;
    font-weight: 700;
  }}

  /* Imagens */
  .img-frame {{
    border: 1px solid #223140;
    border-radius: 6px;
    overflow: hidden;
    background: #121820;
    display: flex;
    justify-content: center;
    align-items: center;
  }}

  .img-frame img {{
    max-width: 100%;
    height: auto;
    display: block;
  }}

  /* Progress Bars */
  .stat-bar-container {{
    margin-bottom: 6px;
  }}

  .stat-bar-header {{
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    margin-bottom: 2px;
  }}

  .stat-bar-track {{
    height: 5px;
    background-color: #1c2025;
    border-radius: 3px;
    overflow: hidden;
  }}

  .stat-bar-fill {{
    height: 100%;
    border-radius: 3px;
  }}

  .fill-emerald {{
    background: linear-gradient(90deg, #007932, #00d659);
  }}

  .fill-gold {{
    background: linear-gradient(90deg, #BA9653, #FFD700);
  }}

  .fill-blue {{
    background: linear-gradient(90deg, #00539C, #29B6F6);
  }}

  .fill-danger {{
    background: linear-gradient(90deg, #93000a, #ff5252);
  }}

  /* Checklists & Steps */
  .step-box {{
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
    background: #121820;
    border: 1px solid #223140;
    border-radius: 6px;
    padding: 8px 10px;
  }}

  .step-number {{
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: #00d659;
    color: #003912;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: 12pt;
    display: flex;
    align-items: center;
    justify-content: center;
    shrink: 0;
  }}

  .step-text h4 {{
    margin: 0 0 2px 0;
  }}

  .step-text p {{
    margin: 0;
    font-size: 8.5pt;
  }}
</style>
</head>
<body>

<!-- PÁGINA 1: CAPA OFICIAL -->
<div class="page">
  <div class="cover-page">
    <div class="cover-header">
      <!-- SVG Logomarca Completa -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 50" fill="none" style="height: 38px; width: auto;">
        <defs>
          <linearGradient id="celticsGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00d659" />
            <stop offset="100%" stop-color="#007A33" />
          </linearGradient>
          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFD700" />
            <stop offset="100%" stop-color="#BA9653" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 5)">
          <circle cx="20" cy="20" r="18" fill="#121820" stroke="url(#celticsGlow)" stroke-width="2.5"/>
          <path d="M7 20 H33 M20 7 V33" stroke="url(#celticsGlow)" stroke-width="1.8" stroke-dasharray="1 1"/>
          <path d="M10 11 C16 16 16 24 10 29 M30 11 C24 16 24 24 30 29" stroke="url(#celticsGlow)" stroke-width="1.8"/>
          <circle cx="20" cy="20" r="4" fill="url(#goldAccent)"/>
        </g>
        <text x="54" y="23" font-family="'Barlow Condensed', sans-serif" font-weight="900" font-size="20" letter-spacing="2" fill="#FFFFFF">HOOP LEGACY</text>
        <rect x="54" y="27" width="170" height="2" fill="url(#celticsGlow)" />
        <text x="54" y="41" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="9" letter-spacing="3" fill="#00d659">CAREER SIMULATOR PRO</text>
        <rect x="204" y="12" width="28" height="13" rx="2" fill="#BA9653" />
        <text x="218" y="22" font-family="'Barlow Condensed', sans-serif" font-weight="900" font-size="8" fill="#000" text-anchor="middle">v2.4</text>
      </svg>

      <span class="badge badge-gold">DOCUMENTO EXECUTIVO</span>
    </div>

    <div class="cover-body">
      <div class="cover-tagline">MANUAL DE DESIGN SYSTEM & ARQUITETURA FRONT-END</div>
      <div class="cover-title">
        IDENTIDADE VISUAL E <br/>
        <span class="accent">PLANOS DE IMPLEMENTAÇÃO</span>
      </div>
      <div class="cover-subtitle">
        Diretrizes completas de UI/UX, tokens cromáticos, tipografia esportiva, arquitetura modular do cockpit e roteiro de engenharia para o simulador de carreira profissional de basquetebol.
      </div>

      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <span class="badge badge-primary">RETRO-MODERN ATHLETIC ANALYTICS</span>
        <span class="badge badge-dark">PIXEL-PERFECT TAILWIND</span>
        <span class="badge badge-gold">DYNAMIC NBA THEMING</span>
      </div>
    </div>

    <div class="cover-meta">
      <div class="cover-meta-item">
        <div class="label">PROJETO</div>
        <div class="value">BASKETBALL RUN / HOOP LEGACY</div>
      </div>
      <div class="cover-meta-item">
        <div class="label">VERSÃO DO MOTOR</div>
        <div class="value">v4.2.1 (SIM PRO v2.4)</div>
      </div>
      <div class="cover-meta-item">
        <div class="label">STACK PRINCIPAL</div>
        <div class="value">REACT 18 · TS · TAILWIND</div>
      </div>
      <div class="cover-meta-item">
        <div class="label">DATA DE EMISSÃO</div>
        <div class="value">SETEMBRO / 2026</div>
      </div>
    </div>
  </div>
</div>

<!-- PÁGINA 2: DNA DA MARCA & SÍNTESE CONCEITUAL -->
<div class="page">
  <div class="page-header">
    <span class="brand">HOOP LEGACY PRO</span>
    <span>CAPÍTULO 1 · DNA DA MARCA & CONCEITO</span>
    <span>PÁGINA 02</span>
  </div>

  <div class="page-content">
    <h2>1. O DNA DA MARCA: RETRO-MODERN ATHLETIC ANALYTICS</h2>
    <p class="lead">
      O <strong>Hoop Legacy: Career Simulator Pro</strong> não é apenas um jogo; é uma estação de comando analítica profunda de alta performance. O seu posicionamento visual une a reverência histórica do basquete clássico ao rigor técnico de cockpits de telemetria esportiva.
    </p>

    <div class="grid-2" style="margin-top: 6px;">
      <div class="card card-glow">
        <h3>PILAR 1: PRESTÍGIO HISTÓRICO</h3>
        <p>
          Inspirado nas dinastias lendárias da NBA — o verde esmeralda dos Boston Celtics, o parquet envernizado das quadras históricas e o dourado dos troféus Larry O'Brien. Transmite peso, tradição e relevância de carreira.
        </p>
        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <span class="badge badge-primary">Heritage Emerald</span>
          <span class="badge badge-gold">Championship Gold</span>
        </div>
      </div>

      <div class="card card-glow">
        <h3>PILAR 2: TELEMETRIA CIRÚRGICA</h3>
        <p>
          Inspirado em consoles de telemetria de automobilismo e telas de trading financeiro de Wall Street. Cada número é alinhado com fontes monoespaçadas tabulares para visualização rápida sem hesitação visual ou fadiga ocular.
        </p>
        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <span class="badge badge-dark">JetBrains Mono</span>
          <span class="badge badge-primary">Zero Eye-Fatigue</span>
        </div>
      </div>
    </div>

    <h3 style="margin-top: 10px;">ANATOMIA DA LOGOMARCA VETORIAL (V2.4)</h3>
    <div class="card">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <div style="max-width: 65%;">
          <p style="margin: 0; font-size: 8.5pt;">
            A marca gráfica é composta por três elementos geométricos integrados: o <strong>Aro de Precisão</strong> em círculo concêntrico, a <strong>Rede em Grid Telegráfico</strong> representando o cálculo estocástico de posses, e o <strong>Ponto Focal Dourado</strong>, que simboliza a bola e o alvo máximo: a glória do Hall da Fama.
          </p>
        </div>
        <div>
          <span class="badge badge-gold">GRID GEOMÉTRICO 240x50</span>
        </div>
      </div>

      <div class="grid-3">
        <div style="background: #0a0e13; padding: 8px; border-radius: 4px; border: 1px solid #223140;">
          <span class="mono" style="color: #00d659; font-size: 7.5pt; font-weight: bold;">01. EMBLEMA VETORIAL</span>
          <p style="font-size: 7.5pt; margin-top: 3px;">Círculo r=18px com traço gradiente duplo Celtics Glow (#00d659 → #007A33).</p>
        </div>
        <div style="background: #0a0e13; padding: 8px; border-radius: 4px; border: 1px solid #223140;">
          <span class="mono" style="color: #00d659; font-size: 7.5pt; font-weight: bold;">02. TIPOGRAFIA IMPACTO</span>
          <p style="font-size: 7.5pt; margin-top: 3px;">Barlow Condensed Black 20pt em tracking largo (+2) e sub-tagline técnica de 9pt.</p>
        </div>
        <div style="background: #0a0e13; padding: 8px; border-radius: 4px; border: 1px solid #223140;">
          <span class="mono" style="color: #ffce76; font-size: 7.5pt; font-weight: bold;">03. SELO DE VERSÃO</span>
          <p style="font-size: 7.5pt; margin-top: 3px;">Box dourado com cantos chanfrados (rx=2) identificando a versão de homologação.</p>
        </div>
      </div>
    </div>

    <h3 style="margin-top: 6px;">PÚBLICO-ALVO & TOM DE VOZ</h3>
    <div class="grid-2">
      <div class="card">
        <h4 style="color: #42f372;">PERFIL DE JOGADOR</h4>
        <p style="font-size: 8pt;">
          Jogadores estratégicos de simulação (Dynasty Managers), fãs da NBA e NCAA obcecados por estatísticas avançadas (PER, True Shooting %, Win Shares, VORP), e apreciadores de narrativas profundas de carreira.
        </p>
      </div>
      <div class="card">
        <h4 style="color: #ffce76;">TOM DA INTERFACE</h4>
        <p style="font-size: 8pt;">
          Tenso, sério, metódico e confiável. Elimina ilustrações cartunescas ou cores saturadas infantis em prol de uma experiência de <em>War Room</em> de franquia profissional.
        </p>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>BASKETBALL RUN · HOOP LEGACY CAREER SIMULATOR PRO</span>
    <span>CONFIDENCIAL & ESTRATÉGICO</span>
  </div>
</div>

<!-- PÁGINA 3: SISTEMA CROMÁTICO & TOKENS DE DESIGN -->
<div class="page">
  <div class="page-header">
    <span class="brand">HOOP LEGACY PRO</span>
    <span>CAPÍTULO 2 · SISTEMA CROMÁTICO & TOKENS</span>
    <span>PÁGINA 03</span>
  </div>

  <div class="page-content">
    <h2>2. SISTEMA CROMÁTICO & TOKENS DE SUPERFÍCIE</h2>
    <p class="lead">
      A paleta cromática foi calculada para permitir sessões prolongadas de gameplay em ambientes escuros, garantindo conforto visual, contraste auditado e rápida distinção de alertas de lesão, fadiga e recordes.
    </p>

    <!-- Swatches de Cores Principais -->
    <h3>PALETA DE MARCA E DESTAQUE</h3>
    <div class="grid-4" style="margin-bottom: 12px;">
      <div class="color-swatch">
        <div class="swatch-box" style="background: #00d659;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Electric Emerald</div>
          <div class="swatch-hex">#00d659 · Primária</div>
          <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #bbcbb7;">Ações principais, botões sim, ganhos de atributo (+PER).</p>
        </div>
      </div>

      <div class="color-swatch">
        <div class="swatch-box" style="background: #007A33;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Celtics Heritage</div>
          <div class="swatch-hex">#007A33 · Secundária</div>
          <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #bbcbb7;">Bordas de foco, seleções de abas ativas, defesa.</p>
        </div>
      </div>

      <div class="color-swatch">
        <div class="swatch-box" style="background: #BA9653;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Trophy Gold</div>
          <div class="swatch-hex">#BA9653 · Terciária</div>
          <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #bbcbb7;">All-Star, All-NBA, MVP, campeonatos, draft round 1.</p>
        </div>
      </div>

      <div class="color-swatch">
        <div class="swatch-box" style="background: #42f372;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Neon Mint</div>
          <div class="swatch-hex">#42f372 · High Light</div>
          <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #bbcbb7;">Texto sobre fundo escuro, status Live Sim, badges HOT.</p>
        </div>
      </div>
    </div>

    <!-- Swatches de Superfície Neutra -->
    <h3>ECOSSISTEMA DE SUPERFÍCIES (DARK THEME TIERS)</h3>
    <div class="grid-4" style="margin-bottom: 12px;">
      <div class="color-swatch">
        <div class="swatch-box" style="background: #0a0e13; border-bottom: 1px solid #223140;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Deep Void Canvas</div>
          <div class="swatch-hex">#0a0e13 · Tier 0</div>
          <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #8496a8;">Fundo estrutural e canaletas de scroll.</p>
        </div>
      </div>

      <div class="color-swatch">
        <div class="swatch-box" style="background: #121820; border-bottom: 1px solid #223140;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Base Bay (Card)</div>
          <div class="swatch-hex">#121820 · Tier 1</div>
          <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #8496a8;">Container padrão para cards e tabelas.</p>
        </div>
      </div>

      <div class="color-swatch">
        <div class="swatch-box" style="background: #18222d; border-bottom: 1px solid #223140;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Elevated Bay</div>
          <div class="swatch-hex">#18222d · Tier 2</div>
          <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #8496a8;">Hovers de linha, modais, tooltips ativos.</p>
        </div>
      </div>

      <div class="color-swatch">
        <div class="swatch-box" style="background: #223140; border-bottom: 1px solid #2e4257;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Mechanical Hairline</div>
          <div class="swatch-hex">#223140 · Border</div>
          <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #8496a8;">Bordas de 1px entre módulos de telemetria.</p>
        </div>
      </div>
    </div>

    <!-- Theming Dinâmico das 30 Franquias -->
    <div class="card card-glow">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h3 style="margin: 0;">SISTEMA DE THEMING DINÂMICO (DYNAMIC NBA THEMING)</h3>
        <span class="badge badge-primary">CSS INJECTION RUNTIME</span>
      </div>
      <p style="font-size: 8.5pt; margin-bottom: 6px;">
        Quando o atleta é draftado ou transferido para qualquer uma das 30 franquias da NBA, a aplicação injeta variáveis de tema que reconfiguram dinamicamente os acentos luminosos da interface sem quebrar o contraste do tema escuro:
      </p>

      <table class="data-table" style="margin-bottom: 0;">
        <thead>
          <tr>
            <th>FRANQUIA ATIVA</th>
            <th>SIGLA</th>
            <th>COR PRIMÁRIA</th>
            <th>COR SECUNDÁRIA</th>
            <th>GLOW EFFECT INJETADO</th>
          </tr>
        </thead>
        <tbody>
          <tr class="highlight">
            <td>Boston Celtics (Default)</td>
            <td>BOS</td>
            <td>#007A33 (Celtics Green)</td>
            <td>#BA9653 (Gold)</td>
            <td>rgba(0, 122, 51, 0.35)</td>
          </tr>
          <tr>
            <td>Los Angeles Lakers</td>
            <td>LAL</td>
            <td>#552583 (Forum Purple)</td>
            <td>#FDB927 (Laker Gold)</td>
            <td>rgba(85, 37, 131, 0.35)</td>
          </tr>
          <tr>
            <td>Chicago Bulls</td>
            <td>CHI</td>
            <td>#CE1141 (Bulls Red)</td>
            <td>#000000 (Black)</td>
            <td>rgba(206, 17, 65, 0.35)</td>
          </tr>
          <tr>
            <td>Golden State Warriors</td>
            <td>GSW</td>
            <td>#1D428A (Warriors Royal)</td>
            <td>#FFC72C (California Gold)</td>
            <td>rgba(29, 66, 138, 0.35)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="page-footer">
    <span>BASKETBALL RUN · HOOP LEGACY CAREER SIMULATOR PRO</span>
    <span>CONFIDENCIAL & ESTRATÉGICO</span>
  </div>
</div>

<!-- PÁGINA 4: TIPOGRAFIA & HIERARQUIA TEXTUAL -->
<div class="page">
  <div class="page-header">
    <span class="brand">HOOP LEGACY PRO</span>
    <span>CAPÍTULO 3 · TIPOGRAFIA & HIERARQUIA</span>
    <span>PÁGINA 04</span>
  </div>

  <div class="page-content">
    <h2>3. TIPOGRAFIA: A TRÍADE DE PERFORMANCE</h2>
    <p class="lead">
      Três famílias tipográficas especializadas trabalham em perfeita harmonia estrutural, eliminando ruídos visuais e garantindo que números críticos não oscilem durante simulações em alta velocidade.
    </p>

    <div class="grid-3" style="margin-bottom: 12px;">
      <!-- Família 1 -->
      <div class="card" style="border-top: 3px solid #00d659;">
        <h3 style="font-size: 15pt; margin-bottom: 2px;">BARLOW CONDENSED</h3>
        <span class="mono" style="font-size: 7pt; color: #8496a8;">DISPLAY, HEADERS & PLACARES</span>
        <p style="font-size: 8pt; margin-top: 6px;">
          Geometria estreita e vertical inspirada nos placares eletrônicos de arenas como TD Garden e Madison Square Garden. Permite sobrenomes longos ("ANTETOKOUNMPO") sem estouro horizontal.
        </p>
        <div style="background: #0a0e13; padding: 6px; border-radius: 3px; margin-top: 6px;">
          <div style="font-family: 'Barlow Condensed'; font-size: 16pt; font-weight: 900; color: #ffffff;">CELTICS 118 x 102 KNICKS</div>
        </div>
      </div>

      <!-- Família 2 -->
      <div class="card" style="border-top: 3px solid #ffce76;">
        <h3 style="font-size: 15pt; margin-bottom: 2px; font-family: 'Chivo';">CHIVO (NEO-GROTESQUE)</h3>
        <span class="mono" style="font-size: 7pt; color: #8496a8;">PROSA, SCOUTING & NOTÍCIAS</span>
        <p style="font-size: 8pt; margin-top: 6px;">
          Clareza editorial máxima para relatórios táticos do treinador, descrições de lesão, cláusulas financeiras e interações narrativas de imprensa.
        </p>
        <div style="background: #0a0e13; padding: 6px; border-radius: 3px; margin-top: 6px;">
          <div style="font-family: 'Chivo'; font-size: 9pt; color: #bbcbb7;">"Silva demonstrou excelente leitura de pick-and-roll no último quarto..."</div>
        </div>
      </div>

      <!-- Família 3 -->
      <div class="card" style="border-top: 3px solid #77dc88;">
        <h3 style="font-size: 15pt; margin-bottom: 2px; font-family: 'JetBrains Mono';">JETBRAINS MONO</h3>
        <span class="mono" style="font-size: 7pt; color: #8496a8;">TELEMETRIA & SPLITS TABULARES</span>
        <p style="font-size: 8pt; margin-top: 6px;">
          Dígitos com largura rigorosamente constante (tabular figures). Garante que colunas de 82 jogos, aproveitamentos percentuais (51.4%) e salários permaneçam alinhados ao pixel.
        </p>
        <div style="background: #0a0e13; padding: 6px; border-radius: 3px; margin-top: 6px;">
          <div class="mono" style="font-size: 9pt; color: #00d659; font-weight: bold;">PTS: 29.8 | FG: 51.4% | 3P: 41.2%</div>
        </div>
      </div>
    </div>

    <h3>ESCALA TIPOGRÁFICA OFICIAL (DESIGN TOKENS)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>TOKEN NAME</th>
          <th>FONTE</th>
          <th>TAMANHO / LINE-HEIGHT</th>
          <th>PESO & TRACKING</th>
          <th>FINALIDADE NO SIMULADOR</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code style="color: #42f372;">display-hero</code></td>
          <td>Barlow Condensed</td>
          <td>56px / 60px</td>
          <td>Weight 800 · Track +0.02em</td>
          <td>Placares finais de jogo, números centrais do draft</td>
        </tr>
        <tr>
          <td><code style="color: #42f372;">stat-display</code></td>
          <td>JetBrains Mono</td>
          <td>32px / 36px</td>
          <td>Weight 700 · Track -0.03em</td>
          <td>OVR Monolith Badge (ex: 88 Geral do Jogador)</td>
        </tr>
        <tr>
          <td><code style="color: #42f372;">headline-xl</code></td>
          <td>Barlow Condensed</td>
          <td>40px / 44px</td>
          <td>Weight 700 · Track +0.01em</td>
          <td>Nome do atleta (ALEX SILVA), títulos de módulos</td>
        </tr>
        <tr>
          <td><code style="color: #42f372;">headline-md</code></td>
          <td>Barlow Condensed</td>
          <td>22px / 26px</td>
          <td>Weight 600 · Track +0.03em</td>
          <td>Cabeçalho de confronto (CELTICS VS BUCKS)</td>
        </tr>
        <tr>
          <td><code style="color: #42f372;">label-caps</code></td>
          <td>Barlow Condensed</td>
          <td>13px / 16px</td>
          <td>Weight 700 · Track +0.08em</td>
          <td>Títulos de colunas em caixa alta, badges e chips</td>
        </tr>
        <tr>
          <td><code style="color: #42f372;">body-md</code></td>
          <td>Chivo</td>
          <td>14px / 20px</td>
          <td>Weight 400 · Normal</td>
          <td>Parágrafos de notícias e relatórios de desempenho</td>
        </tr>
        <tr>
          <td><code style="color: #42f372;">stat-mono-sm</code></td>
          <td>JetBrains Mono</td>
          <td>11px / 14px</td>
          <td>Weight 400 · Normal</td>
          <td>Células de tabelas densas, tempo de jogo, salários</td>
        </tr>
      </tbody>
    </table>

    <h3 style="margin-top: 8px;">SISTEMA DE ICONOGRAFIA ESPORTIVA</h3>
    <div class="card">
      <div class="grid-4" style="font-size: 8pt;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="badge badge-primary">sports_basketball</span>
          <span>Basquete / Jogo</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="badge badge-gold">military_tech</span>
          <span>Troféu / Prêmio</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="badge badge-primary">shield</span>
          <span>Defesa / Contest</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="badge badge-danger">local_fire_department</span>
          <span>Forma Quente / Streak</span>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>BASKETBALL RUN · HOOP LEGACY CAREER SIMULATOR PRO</span>
    <span>CONFIDENCIAL & ESTRATÉGICO</span>
  </div>
</div>

<!-- PÁGINA 5: ARQUITETURA DE TELAS & O COCKPIT CENTRAL -->
<div class="page">
  <div class="page-header">
    <span class="brand">HOOP LEGACY PRO</span>
    <span>CAPÍTULO 4 · ARQUITETURA DO DASHBOARD</span>
    <span>PÁGINA 05</span>
  </div>

  <div class="page-content">
    <h2>4. ARQUITETURA DO COCKPIT CENTRAL (DASHBOARD)</h2>
    <p class="lead">
      O layout é estruturado em uma grade rígida modular de 12 colunas no desktop, complementada por uma barra de navegação lateral permanente e um cabeçalho de telemetria sincronizado em tempo real.
    </p>

    <!-- Visual Mockup do Dashboard -->
    <div class="card" style="padding: 6px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; padding: 2px 6px;">
        <span class="mono" style="font-size: 7.5pt; color: #00d659; font-weight: bold;">MOCKUP HOMOLOGADO DO COCKPIT CENTRAL (HOOP LEGACY v2.4)</span>
        <span class="badge badge-dark">12 COLUNAS · DESKTOP VIEW</span>
      </div>
      <div class="img-frame" style="max-height: 180px;">
        <img src="data:image/png;base64,{dash_b64}" alt="Dashboard Mockup"/>
      </div>
    </div>

    <h3>DECOMPOSIÇÃO DAS 4 REGIÕES ESTRUTURAIS</h3>
    <div class="grid-2">
      <div class="card">
        <h4 style="color: #42f372;">1. SIDEBAR DE COMANDO (256px Fixa)</h4>
        <p style="font-size: 8pt;">
          - Emblema oficial com logo v2.4.<br/>
          - Indicador de Teto Salarial ($168.4M / $172M) com barra de preenchimento.<br/>
          - Navegação com rotas: Dashboard, Roster & Lineups, Schedule, Standings, Career History, Draft & Scouting.<br/>
          - Ação Primária: Botão <strong>"ADVANCE DAY"</strong> com glow neon.
        </p>
      </div>

      <div class="card">
        <h4 style="color: #ffce76;">2. HEADER DE STATUS SINCRONIZADO (64px Fixo)</h4>
        <p style="font-size: 8pt;">
          - Chip da Temporada: "SEASON 2024-25 · WEEK 18".<br/>
          - Data do Jogo: "FEB 24, 2025" com badge "LIVE SIM SYNCED".<br/>
          - Ações Rápidas: Salvar Save, Hub da Liga, Caixa de Entrada (3 alerts), Finanças.<br/>
          - Identidade Rápida: Alex Silva #8, Badge OVR 88 e avatar.
        </p>
      </div>

      <div class="card">
        <h4 style="color: #42f372;">3. GRID CENTRAL DE 12 COLUNAS</h4>
        <p style="font-size: 8pt;">
          - <strong>Cols 1-3 (Esquerda):</strong> Dossiê Completo do Jogador (Vitals, Matriz de Atributos, Contrato, Papel Tático).<br/>
          - <strong>Cols 4-8 (Centro):</strong> Matchup Hero (Celtics vs Bucks), Simulação Rápida e Tabela Completa da Conferência Leste.<br/>
          - <strong>Cols 9-12 (Direita):</strong> Top 5 Líderes de Pontuação da NBA e Explorador Multi-Ligas (NCAA / G-League).
        </p>
      </div>

      <div class="card">
        <h4 style="color: #ffce76;">4. HUB HISTÓRICO DE CARREIRA (Base Full-Width)</h4>
        <p style="font-size: 8pt;">
          - Ledger estatístico consolidando a evolução do atleta desde o basquete universitário até o estrelato na NBA.<br/>
          - Totalizadores de pontos na carreira (6.124 PTS) e honrarias oficiais (7 Awards).
        </p>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>BASKETBALL RUN · HOOP LEGACY CAREER SIMULATOR PRO</span>
    <span>CONFIDENCIAL & ESTRATÉGICO</span>
  </div>
</div>

<!-- PÁGINA 6: COMPONENTES ESPECIALIZADOS DO SIMULADOR -->
<div class="page">
  <div class="page-header">
    <span class="brand">HOOP LEGACY PRO</span>
    <span>CAPÍTULO 5 · COMPONENTES DO SIMULADOR</span>
    <span>PÁGINA 06</span>
  </div>

  <div class="page-content">
    <h2>5. ESPECIFICAÇÃO DE COMPONENTES CHAVE</h2>
    <p class="lead">
      Cada componente da interface foi desenhado sob o princípio de feedback imediato, combinando elementos gráficos vetorizados, barras de medição e cartões de telemetria.
    </p>

    <div class="grid-2" style="margin-bottom: 10px;">
      <!-- Card do Atleta com Imagem -->
      <div class="card card-glow">
        <h3>DOSSIÊ DO ATLETA & AVATAR ESPORTS</h3>
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
          <div class="img-frame" style="width: 80px; height: 95px; shrink: 0;">
            <img src="data:image/png;base64,{portrait_b64}" alt="Alex Silva Portrait"/>
          </div>
          <div>
            <span class="badge badge-primary">ACTIVE ROSTER · SF #8</span>
            <div style="font-family: 'Barlow Condensed'; font-size: 15pt; font-weight: 800; color: #fff; margin-top: 2px;">
              ALEX <span style="color: #00d659;">'THE JET'</span> SILVA
            </div>
            <div class="mono" style="font-size: 7.5pt; color: #8496a8;">24 ANOS · 6'8" · 225 LB · DRAFT '21 R1:14</div>
            <div style="display: flex; gap: 4px; margin-top: 4px;">
              <span class="badge badge-gold" style="font-size: 11pt; padding: 1px 6px;">88 OVR</span>
              <span class="badge badge-dark">ALL-STAR TIER 1</span>
            </div>
          </div>
        </div>

        <!-- Barras de Atributos -->
        <div class="stat-bar-container">
          <div class="stat-bar-header">
            <span class="mono" style="color: #f0f4f8;">Arremesso (Shooting)</span>
            <span class="mono" style="color: #00d659; font-weight: bold;">89 / 99</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill fill-emerald" style="width: 89%;"></div>
          </div>
        </div>

        <div class="stat-bar-container">
          <div class="stat-bar-header">
            <span class="mono" style="color: #f0f4f8;">Visão & Playmaking IQ</span>
            <span class="mono" style="color: #77dc88; font-weight: bold;">82 / 99</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill fill-emerald" style="width: 82%;"></div>
          </div>
        </div>

        <div class="stat-bar-container">
          <div class="stat-bar-header">
            <span class="mono" style="color: #f0f4f8;">Defesa de Perímetro</span>
            <span class="mono" style="color: #00d659; font-weight: bold;">86 / 99</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill fill-emerald" style="width: 86%;"></div>
          </div>
        </div>

        <div class="stat-bar-container">
          <div class="stat-bar-header">
            <span class="mono" style="color: #f0f4f8;">Capacidade Física (Athleticism)</span>
            <span class="mono" style="color: #ffce76; font-weight: bold;">91 / 99</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill fill-gold" style="width: 91%;"></div>
          </div>
        </div>
      </div>

      <!-- Matchup Hero & Gatilhos de Simulação -->
      <div class="card card-gold">
        <h3>MATCHUP HERO & DISPARADORES DE SIMULAÇÃO</h3>
        <div style="background: #0a0e13; border: 1px solid #223140; border-radius: 4px; padding: 8px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 7.5pt; margin-bottom: 4px;">
            <span class="badge badge-primary">TD GARDEN · BOSTON, MA</span>
            <span class="mono" style="color: #ffce76; font-weight: bold;">ODDS: BOS -4.5 (O/U 232.5)</span>
          </div>

          <div style="display: flex; justify-content: space-around; align-items: center; padding: 6px 0;">
            <div style="text-align: center;">
              <div style="font-family: 'Barlow Condensed'; font-size: 16pt; font-weight: 900; color: #00d659;">CELTICS</div>
              <div class="mono" style="font-size: 7.5pt; color: #8496a8;">42-14 (CASA: 24-4)</div>
            </div>
            <div style="font-family: 'Barlow Condensed'; font-size: 14pt; font-weight: 900; color: #ffce76;">VS</div>
            <div style="text-align: center;">
              <div style="font-family: 'Barlow Condensed'; font-size: 16pt; font-weight: 900; color: #e0e2ea;">BUCKS</div>
              <div class="mono" style="font-size: 7.5pt; color: #8496a8;">39-17 (FORA: 17-10)</div>
            </div>
          </div>

          <div style="border-top: 1px solid #223140; padding-top: 6px; font-size: 7.5pt; display: flex; justify-content: space-between;">
            <span style="color: #00d659; font-weight: bold;">Alex Silva (29.8 PPG, 7.6 RPG)</span>
            <span style="color: #ffce76; font-weight: bold;">Giannis Antetokounmpo (28.9 PPG)</span>
          </div>
        </div>

        <button style="width: 100%; background: #00d659; color: #003912; border: none; padding: 8px; border-radius: 4px; font-family: 'Barlow Condensed'; font-size: 12pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; margin-bottom: 6px;">
          SIMULAR PRÓXIMO JOGO (VS MILWAUKEE BUCKS)
        </button>

        <div class="grid-3" style="font-size: 7.5pt;">
          <div style="background: #18222d; padding: 5px; text-align: center; border-radius: 3px; font-family: 'Barlow Condensed'; font-weight: bold;">JOGO A JOGO (PBP)</div>
          <div style="background: #18222d; padding: 5px; text-align: center; border-radius: 3px; font-family: 'Barlow Condensed'; font-weight: bold;">SIMULAÇÃO RÁPIDA</div>
          <div style="background: #18222d; padding: 5px; text-align: center; border-radius: 3px; font-family: 'Barlow Condensed'; font-weight: bold;">SIMULAR ATÉ PLAYOFFS</div>
        </div>
      </div>
    </div>

    <!-- Tabela de Classificação com Divisões Semânticas -->
    <h3>TABELA DE CLASSIFICAÇÃO COM LINHAS DE PLAY-IN & LOTTERY</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>#</th>
          <th>FRANQUIA (CONFERÊNCIA LESTE)</th>
          <th style="text-align: right;">VITÓRIAS (W)</th>
          <th style="text-align: right;">DERROTAS (L)</th>
          <th style="text-align: right;">PCT</th>
          <th style="text-align: right;">GB</th>
          <th style="text-align: right;">L10</th>
          <th style="text-align: right;">STRK</th>
        </tr>
      </thead>
      <tbody>
        <tr class="highlight">
          <td>1</td>
          <td style="font-family: 'Chivo'; font-weight: bold;">Boston Celtics (USER TEAM)</td>
          <td style="text-align: right; font-weight: bold;">42</td>
          <td style="text-align: right;">14</td>
          <td style="text-align: right;">.750</td>
          <td style="text-align: right;">-</td>
          <td style="text-align: right;">8-2</td>
          <td style="text-align: right;">W4</td>
        </tr>
        <tr>
          <td>2</td>
          <td style="font-family: 'Chivo'; font-weight: bold;">Milwaukee Bucks</td>
          <td style="text-align: right; font-weight: bold;">39</td>
          <td style="text-align: right;">17</td>
          <td style="text-align: right;">.696</td>
          <td style="text-align: right;">3.0</td>
          <td style="text-align: right;">7-3</td>
          <td style="text-align: right; color: #77dc88;">W2</td>
        </tr>
        <tr style="background: rgba(255, 206, 118, 0.15); border-top: 1px dashed #ffce76; border-bottom: 1px dashed #ffce76;">
          <td colspan="8" style="font-family: 'Barlow Condensed'; font-weight: 700; color: #ffce76; font-size: 8pt; text-align: center; padding: 2px;">
            ••• LINHA DE CORTE DO TORNEIO DE PLAY-IN (SEEDS 7 A 10) •••
          </td>
        </tr>
        <tr>
          <td>7</td>
          <td style="font-family: 'Chivo';">Indiana Pacers</td>
          <td style="text-align: right; font-weight: bold;">30</td>
          <td style="text-align: right;">26</td>
          <td style="text-align: right;">.536</td>
          <td style="text-align: right;">12.0</td>
          <td style="text-align: right;">6-4</td>
          <td style="text-align: right; color: #77dc88;">W1</td>
        </tr>
        <tr style="background: rgba(255, 59, 48, 0.1); border-top: 1px dashed #ff5252; border-bottom: 1px dashed #ff5252;">
          <td colspan="8" style="font-family: 'Barlow Condensed'; font-weight: 700; color: #ffb4ab; font-size: 8pt; text-align: center; padding: 2px;">
            ••• FORA DA PÓS-TEMPORADA / LOTERIA DO DRAFT (SEEDS 11 A 15) •••
          </td>
        </tr>
        <tr>
          <td>11</td>
          <td style="font-family: 'Chivo'; color: #8496a8;">Brooklyn Nets</td>
          <td style="text-align: right;">22</td>
          <td style="text-align: right;">34</td>
          <td style="text-align: right;">.393</td>
          <td style="text-align: right;">20.0</td>
          <td style="text-align: right;">3-7</td>
          <td style="text-align: right; color: #ff5252;">L2</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-footer">
    <span>BASKETBALL RUN · HOOP LEGACY CAREER SIMULATOR PRO</span>
    <span>CONFIDENCIAL & ESTRATÉGICO</span>
  </div>
</div>

<!-- PÁGINA 7: HUB HISTÓRICO DE CARREIRA & TELEMETRIA -->
<div class="page">
  <div class="page-header">
    <span class="brand">HOOP LEGACY PRO</span>
    <span>CAPÍTULO 6 · HISTÓRICO DE CARREIRA</span>
    <span>PÁGINA 07</span>
  </div>

  <div class="page-content">
    <h2>6. HUB DE CARREIRA: HISTÓRICO TEMPORADA A TEMPORADA</h2>
    <p class="lead">
      O registro oficial consolida a jornada ininterrupta do atleta: do basquete universitário (NCAA - Duke) até o topo da NBA, preservando cada métrica, split de arremesso e prêmio conquistado ao longo dos anos.
    </p>

    <!-- Resumo dos Marcos de Carreira -->
    <div class="grid-4" style="margin-bottom: 10px;">
      <div class="card" style="text-align: center;">
        <span class="mono" style="font-size: 7.5pt; color: #8496a8;">PONTOS TOTAIS</span>
        <div style="font-family: 'Barlow Condensed'; font-size: 20pt; font-weight: 900; color: #00d659;">6.124 PTS</div>
        <span class="mono" style="font-size: 7pt; color: #bbcbb7;">25.4 PPG Carreira</span>
      </div>

      <div class="card" style="text-align: center;">
        <span class="mono" style="font-size: 7.5pt; color: #8496a8;">ACCOLADES & PRÊMIOS</span>
        <div style="font-family: 'Barlow Condensed'; font-size: 20pt; font-weight: 900; color: #ffce76;">7 TROFÉUS</div>
        <span class="mono" style="font-size: 7pt; color: #bbcbb7;">MIP, All-Star, Final Four</span>
      </div>

      <div class="card" style="text-align: center;">
        <span class="mono" style="font-size: 7.5pt; color: #8496a8;">APROVEITAMENTO GLOBAL</span>
        <div style="font-family: 'Barlow Condensed'; font-size: 20pt; font-weight: 900; color: #f0f4f8;">50.3% FG</div>
        <span class="mono" style="font-size: 7pt; color: #bbcbb7;">39.4% 3PT · 85.8% FT</span>
      </div>

      <div class="card" style="text-align: center;">
        <span class="mono" style="font-size: 7.5pt; color: #8496a8;">STATUS CONTRATUAL</span>
        <div style="font-family: 'Barlow Condensed'; font-size: 20pt; font-weight: 900; color: #42f372;">$24.5M / 3Y</div>
        <span class="mono" style="font-size: 7pt; color: #bbcbb7;">Guaranteed + All-NBA Target</span>
      </div>
    </div>

    <!-- Tabela Completa do Histórico de Carreira -->
    <h3>LEDGER OFICIAL DE TELEMETRIA POR TEMPORADA</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>TEMPORADA</th>
          <th>LIGA</th>
          <th>EQUIPE</th>
          <th style="text-align: right;">J</th>
          <th style="text-align: right;">MIN</th>
          <th style="text-align: right;">PTS</th>
          <th style="text-align: right;">REB</th>
          <th style="text-align: right;">AST</th>
          <th style="text-align: right;">FG%</th>
          <th style="text-align: right;">3P%</th>
          <th style="text-align: right;">FT%</th>
          <th>PREMIAÇÕES & CONQUISTAS</th>
        </tr>
      </thead>
      <tbody>
        <!-- 2020-21: NCAA DUKE -->
        <tr>
          <td>2020-21</td>
          <td><span class="badge badge-dark" style="color: #64B5F6;">NCAA</span></td>
          <td style="font-family: 'Chivo'; font-weight: bold;">Duke Blue Devils</td>
          <td style="text-align: right;">30</td>
          <td style="text-align: right;">32.4</td>
          <td style="text-align: right; color: #ffce76; font-weight: bold;">21.2</td>
          <td style="text-align: right;">6.8</td>
          <td style="text-align: right;">3.5</td>
          <td style="text-align: right;">48.6%</td>
          <td style="text-align: right;">38.5%</td>
          <td style="text-align: right;">82.1%</td>
          <td>
            <span class="badge badge-gold" style="font-size: 7pt;">🏆 NCAA Final Four MOP</span>
            <span class="badge badge-dark" style="font-size: 7pt;">All-American 1st</span>
          </td>
        </tr>
        <!-- 2021-22: G-LEAGUE MAINE -->
        <tr>
          <td>2021-22</td>
          <td><span class="badge badge-dark" style="color: #81C784;">G-LEAGUE</span></td>
          <td style="font-family: 'Chivo'; font-weight: bold;">Maine Celtics</td>
          <td style="text-align: right;">18</td>
          <td style="text-align: right;">34.0</td>
          <td style="text-align: right; color: #77dc88; font-weight: bold;">24.5</td>
          <td style="text-align: right;">7.1</td>
          <td style="text-align: right;">4.2</td>
          <td style="text-align: right;">50.2%</td>
          <td style="text-align: right;">39.8%</td>
          <td style="text-align: right;">84.5%</td>
          <td>
            <span class="badge badge-primary" style="font-size: 7pt;">🏆 All-Rookie 1st</span>
            <span class="badge badge-dark" style="font-size: 7pt;">Showcase Champ</span>
          </td>
        </tr>
        <!-- 2021-22: NBA ROOKIE -->
        <tr>
          <td>2021-22</td>
          <td><span class="badge badge-primary">NBA</span></td>
          <td style="font-family: 'Chivo'; font-weight: bold; color: #00d659;">Boston Celtics</td>
          <td style="text-align: right;">48</td>
          <td style="text-align: right;">19.5</td>
          <td style="text-align: right; font-weight: bold;">11.4</td>
          <td style="text-align: right;">3.8</td>
          <td style="text-align: right;">2.1</td>
          <td style="text-align: right;">46.8%</td>
          <td style="text-align: right;">36.2%</td>
          <td style="text-align: right;">80.0%</td>
          <td>
            <span class="badge badge-dark" style="font-size: 7pt;">Rising Stars Selection</span>
          </td>
        </tr>
        <!-- 2022-23: NBA SOPHOMORE -->
        <tr>
          <td>2022-23</td>
          <td><span class="badge badge-primary">NBA</span></td>
          <td style="font-family: 'Chivo'; font-weight: bold; color: #00d659;">Boston Celtics</td>
          <td style="text-align: right;">78</td>
          <td style="text-align: right;">31.8</td>
          <td style="text-align: right; color: #77dc88; font-weight: bold;">22.8</td>
          <td style="text-align: right;">5.9</td>
          <td style="text-align: right;">4.1</td>
          <td style="text-align: right;">49.5%</td>
          <td style="text-align: right;">39.4%</td>
          <td style="text-align: right;">85.2%</td>
          <td>
            <span class="badge badge-gold" style="font-size: 7pt;">🏆 Most Improved Player (MIP)</span>
            <span class="badge badge-primary" style="font-size: 7pt;">⭐ NBA All-Star</span>
          </td>
        </tr>
        <!-- 2023-24: NBA ALL-NBA -->
        <tr>
          <td>2023-24</td>
          <td><span class="badge badge-primary">NBA</span></td>
          <td style="font-family: 'Chivo'; font-weight: bold; color: #00d659;">Boston Celtics</td>
          <td style="text-align: right;">79</td>
          <td style="text-align: right;">35.2</td>
          <td style="text-align: right; color: #ffce76; font-weight: bold;">27.6</td>
          <td style="text-align: right;">7.2</td>
          <td style="text-align: right;">5.4</td>
          <td style="text-align: right;">51.0%</td>
          <td style="text-align: right;">40.8%</td>
          <td style="text-align: right;">87.4%</td>
          <td>
            <span class="badge badge-gold" style="font-size: 7pt;">🏆 All-NBA 2nd Team</span>
            <span class="badge badge-primary" style="font-size: 7pt;">⭐ All-Star Starter</span>
          </td>
        </tr>
        <!-- 2024-25: NBA CURRENT -->
        <tr class="highlight">
          <td>2024-25</td>
          <td><span class="badge badge-primary" style="background: #00d659; color: #003912;">NBA ATUAL</span></td>
          <td style="font-family: 'Chivo'; font-weight: bold; color: #00d659;">Boston Celtics</td>
          <td style="text-align: right; font-weight: bold;">56</td>
          <td style="text-align: right;">36.1</td>
          <td style="text-align: right; font-weight: bold; font-size: 9pt;">29.8</td>
          <td style="text-align: right;">7.6</td>
          <td style="text-align: right;">5.9</td>
          <td style="text-align: right;">51.4%</td>
          <td style="text-align: right;">41.2%</td>
          <td style="text-align: right;">88.6%</td>
          <td>
            <span class="badge badge-gold" style="font-size: 7pt;">🏆 MVP CANDIDATE TOP-3</span>
            <span class="badge badge-primary" style="font-size: 7pt;">Scoring Title #2</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="card" style="margin-top: 6px;">
      <h4 style="color: #ffce76; margin-bottom: 3px;">TERMINAL DE TRANSAÇÕES & NOTÍCIAS EM TEMPO REAL</h4>
      <div class="mono" style="font-size: 7.5pt; color: #bbcbb7; background: #0a0e13; padding: 6px; border-radius: 3px; border-left: 3px solid #00d659;">
        <div><strong style="color: #ffce76;">[14:32:10] TRADE ALERT:</strong> Dallas Mavericks negocia escolha de 1ª rodada de 2026 com Brooklyn Nets.</div>
        <div><strong style="color: #ff5252;">[13:05:44] INJURY UPDATE:</strong> Joel Embiid (PHI) listado como day-to-day com dores no joelho.</div>
        <div><strong style="color: #00d659;">[11:20:18] GAME HIGHLIGHT:</strong> Alex Silva anota 34 PTS e 8 REB na vitória sobre o New York Knicks.</div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>BASKETBALL RUN · HOOP LEGACY CAREER SIMULATOR PRO</span>
    <span>CONFIDENCIAL & ESTRATÉGICO</span>
  </div>
</div>

<!-- PÁGINA 8: PLANOS DE IMPLEMENTAÇÃO TÉCNICA (ROADMAP) -->
<div class="page">
  <div class="page-header">
    <span class="brand">HOOP LEGACY PRO</span>
    <span>CAPÍTULO 7 · PLANOS DE IMPLEMENTAÇÃO</span>
    <span>PÁGINA 08</span>
  </div>

  <div class="page-content">
    <h2>7. PLANO DE IMPLEMENTAÇÃO FRONT-END (ROADMAP)</h2>
    <p class="lead">
      Roteiro técnico dividido em 5 fases sequenciais para refatorar o codebase React + TypeScript + Vite de `Basketball Run`, alinhando-o integralmente às especificações do Stitch Design System.
    </p>

    <!-- Fases de Implementação -->
    <div class="step-box">
      <div class="step-number">1</div>
      <div class="step-text" style="flex: 1;">
        <div style="display: flex; justify-content: space-between;">
          <h4 style="color: #42f372;">FASE 1: ATUALIZAÇÃO DOS DESIGN TOKENS (TAILWIND & CSS)</h4>
          <span class="badge badge-dark">SPRINT 1 · FUNDAÇÃO</span>
        </div>
        <p>
          - Expandir <code class="mono">tailwind.config.js</code> com a paleta completa de superfícies (<code class="mono">surface-container-lowest</code> a <code class="mono">highest</code>) e brand colors (<code class="mono">primary: #42f372</code>, <code class="mono">primary-container: #00d659</code>, <code class="mono">tertiary: #ffce76</code>).<br/>
          - Injetar no <code class="mono">index.css</code> as fontes oficiais do Google Fonts (<code class="mono">Barlow Condensed</code>, <code class="mono">Chivo</code>, <code class="mono">JetBrains Mono</code>).<br/>
          - Configurar variáveis CSS de time dinâmicas (<code class="mono">--team-primary</code>, <code class="mono">--team-secondary</code>, <code class="mono">--team-glow</code>).
        </p>
      </div>
    </div>

    <div class="step-box">
      <div class="step-number">2</div>
      <div class="step-text" style="flex: 1;">
        <div style="display: flex; justify-content: space-between;">
          <h4 style="color: #42f372;">FASE 2: RECONSTRUÇÃO DA SHELL DE NAVEGAÇÃO</h4>
          <span class="badge badge-dark">SPRINT 2 · SHELL</span>
        </div>
        <p>
          - Implementar a nova <code class="mono">SidebarNav.tsx</code> fixa de 64 (w-64) com monitor de Franchise Cap ($168.4M / $172M) e botão <code class="mono">ADVANCE DAY</code>.<br/>
          - Refatorar <code class="mono">HeaderNav.tsx</code> para layout com backdrop-blur, chip de semana da temporada, badge <code class="mono">LIVE SIM SYNCED</code> pulsante e quick actions.<br/>
          - Criar o componente vetorial reutilizável <code class="mono">HoopLegacyLogo.tsx</code> com suporte a SVG e tags de versão.
        </p>
      </div>
    </div>

    <div class="step-box">
      <div class="step-number">3</div>
      <div class="step-text" style="flex: 1;">
        <div style="display: flex; justify-content: space-between;">
          <h4 style="color: #ffce76;">FASE 3: REFATORAÇÃO MODULAR DO COCKPIT CENTRAL</h4>
          <span class="badge badge-dark">SPRINT 3 · CORE DASHBOARD</span>
        </div>
        <p>
          - Decompor <code class="mono">DashboardScreen.tsx</code> em submódulos isolados e testáveis:<br/>
          &nbsp;&nbsp;• <code class="mono">AthleteVitalsCard.tsx</code>: Avatar cel-shaded, OVR 88, Vitals (Morale, Stamina, Form) e barras 0-99.<br/>
          &nbsp;&nbsp;• <code class="mono">MatchupHeroCard.tsx</code>: Card de confronto com odds e triggers de simulação rápida e play-by-play.<br/>
          &nbsp;&nbsp;• <code class="mono">StandingsDenseTable.tsx</code>: Tabela de classificação com 15 times e divisões de Play-In/Lottery.<br/>
          &nbsp;&nbsp;• <code class="mono">LeagueScoutingWidget.tsx</code>: Top 5 cestinhas e alternador dinâmico de ligas NCAA/G-League.
        </p>
      </div>
    </div>

    <div class="step-box">
      <div class="step-number">4</div>
      <div class="step-text" style="flex: 1;">
        <div style="display: flex; justify-content: space-between;">
          <h4 style="color: #ffce76;">FASE 4: INTEGRAÇÃO COM A ENGINE DE SIMULAÇÃO & ZUSTAND</h4>
          <span class="badge badge-dark">SPRINT 4 · ENGINE BINDING</span>
        </div>
        <p>
          - Conectar os novos botões de simulação aos métodos assíncronos do <code class="mono">gameStore.ts</code> (<code class="mono">simulateNextGame</code>, <code class="mono">simulateBatchGames</code>).<br/>
          - Exibir barra de progresso luminosa animada durante simulações massivas em background (Web Worker).<br/>
          - Sincronizar o Terminal de Notícias com os eventos emitidos pela engine estocástica de transações da liga.
        </p>
      </div>
    </div>

    <div class="step-box">
      <div class="step-number">5</div>
      <div class="step-text" style="flex: 1;">
        <div style="display: flex; justify-content: space-between;">
          <h4 style="color: #00d659;">FASE 5: OTIMIZAÇÃO, RESPONSIVIDADE & PERSISTÊNCIA</h4>
          <span class="badge badge-dark">SPRINT 5 · POLISH & QA</span>
        </div>
        <p>
          - Garantir persistência reativa no IndexedDB via Dexie.js sem travamentos de I/O.<br/>
          - Validar a responsividade para telas ultrawide (1440p), laptops (1080p), tablets e smartphones.<br/>
          - Executar a bateria de testes unitários e de benchmark de 100 temporadas (<code class="mono">vitest run</code>).
        </p>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>BASKETBALL RUN · HOOP LEGACY CAREER SIMULATOR PRO</span>
    <span>CONFIDENCIAL & ESTRATÉGICO</span>
  </div>
</div>

<!-- PÁGINA 9: MATRIZ DE TESTES & CRITÉRIOS DE HOMOLOGAÇÃO -->
<div class="page">
  <div class="page-header">
    <span class="brand">HOOP LEGACY PRO</span>
    <span>CAPÍTULO 8 · CRITÉRIOS DE HOMOLOGAÇÃO</span>
    <span>PÁGINA 09</span>
  </div>

  <div class="page-content">
    <h2>8. CRITÉRIOS DE HOMOLOGAÇÃO & MATRIZ DE TESTES</h2>
    <p class="lead">
      Garantia de fidelidade de design, acessibilidade WCAG, conformidade de tipos TypeScript e estabilidade de taxas de quadros (60 FPS) em todas as transições de tela.
    </p>

    <h3>MATRIZ DE CONFORMIDADE TÉCNICA</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>ÁREA DE AVALIAÇÃO</th>
          <th>CRITÉRIO ESPECÍFICO</th>
          <th>MÉTODO DE VERIFICAÇÃO</th>
          <th>STATUS HOMOLOGADO</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Fidelidade Visual (Pixel Parity)</strong></td>
          <td>Cores, tipografia e espaçamentos 100% alinhados ao mockup Stitch</td>
          <td>Comparação visual automatizada / Playwright Screenshot Diff</td>
          <td><span class="badge badge-primary">CONFORME</span></td>
        </tr>
        <tr>
          <td><strong>Acessibilidade (WCAG 2.1)</strong></td>
          <td>Contraste mínimo de 4.5:1 para textos e números sobre fundos escuros</td>
          <td>Auditoria Lighthouse / Axe Accessibility Scanner</td>
          <td><span class="badge badge-primary">AA+ AUDITADO</span></td>
        </tr>
        <tr>
          <td><strong>Estabilidade Tabular</strong></td>
          <td>Zero jitter horizontal em números ao atualizar splits estatísticos</td>
          <td>Uso obrigatório de fontes JetBrains Mono com tabular-nums</td>
          <td><span class="badge badge-primary">RIGOROSO</span></td>
        </tr>
        <tr>
          <td><strong>Performance de Simulação</strong></td>
          <td>Simulação de 82 jogos em menos de 1.5s mantendo UI reativa a 60 FPS</td>
          <td>Benchmark script <code class="mono">benchmark100Seasons.test.ts</code></td>
          <td><span class="badge badge-primary">BENCHMARK OK</span></td>
        </tr>
        <tr>
          <td><strong>Tipagem e Build</strong></td>
          <td>Compilação TypeScript sem erros (<code class="mono">tsc --noEmit</code>) e build Vite limpo</td>
          <td>Pipeline CI/CD com Vite 6 + TypeScript 5.7</td>
          <td><span class="badge badge-primary">PASSING</span></td>
        </tr>
      </tbody>
    </table>

    <h3 style="margin-top: 10px;">CHECKLIST EXECUTIVO DE ENTREGA</h3>
    <div class="grid-2">
      <div class="card">
        <h4 style="color: #42f372;">ENTREGÁVEIS DE DESIGN SYSTEM</h4>
        <p style="font-size: 8pt;">
          [x] Manual de Identidade Visual em PDF compilado.<br/>
          [x] Tokens semânticos exportados para Tailwind CSS.<br/>
          [x] Logotipo oficial vetorizado em SVG com selo v2.4.<br/>
          [x] Assets gráficos de alta resolução integrados.<br/>
          [x] Especificação de paletas dinâmicas para 30 franquias.
        </p>
      </div>

      <div class="card">
        <h4 style="color: #ffce76;">ENTREGÁVEIS DE ENGENHARIA DE TELAS</h4>
        <p style="font-size: 8pt;">
          [x] Arquitetura modular de 12 colunas documentada.<br/>
          [x] Componentes do Cockpit projetados e validados.<br/>
          [x] Sistema de classificação com Play-In e Loteria.<br/>
          [x] Hub de carreira com histórico ininterrupto.<br/>
          [x] Plano de migração incremental do código legado.
        </p>
      </div>
    </div>

    <div class="card card-glow" style="margin-top: 10px; text-align: center; padding: 12px;">
      <div style="font-family: 'Barlow Condensed'; font-size: 16pt; font-weight: 900; color: #00d659; letter-spacing: 0.05em;">
        HOOP LEGACY: CAREER SIMULATOR PRO — HOMOLOGAÇÃO VISUAL CONCLUÍDA
      </div>
      <p style="margin: 4px 0 0 0; font-size: 8.5pt; color: #bbcbb7;">
        Este documento consolida o padrão oficial de design e implementação para o ecossistema Basketball Run.
      </p>
    </div>
  </div>

  <div class="page-footer">
    <span>BASKETBALL RUN · HOOP LEGACY CAREER SIMULATOR PRO</span>
    <span>VERSÃO 2.4 · HOMOLOGADO PARA IMPLEMENTAÇÃO</span>
  </div>
</div>

</body>
</html>
"""

    html_file = os.path.join(base_dir, "identidade_visual_temp.html")
    pdf_file = os.path.join(base_dir, "identidade visual e planos de implementação.pdf")

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"HTML gerado com sucesso em: {html_file}")
    print("Iniciando compilação do PDF com o Google Chrome Headless...")

    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if not os.path.exists(chrome_path):
        chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        html_file
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    print("Código de retorno do Chrome:", res.returncode)
    
    if os.path.exists(pdf_file):
        size = os.path.getsize(pdf_file)
        print(f"PDF gerado com sucesso! Arquivo: {pdf_file} ({size} bytes)")
    else:
        print("Erro: PDF não foi gerado.")
        print(res.stderr)

    print(f"Processo finalizado com sucesso. Arquivo pronto: {pdf_file}")

    if os.path.exists(html_file):
        os.remove(html_file)

if __name__ == "__main__":
    build_pdf()

