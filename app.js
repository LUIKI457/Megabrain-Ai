(() => {
'use strict';
const $ = id => document.getElementById(id);
const robot=$('robot'), mood=$('mood'), status=$('status'), messages=$('messages'), input=$('input'), mic=$('mic');
const STORE='megabrain.v2';
let history=[], notes=[], recognition=null, listening=false;
const load=()=>{try{const x=JSON.parse(localStorage.getItem(STORE)||'{}');history=Array.isArray(x.history)?x.history.slice(-80):[];notes=Array.isArray(x.notes)?x.notes:[];if(x.theme==='light')document.body.classList.add('light')}catch{}};
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify({history:history.slice(-80),notes,theme:document.body.classList.contains('light')?'light':'dark'}))}catch{setMood('sleep','Armazenamento local indisponível.')}};
function setMood(mode,label){robot.className='robot '+mode;mood.textContent=label}
function add(text,who,store=true){const el=document.createElement('div');el.className='msg '+who;el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;if(store){history.push({text,who,at:Date.now()});history=history.slice(-80);save()}}
function speak(text){add(text,'bot');if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='pt-BR';u.rate=1;u.pitch=1;speechSynthesis.speak(u)}}
function open(url){window.open(url,'_blank','noopener,noreferrer')}
function fmtTime(){return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
function showNotes(){return notes.length?notes.map((n,i)=>(i+1)+'. '+n).join('\n'):'Sua memória ainda está vazia. Diga “anote: ...” para guardar alguma coisa.'}
function calc(expr){if(!/^[\d\s()+\-*/.,%]+$/.test(expr)||expr.length>80)return null;const tokens=expr.replace(/,/g,'.').match(/\d+(?:\.\d+)?|[()+\-*/%]/g);if(!tokens||tokens.join('')!==expr.replace(/,/g,'.').replace(/\s/g,''))return null;let i=0;function factor(){let t=tokens[i++];if(t==='+'||t==='-'){let v=factor();return t==='-'?-v:v}if(t==='('){let v=expression();if(tokens[i++]!==')')throw Error();return v}let n=Number(t);if(!Number.isFinite(n))throw Error();return n}function term(){let v=factor();while(['*','/','%'].includes(tokens[i])){let op=tokens[i++],r=factor();if((op==='/'||op==='%')&&r===0)throw Error();v=op==='*'?v*r:op==='/'?v/r:v%r}return v}function expression(){let v=term();while(tokens[i]==='+'||tokens[i]==='-'){let op=tokens[i++],r=term();v=op==='+'?v+r:v-r}return v}try{let v=expression();if(i!==tokens.length||!Number.isFinite(v))return null;return Number(v.toFixed(8))}catch{return null}}
function reply(raw){const t=raw.trim(),s=t.toLowerCase();setMood('thinking','Processando comando local…');
if(/^(oi|olá|ola|bom dia|boa tarde|boa noite)[!. ]*$/i.test(s)){speak('Olá! Meu núcleo local está pronto. Posso executar comandos, guardar notas e controlar algumas funções do navegador.');return}
if(s.includes('hora')){speak('Agora são '+fmtTime()+'.');return}
if(s.includes('data')||s.includes('dia é hoje')){speak('Hoje é '+new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'.');return}
if(s.includes('bateria')){if(navigator.getBattery)navigator.getBattery().then(b=>speak('Bateria em '+Math.round(b.level*100)+' por cento'+(b.charging?', carregando.':'.'))).catch(()=>speak('Não consegui acessar a bateria neste navegador.'));else speak('Este navegador não disponibiliza o nível da bateria.');return}
if(s.startsWith('anote:')||s.startsWith('anota ')||s.startsWith('guarde ')){const note=t.replace(/^(anote:|anota|guarde)\s*/i,'').trim();if(!note){speak('Escreva o conteúdo depois de “anote:”.');return}notes.push(note);save();speak('Anotado na memória deste aparelho.');return}
if(s.includes('mostrar minhas notas')||s==='minhas notas'||s==='listar notas'){speak(showNotes());return}
if(s.startsWith('apague nota ')||s.startsWith('remova nota ')){const n=parseInt(s.match(/nota\s+(\d+)/)?.[1]||'0',10);if(n>0&&n<=notes.length){notes.splice(n-1,1);save();speak('Nota '+n+' removida.')}else speak('Não encontrei essa nota.');return}
if(s.includes('limpar notas')){notes=[];save();speak('Memória de notas limpa.');return}
if(s.startsWith('calcule ')||s.startsWith('quanto é ')||s.startsWith('quanto e ')){const expr=t.replace(/^(calcule|quanto é|quanto e)\s*/i,'');const v=calc(expr);speak(v===null?'Não consegui interpretar essa conta. Use números e +, -, *, / ou parênteses.':'O resultado é '+v+'.');return}
if(s.includes('modo claro')){document.body.classList.add('light');save();speak('Modo claro ativado.');return}
if(s.includes('modo escuro')){document.body.classList.remove('light');save();speak('Modo escuro ativado.');return}
if(s.includes('tela cheia')||s.includes('fullscreen')){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().then(()=>speak('Tela cheia ativada.')).catch(()=>speak('O navegador bloqueou a tela cheia.'));else document.exitFullscreen?.();return}
if(s.includes('sair da tela cheia')||s.includes('minimizar')){document.exitFullscreen?.();speak('Saindo da tela cheia.');return}
if(s.includes('rolar para baixo')||s==='descer'){window.scrollBy({top:innerHeight*.75,behavior:'smooth'});speak('Rolando para baixo.');return}
if(s.includes('rolar para cima')||s==='subir'){window.scrollBy({top:-innerHeight*.75,behavior:'smooth'});speak('Rolando para cima.');return}
if(s.includes('parar de falar')||s==='silêncio'||s==='silencio'){speechSynthesis?.cancel();setMood('sleep','Em silêncio.');return}
if(s.includes('leia a conversa')||s.includes('ler conversa')){const all=history.map(x=>x.text).join('. ');speak(all||'Ainda não há conversa.');return}
if(s.includes('limpar conversa')){history=[];messages.replaceChildren();save();speak('Histórico de conversa limpo.');return}
const sites={youtube:'https://m.youtube.com',spotify:'https://open.spotify.com',google:'https://www.google.com',bandlab:'https://www.bandlab.com',github:'https://github.com',nvidia:'https://build.nvidia.com'};
for(const [name,url] of Object.entries(sites)){if(s.includes('abrir '+name)){speak('Abrindo '+name+'.');open(url);return}}
const q=t.match(/^(pesquisar|pesquise|buscar|procure)( por)?\s+(.+)/i);if(q){speak('Abrindo uma pesquisa por '+q[3]+'.');open('https://www.google.com/search?q='+encodeURIComponent(q[3]));return}
if(s.includes('comandos')||s==='ajuda'){speak('Posso informar hora e data, consultar bateria quando disponível, calcular contas simples, guardar e listar notas, mudar o tema, abrir sites, pesquisar na web, ativar tela cheia e ler a conversa.');return}
if(s.includes('quem é você')||s.includes('quem e voce')){speak('Sou o MegaBrain. Neste build, meu núcleo é local: memória, voz e comandos. Ainda não tenho um modelo generativo conectado, então não vou inventar respostas.');return}
setMood('sleep','Comando não reconhecido.');speak('Ainda não tenho um modelo de IA conectado para responder livremente. Posso executar comandos locais. Diga “ajuda” para ver o que já funciona.');}
function send(text){const v=(text||'').trim();if(!v)return;add(v,'user');input.value='';reply(v)}
$('form').addEventListener('submit',e=>{e.preventDefault();send(input.value)});
document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.prompt)));
$('full').addEventListener('click',()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.()});
$('theme').addEventListener('click',()=>{document.body.classList.toggle('light');save()});
$('clear').addEventListener('click',()=>{history=[];messages.replaceChildren();save();add('Histórico limpo.','bot')});
$('export').addEventListener('click',()=>{const blob=new Blob([history.map(x=>'['+new Date(x.at).toLocaleString('pt-BR')+'] '+(x.who==='user'?'Você':'MegaBrain')+': '+x.text).join('\n\n')],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='megabrain-conversa.txt';a.click();URL.revokeObjectURL(a.href)});
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){recognition=new SR();recognition.lang='pt-BR';recognition.interimResults=false;recognition.continuous=false;recognition.onstart=()=>{listening=true;mic.classList.add('active');mic.textContent='🔴 OUVINDO…';status.textContent='OUVINDO';setMood('listening','Estou ouvindo.');};recognition.onresult=e=>send(e.results[0][0].transcript);recognition.onerror=e=>{if(e.error!=='no-speech')add('Não consegui acessar o microfone. Confira a permissão do navegador.','bot')};recognition.onend=()=>{listening=false;mic.classList.remove('active');mic.textContent='🎙  TOCAR PARA FALAR';status.textContent='LOCAL';setMood('','Núcleo local pronto.')}}else{mic.textContent='🎙 VOZ INDISPONÍVEL NESTE NAVEGADOR';mic.disabled=true}
mic.addEventListener('click',()=>{if(!recognition)return;if(listening)recognition.stop();else try{recognition.start()}catch{}});
load();history.forEach(x=>add(x.text,x.who,false));if(!history.length)add('MegaBrain inicializado. Tenho memória local, comandos e controle por voz. Ainda não há um modelo generativo conectado. Digite “ajuda” para começar.','bot',true);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();