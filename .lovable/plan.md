## Visão geral

Reorganizar o Newloc em torno dos **3 segmentos de negócio** que o cliente pediu, com visual limpo (referência Localiza/Zarp) e foco principal no fluxo de **motorista de aplicativo**. Header enxuto, sem poluição visual.

## Estrutura de navegação (header)

```
[LOGO]   Aplicativo   Frota   Assinatura   Frotista ▾   Atendimento     [Entrar]
```

- **Aplicativo** (`/aplicativo`) — destaque principal, fluxo de alto volume
- **Frota** (`/frota`) — empresas, formulário de proposta
- **Assinatura** (`/assinatura`) — plano estendido PF, **bloqueia motorista de app**
- **Frotista ▾** — dropdown com: Sobre, Como funciona, Lojas, FAQ
- **Atendimento** — WhatsApp/contato

## Páginas e fluxos

### 1. Home (`/`) — hub limpo
Hero curto + 3 cards grandes (Aplicativo / Frota / Assinatura) que levam aos segmentos. Sem catálogo gigante na home.

### 2. Aplicativo (`/aplicativo`) — fluxo principal
- Hero focado em motorista de app (Uber/99)
- Filtros: cidade + categoria
- Catálogo de carros marcados como `segment = 'aplicativo'`
- CTA: WhatsApp para reservar (fluxo atual)

### 3. Frota (`/frota`) — B2B
- Página institucional curta (benefícios para empresa)
- **Formulário "Monte sua proposta"**: nome empresa, CNPJ, contato, qtd veículos, categoria desejada, prazo, cidade, observações
- Envio salva em tabela `fleet_proposals` + dispara e-mail/WhatsApp para o admin
- Sem catálogo público — atendimento consultivo

### 4. Assinatura (`/assinatura`) — PF longo prazo
- Hero "Carro por assinatura — 12 a 36 meses"
- Catálogo de carros marcados como `segment = 'assinatura'`
- **Aviso claro**: "Não disponível para motoristas de aplicativo"
- Checkbox obrigatório no formulário de interesse: "Declaro que não usarei o veículo para transporte de passageiros por aplicativo"
- CTA: formulário de interesse → WhatsApp

### 5. Detalhe do carro (`/carros/:id`) — mantém atual
Adapta CTA conforme `segment` do veículo.

### 6. Admin
- Adicionar campo **segmento** (`aplicativo` | `assinatura`) no cadastro de carros
- Nova aba **Propostas de Frota** listando submissões do formulário

## Banco de dados

Mudanças mínimas:
- `cars`: adicionar coluna `segment text not null default 'aplicativo'` (check in `'aplicativo','assinatura'`)
- Nova tabela `fleet_proposals` (empresa, cnpj, contato, email, telefone, qtd_veiculos, categoria, prazo_meses, cidade, mensagem, status, created_at) com RLS: insert público (anon), select/update apenas admin
- Nova tabela `subscription_leads` (nome, email, telefone, cidade, carro_id, aceitou_termo_nao_app boolean, created_at) com mesma política

## Design (limpo, estilo Localiza)

- Tipografia generosa, muito espaço em branco
- Paleta: azul corporativo Newloc + cinza neutro + branco (sem gradientes pesados)
- Cards com bordas suaves, sombras discretas
- Header sticky branco com borda inferior fina
- Remover excessos visuais do tema atual (glow, gradientes fortes)

## Detalhes técnicos

- TanStack Start routes: `aplicativo.tsx`, `frota.tsx`, `assinatura.tsx`, `_authenticated/admin.propostas.tsx`
- Server functions para submissão de formulários (insert público via cliente publishable)
- Filtro `segment` aplicado nas queries de catálogo
- Manter integração WhatsApp/email já existente para reservas de carro
- SEO: `head()` distinto em cada rota (title, description, og)

## Fora de escopo (esta entrega)

- Integração com gateway de pagamento
- Login de cliente final (mantém só admin)
- Geolocalização automática
- Reserva online com calendário (segue WhatsApp)

## Pergunta antes de implementar

Confirma esse escopo? Em especial:
1. **Frota**: formulário gera proposta interna (admin recebe) — sem catálogo público, certo?
2. **Assinatura**: catálogo separado dos carros de aplicativo, ou os mesmos carros podem aparecer nos dois?
3. Quer que eu já refatore o visual atual para a estética mais limpa nesta mesma entrega?