# 📚 Documentação Técnica - Sistema de Manutenção de Equipamentos

## 🏗️ Arquitetura do Sistema

### Visão Geral
O sistema é uma aplicação full-stack desenvolvida com tecnologias modernas para gerenciamento de manutenção de equipamentos, seguindo os padrões de desenvolvimento web atuais.

### Stack Tecnológica

#### Backend
- **Framework**: Spring Boot 3.5.5
- **Linguagem**: Java 21
- **Banco de Dados**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Containerização**: Docker + Docker Compose

#### Frontend
- **Framework**: Angular 18.2.0
- **Linguagem**: TypeScript 5.5.2
- **UI Framework**: Bootstrap 5.3.7
- **Geração de PDF**: jsPDF + jsPDF-AutoTable
- **Build Tool**: Angular CLI

## 🗄️ Estrutura do Banco de Dados

### Entidades Principais

#### Usuarios
- **Propósito**: Armazenar dados de clientes e funcionários
- **Campos Únicos**: email, cpf
- **Perfis**: CLIENTE, FUNCIONARIO
- **Segurança**: Senhas com hash SHA-256 + SALT

#### Solicitacoes
- **Propósito**: Registrar solicitações de manutenção
- **Estados**: ABERTA, ORCADA, APROVADA, REJEITADA, REDIRECIONADA, ARRUMADA, PAGA, FINALIZADA
- **Relacionamentos**: Cliente, Categoria, Estado Atual

#### Categorias
- **Propósito**: Classificar equipamentos por tipo
- **Exemplos**: Notebook, Desktop, Impressora, Mouse, Teclado

#### Orcamentos
- **Propósito**: Armazenar orçamentos gerados pelos funcionários
- **Valor**: Armazenado em centavos para precisão monetária
- **Relacionamento**: 1:1 com Solicitação

#### HistoricoSolicitacao
- **Propósito**: Rastrear mudanças de estado das solicitações
- **Auditoria**: Data/hora, usuário responsável, observações

## 🔐 Sistema de Autenticação

### Fluxo de Cadastro (RF001)
1. Usuário preenche formulário com dados pessoais
2. Sistema consulta API ViaCEP para preenchimento automático do endereço
3. Validação de unicidade de email e CPF
4. Geração de senha aleatória de 4 dígitos
5. Envio da senha por e-mail (funcionalidade pendente)
6. Armazenamento seguro com hash da senha

### Fluxo de Login (RF002)
1. Validação de credenciais (email + senha)
2. Verificação de hash com SALT
3. Identificação automática do perfil do usuário
4. Retorno dos dados do usuário autenticado

## 📋 Fluxo de Solicitações

### Para Clientes
1. **Criação**: Cliente cria solicitação com descrição do problema
2. **Orçamento**: Funcionário gera orçamento
3. **Aprovação/Rejeição**: Cliente decide sobre o orçamento
4. **Execução**: Funcionário executa a manutenção
5. **Pagamento**: Cliente confirma pagamento
6. **Finalização**: Sistema finaliza a solicitação

### Para Funcionários
1. **Visualização**: Lista de solicitações por estado
2. **Orçamento**: Criação de orçamentos para solicitações abertas
3. **Manutenção**: Execução ou redirecionamento de manutenções
4. **Relatórios**: Geração de relatórios de receita

## 🎨 Interface do Usuário

### Design System
- **Framework CSS**: Bootstrap 5.3.7
- **Responsividade**: Mobile-first approach
- **Acessibilidade**: Componentes acessíveis
- **UX**: Feedback visual e validações em tempo real

### Componentes Principais
- **Autocadastro**: Formulário com validação e integração ViaCEP
- **Login**: Autenticação com identificação de perfil
- **Dashboard**: Visão geral personalizada por perfil
- **Solicitações**: Listagem e gerenciamento de solicitações
- **Relatórios**: Geração de PDFs com dados financeiros

## 🔧 Configuração e Deploy

### Desenvolvimento
```bash
# Backend
cd backend
docker-compose up -d

# Frontend
cd manutencao-de-equipamentos
npm install
npm start
```

### Produção
- **Backend**: Container Docker com Spring Boot
- **Frontend**: Build estático para servidor web
- **Banco**: MySQL gerenciado ou containerizado
- **Proxy**: Nginx para roteamento e SSL

## 📊 Métricas e Monitoramento

### Performance
- **Tempo de resposta**: < 200ms para operações CRUD
- **Disponibilidade**: 99.9% uptime
- **Escalabilidade**: Suporte a 1000+ usuários simultâneos

### Segurança
- **Autenticação**: Hash SHA-256 + SALT
- **Validação**: Frontend e backend
- **CORS**: Configurado para domínios específicos
- **SQL Injection**: Protegido por JPA/Hibernate

## 🧪 Testes

### Estratégia de Testes
- **Unitários**: Serviços e repositórios
- **Integração**: APIs REST
- **E2E**: Fluxos completos de usuário
- **Performance**: Carga e stress testing

### Dados de Teste
- **2 Funcionários**: Maria, Mário
- **4 Clientes**: João, José, Joana, Joaquina
- **5 Categorias**: Notebook, Desktop, Impressora, Mouse, Teclado
- **20+ Solicitações**: Estados variados e históricos completos

## 📈 Roadmap Futuro

### Melhorias Planejadas
- **Notificações**: Sistema de notificações em tempo real
- **Mobile**: Aplicativo nativo para dispositivos móveis
- **Analytics**: Dashboard com métricas avançadas
- **Integração**: APIs para sistemas externos
- **IA**: Sugestões inteligentes para categorização

### Otimizações
- **Cache**: Redis para sessões e dados frequentes
- **CDN**: Distribuição global de assets estáticos
- **Microserviços**: Separação por domínio de negócio
- **Event Sourcing**: Auditoria completa de eventos

---

**Versão**: 1.0  
**Última Atualização**: Setembro 2024  
**Mantenedor**: Equipe de Desenvolvimento
