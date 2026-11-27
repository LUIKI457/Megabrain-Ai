# MegaBrain AI

Assistente web mobile-first, sem ESP32 e sem dependência obrigatória de serviços pagos.

## O que funciona neste build
- Interface responsiva e modo tela cheia.
- Reconhecimento de voz em navegadores compatíveis (normalmente Chrome/HTTPS) e fala em português.
- Histórico persistente no aparelho.
- Memória de notas local: `anote: texto`, `mostrar minhas notas`, `apague nota 1`, `limpar notas`.
- Comandos de hora, data, bateria (quando o navegador expõe a API), calculadora básica, tema, rolagem, leitura de conversa, abertura de sites e pesquisa web.
- Exportação do histórico em TXT.
- PWA instalável e cache offline para interface e comandos locais.

## Limite importante
Este projeto ainda não inclui um modelo generativo. Ele não chama NVIDIA Nemotron nem outro provedor, não consome créditos de API e não finge produzir respostas livres. Para adicionar IA real será necessário escolher um provedor e proteger a chave num backend/Edge Function. Não coloque chaves secretas no JavaScript público.

## Supabase
Não conectei este app aos projetos Supabase existentes porque os projetos disponíveis na conta têm outros nomes e aparentam pertencer a outros aplicativos. Não é seguro misturar a memória do MegaBrain com bancos de ArenaLegends ou EggVerse. Nenhum projeto novo foi criado e nenhuma cobrança foi iniciada. O app funciona localmente sem Supabase.

Quando existir um projeto Supabase dedicado ao MegaBrain, podemos adicionar login, sincronização entre aparelhos e uma Edge Function para o modelo, com RLS e segredos guardados no servidor.

## Publicação
O repositório está preparado para GitHub Pages. Em Settings > Pages, selecione Deploy from a branch, branch `main`, pasta `/ (root)`. Se já estiver ativado, aguarde o deploy.
