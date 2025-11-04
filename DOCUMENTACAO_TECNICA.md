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

## 🆕 Novas Funcionalidades e Melhorias (Atualização 2025)

### Módulo de Categorias de Equipamentos

#### Gerenciamento Completo de Categorias
O sistema agora possui um módulo dedicado para gerenciamento de categorias de equipamentos, permitindo CRUD completo através de interface administrativa.

**Backend - CategoriaController**
- **Endpoint**: `/api/categorias`
- **Métodos**: GET (listar todas), GET /{id} (buscar por ID), POST (criar), PUT /{id} (atualizar)
- **Validação**: Verificação de unicidade por nome (case-insensitive)
- **DTOs**: CategoriaRequest (entrada) e CategoriaResponse (saída)
- **Mappers**: CategoriaMapper para conversão entre entidades e DTOs

**Frontend - CategoriasEquipamentoComponent**
- Interface para cadastro, edição e listagem de categorias
- Validação em tempo real com feedback visual
- Ordenação alfabética automática das categorias
- Integração com backend via HTTP requests

**Serviço - CategoriaEquipamentoService**
- Gerenciamento de estado reativo com RxJS BehaviorSubject
- Cache local em localStorage para performance
- Seed inicial com categorias padrão (Impressora, Notebook, Desktop, Roteador, Scanner)
- Validação de unicidade antes de adicionar/atualizar

### Módulo de Orçamentos

#### Sistema de Orçamentos Aprimorado
Implementação completa do fluxo de orçamentos com persistência e histórico detalhado.

**Backend - OrcamentoService**
- Criação de orçamentos vinculados a solicitações
- Armazenamento de valores em centavos para precisão monetária
- Suporte a observações e notas do funcionário
- Relacionamento 1:1 com Solicitação

**Frontend - EfetuarOrcamentoComponent**
- Formulário para criação de orçamentos por funcionários
- Validação de valores monetários
- Campo para observações opcionais
- Integração com visualização de solicitação

**Serviço - OrcamentosService**
- Gerenciamento de estado reativo com BehaviorSubject
- Filtragem por período (data início e fim)
- Métodos auxiliares para listagem e adição
- Suporte a múltiplas moedas (padrão BRL)

### Dashboard de Funcionário

#### Home Funcional para Funcionários
Novo componente dedicado para a área de trabalho dos funcionários, oferecendo visão centralizada das solicitações em aberto.

**FuncHomeComponent**
- Listagem de solicitações pendentes de orçamento
- Visualização rápida de informações essenciais (cliente, equipamento, data)
- Ações rápidas: criar orçamento ou visualizar detalhes
- Estados de carregamento e tratamento de erros
- Integração com roteamento para outras funcionalidades

**Funcionalidades**
- Acesso rápido a solicitações que precisam de orçamento
- Navegação direta para criação de orçamento
- Visualização detalhada de cada solicitação
- Interface responsiva e otimizada para uso profissional

### Sistema de Relatórios Expandido

#### Relatório de Receita
**RelatorioReceitaComponent**
- Geração de relatórios financeiros por período
- Filtros por data de início e fim
- Exportação em PDF usando jsPDF
- Visualização de receita total e detalhamento por orçamento
- Formatação monetária brasileira (BRL)

#### Relatório por Categorias
**RelatorioCategoriasComponent**
- Análise de solicitações e receitas por categoria de equipamento
- Agrupamento estatístico por tipo de equipamento
- Métricas de quantidade de serviços por categoria
- Visualização de distribuição de receita
- Exportação em PDF com gráficos e tabelas

#### Relatório Individual de Categoria
**RelatorioCategoriaComponent**
- Detalhamento específico de uma categoria
- Histórico completo de serviços por categoria
- Análise de tendências e padrões
- Métricas de performance por tipo de equipamento

### Gerenciamento de Solicitações

#### Listagem Unificada de Solicitações
**SolicitacoesListaComponent**
- Visualização consolidada de todas as solicitações
- Filtros por status e período
- Busca por cliente ou equipamento
- Paginação para grandes volumes de dados
- Ações contextuais baseadas no status da solicitação

#### Visualização Detalhada
**VisualizarServicoComponent**
- Interface aprimorada para visualização de solicitações
- Exibição completa do histórico de mudanças
- Informações detalhadas do cliente e equipamento
- Status visual com indicadores coloridos
- Ações disponíveis baseadas no perfil do usuário

### Melhorias no Sistema de Autenticação

#### AuthService Aprimorado
**Novas Funcionalidades**
- Suporte a múltiplos perfis (FUNCIONARIO, USUARIO)
- Método `hasPerfil()` para verificação de permissões
- Método `getUsuarioId()` para obter ID numérico
- Persistência melhorada no localStorage
- Mapeamento automático de perfis do backend

**Backend - AuthService**
- Integração com EmailService para envio de senhas
- Geração segura de senhas com SecureRandom
- Validação aprimorada de CPF e email
- Suporte a endereços completos no cadastro
- Gerenciamento de perfis com PerfilRepository

### Serviços de Email

#### EmailService Implementado
**Funcionalidades**
- Envio de emails com senhas temporárias
- Template de email para cadastro
- Integração com servidor SMTP configurável
- Tratamento de erros e logs de envio
- Suporte a HTML e texto plano

**Configuração**
- Configuração via application.properties
- Suporte a múltiplos provedores de email
- Autenticação segura com credenciais
- Timeout configurável para envios

### Gerenciamento de Usuários

#### UsuarioService e Controller
**Backend - UsuarioController**
- Endpoint `/api/usuarios/funcionarios` para listagem
- Endpoint POST para cadastro de funcionários
- DTOs específicos: FuncionarioRequest e FuncionarioResponse
- Validação completa de dados de entrada

**Funcionalidades**
- Listagem de todos os funcionários cadastrados
- Cadastro de novos funcionários com validação
- Gerenciamento de endereços e dados pessoais
- Integração com sistema de perfis

### Melhorias na Estrutura de Dados

#### Novos Modelos
- **EnderecoModel**: Modelo completo para endereços com CEP
- **CategoriaEquipamentoModel**: Modelo para categorias
- **PerfilModel**: Modelo para perfis de usuário
- **UsuarioCreateDto**: DTO específico para criação de usuários

#### Refatoração de Modelos
- **OrcamentoModel**: Renomeado de orcamento.models.ts para orcamento.model.ts
- **UsuarioModel**: Expandido com novos campos e relacionamentos
- **EnderecoModel**: Separação em entidade própria com relacionamento

### Configurações e Seeders

#### Configuração de Perfis
**PerfilSeederConfig**
- Inicialização automática de perfis do sistema
- Criação de perfis padrão (CLIENTE, FUNCIONARIO)
- Execução automática na inicialização da aplicação

#### Configuração de Usuários Iniciais
**UsuarioSeederConfig**
- Criação de usuários de teste automaticamente
- Funcionários padrão (Maria, Mário)
- Clientes de exemplo com dados completos
- Integração com sistema de perfis

#### Configuração de Segurança
**SecurityConfig**
- Configuração de CORS atualizada
- Regras de autorização por endpoint
- Proteção de rotas sensíveis
- Integração com Spring Security

### Melhorias de Interface

#### Componente Topbar Aprimorado
- Navegação contextual baseada em perfil
- Menu dinâmico com opções específicas por tipo de usuário
- Indicador de usuário logado
- Botão de logout com confirmação
- Estilos atualizados com Bootstrap 5.3.7

#### Componente Home Atualizado
- Dashboard personalizado por perfil
- Cards informativos com estatísticas
- Links rápidos para ações principais
- Visualização de solicitações recentes
- Interface responsiva e moderna

### Novas Rotas e Navegação

#### Rotas Adicionadas
- `/home-func`: Dashboard de funcionário
- `/efetuar-orcamento/:id`: Criação de orçamento
- `/listaSolicitacoes`: Lista completa de solicitações
- `/cadastrarcategoria`: Gerenciamento de categorias
- `/relatorio-categoria`: Relatórios por categoria
- `/relatorio-categorias`: Relatório consolidado de categorias

### Arquitetura e Padrões

#### Mappers Implementados
- **CategoriaMapper**: Conversão entre entidades e DTOs de categoria
- **RequestMapper**: Mapeamento de requisições para entidades
- Padrão de mapeamento centralizado e reutilizável

#### Repositórios Adicionados
- **CategoriaRepository**: Acesso a dados de categorias
- **EnderecoRepository**: Gerenciamento de endereços
- **HistoricoSolicitacaoRepository**: Histórico de mudanças
- **PerfilRepository**: Gerenciamento de perfis

### Performance e Otimizações

#### Melhorias Implementadas
- Cache local em serviços frontend (localStorage)
- Lazy loading de componentes Angular
- Otimização de queries no backend
- Redução de chamadas HTTP desnecessárias
- Paginação em listagens grandes

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

**Versão**: 2.0  
**Última Atualização**: Janeiro 2025  
**Mantenedor**: Equipe de Desenvolvimento
