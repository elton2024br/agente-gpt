# ChatGPT Auto Sender Pro

Uma extensão Chrome moderna e avançada para enviar prompts automaticamente para o ChatGPT. Com interface elegante, templates, configurações personalizáveis e feedback visual em tempo real.

## ✨ Novas Funcionalidades

### 🎨 Interface Moderna
- Design responsivo e elegante com gradientes
- Sistema de abas organizado (Prompts, Templates, Configurações)
- Barra de progresso em tempo real
- Notificações visuais
- Feedback de status colorido

### 📝 Sistema de Templates
- Salve e reutilize conjuntos de prompts
- Organize templates por nome
- Carregue templates com um clique
- Gerencie templates facilmente

### ⚙️ Configurações Avançadas
- **Delay personalizável**: Configure o tempo entre prompts (1-60 segundos)
- **Modo de envio**: 
  - Sequencial: Envia um prompt por vez
  - Em lote: Envia todos simultaneamente
- **Auto-scroll**: Rola automaticamente para novas mensagens
- **Configurações persistentes**: Suas preferências são salvas

### 📊 Feedback Visual
- Barra de progresso em tempo real
- Contador de prompts enviados
- Status colorido (Ocioso, Enviando, Erro)
- Notificações toast elegantes

### 💾 Importar/Exportar
- Exporte seus prompts como arquivo JSON
- Importe prompts de arquivos JSON
- Backup e compartilhamento fácil

## 🚀 Instalação

1. Clone ou baixe este repositório
2. Abra o Chrome e navegue para `chrome://extensions`
3. Ative o **Modo desenvolvedor** no canto superior direito
4. Clique em **Carregar sem compactação** e selecione a pasta do repositório
5. A extensão aparecerá na lista e seu ícone estará disponível ao lado da barra de endereços

## 📖 Como Usar

### Enviando Prompts
1. Abra o ChatGPT em uma aba e faça login
2. Clique no ícone da extensão para abrir o popup
3. Digite seus prompts na aba "Prompts" (um por linha)
4. Configure as opções na aba "Configurações"
5. Clique em **Iniciar Envio**
6. Acompanhe o progresso na barra de progresso
7. Use **Parar Envio** a qualquer momento para interromper

### Usando Templates
1. Vá para a aba "Templates"
2. Digite um nome para o template
3. Adicione os prompts no campo de conteúdo
4. Clique em **Salvar Template**
5. Use o botão **Usar** para carregar um template
6. Use **Excluir** para remover templates

### Configurações
- **Delay**: Tempo entre prompts (padrão: 2 segundos)
- **Modo**: Sequencial ou em lote
- **Auto-scroll**: Ativa/desativa scroll automático
- **Importar/Exportar**: Gerencia seus prompts

## 🔧 Funcionalidades Técnicas

### Compatibilidade
- ✅ ChatGPT (chat.openai.com)
- ✅ Múltiplos seletores para maior compatibilidade
- ✅ Tratamento de erros robusto
- ✅ Retry automático em caso de falha

### Performance
- ⚡ Envio otimizado com delays configuráveis
- ⚡ Modo em lote para envio simultâneo
- ⚡ Feedback em tempo real
- ⚡ Interrupção segura

### Armazenamento
- 💾 Prompts salvos automaticamente
- 💾 Templates persistentes
- 💾 Configurações personalizadas
- 💾 Histórico de uso

## 🎯 Casos de Uso

### Marketing e Vendas
- Envie perguntas de qualificação em massa
- Teste diferentes abordagens de vendas
- Gere conteúdo para campanhas

### Pesquisa e Análise
- Colete dados de forma automatizada
- Teste hipóteses com múltiplos prompts
- Analise respostas do ChatGPT

### Educação e Treinamento
- Crie exercícios automatizados
- Teste conhecimento com perguntas variadas
- Gere conteúdo educacional

### Desenvolvimento
- Teste prompts de programação
- Gere código com diferentes abordagens
- Debug prompts complexos

## 🔒 Privacidade e Segurança

- ✅ Não coleta dados pessoais
- ✅ Não envia dados para servidores externos
- ✅ Armazenamento local apenas
- ✅ Permissões mínimas necessárias

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
├── manifest.json      # Configuração da extensão
├── popup.html        # Interface do usuário
├── popup.js         # Lógica da interface
├── background.js    # Service worker
├── content.js       # Script de injeção (vazio)
├── icon.png         # Ícone da extensão
└── README.md        # Documentação
```

### Tecnologias Utilizadas
- HTML5 + CSS3 (Design responsivo)
- JavaScript ES6+ (Lógica moderna)
- Chrome Extensions API
- Local Storage API

## 📈 Melhorias da Versão 2.0

- 🎨 Interface completamente redesenhada
- 📝 Sistema de templates implementado
- ⚙️ Configurações avançadas
- 📊 Feedback visual aprimorado
- 💾 Importar/Exportar funcionalidades
- 🔧 Tratamento de erros robusto
- 🚀 Performance otimizada

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

- Anderson Mak pelo projeto original
- Comunidade Chrome Extensions
- Contribuidores e testadores

---

**Desenvolvido com ❤️ para a comunidade de desenvolvedores**

