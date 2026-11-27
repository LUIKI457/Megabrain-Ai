# MegaBrain AI

Assistente web mobile-first, sem ESP32 e sem dependência obrigatória de serviços pagos.

## Build 0.4
- Avatar composto **somente por dois olhos**: sem cabeça, corpo, boca, antena ou orelhas.
- Olhos animados com piscadas, estados de escuta e processamento, e pupilas que acompanham o ponteiro/toque.
- Interface responsiva, tela cheia e tema claro/escuro.
- Reconhecimento de voz em navegadores compatíveis e fala em português.
- Histórico e notas persistentes no aparelho.
- Comandos locais: hora, data, bateria (quando o navegador expõe a API), calculadora básica, notas, tema, tela cheia, rolagem, leitura do histórico, abertura de sites e pesquisa.
- Exportação de conversa em TXT.
- PWA instalável com cache offline para a interface e os comandos locais.

## Voz e privacidade
O suporte a SpeechRecognition varia entre navegadores. Alguns usam um serviço remoto para reconhecer a fala, então o reconhecimento pode não funcionar offline e o áudio pode ser processado pelo serviço do navegador. Consulte a documentação do [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). A síntese de voz é feita pelo navegador.

## Limite atual
Ainda não há um modelo generativo conectado. O MegaBrain executa comandos locais e não finge responder livremente como um LLM. Nenhuma chave de API está embutida no frontend.

## Plugins do ChatGPT e o MegaBrain
Conexões como Todoist, Google Calendar, Notion e Firecrawl podem ampliar o que o ChatGPT consegue fazer nesta conversa. Elas **não são automaticamente transferidas** para o site MegaBrain nem expõem credenciais ao JavaScript do navegador. Para o próprio site conversar com esses serviços, cada integração precisa de API/OAuth próprios e de um backend seguro. Não coloque tokens ou chaves secretas em arquivos públicos.

## Supabase
Os projetos existentes disponíveis na conta têm outros nomes e aparentam pertencer a outros aplicativos. Não misturei os dados deles com o MegaBrain. Nenhum projeto novo foi criado e nenhuma cobrança foi iniciada. O app funciona localmente sem Supabase.

Quando existir um projeto Supabase dedicado ao MegaBrain, podemos adicionar autenticação, sincronização entre aparelhos e Edge Functions com segredos guardados no servidor e políticas RLS.

## Publicação
O repositório está preparado para GitHub Pages. Em Settings > Pages, selecione Deploy from a branch, branch `main`, pasta `/ (root)`. Se já estiver ativado, aguarde o deploy.
