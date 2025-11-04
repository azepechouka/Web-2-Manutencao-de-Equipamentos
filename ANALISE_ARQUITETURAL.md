# 🏗️ Análise Arquitetural - Sistema de Manutenção de Equipamentos

## 📋 Visão Geral do Sistema

O Sistema de Manutenção de Equipamentos é uma aplicação full-stack desenvolvida para gerenciar o ciclo completo de manutenção de equipamentos eletrônicos, desde a solicitação inicial até a finalização do serviço. A aplicação atende tanto clientes quanto funcionários, oferecendo interfaces específicas para cada perfil de usuário.

## 🎯 Objetivos do Sistema

### Objetivo Principal
Facilitar e automatizar o processo de manutenção de equipamentos eletrônicos, proporcionando uma experiência fluida tanto para clientes que solicitam serviços quanto para funcionários que executam as manutenções.

### Objetivos Específicos
- **Para Clientes**: Permitir solicitação fácil de manutenção, acompanhamento do status e aprovação de orçamentos
- **Para Funcionários**: Gerenciar solicitações, gerar orçamentos, executar manutenções e gerar relatórios
- **Para o Negócio**: Controlar receitas, categorizar equipamentos e manter histórico completo de serviços

## 🏛️ Arquitetura do Sistema

### Padrão Arquitetural
O sistema segue o padrão **MVC (Model-View-Controller)** com separação clara de responsabilidades:

- **Model**: Entidades JPA representando o domínio do negócio
- **View**: Interface Angular responsiva e interativa
- **Controller**: APIs REST do Spring Boot para comunicação

### Camadas da Aplicação

#### 1. Camada de Apresentação (Frontend)
- **Tecnologia**: Angular 18.2.0 com TypeScript
- **UI Framework**: Bootstrap 5.3.7
- **Arquitetura**: Standalone Components (Angular moderno)
- **Responsividade**: Mobile-first approach

#### 2. Camada de Negócio (Backend)
- **Tecnologia**: Spring Boot 3.5.5 com Java 21
- **Padrões**: Service Layer, Repository Pattern
- **Validação**: Bean Validation (JSR-303)
- **Segurança**: Spring Security com hash SHA-256

#### 3. Camada de Dados
- **SGBD**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **Migrações**: DDL automático com Hibernate
- **Índices**: Otimizados para consultas frequentes

## 🔄 Fluxo de Dados

### Fluxo de Solicitação de Manutenção
1. **Cliente** cria solicitação via interface web
2. **Frontend** valida dados e envia para API REST
3. **Backend** processa, valida e persiste no banco
4. **Sistema** notifica funcionários sobre nova solicitação
5. **Funcionário** gera orçamento e envia para cliente
6. **Cliente** aprova/rejeita orçamento
7. **Funcionário** executa manutenção
8. **Sistema** finaliza processo e gera relatórios

### Estados das Solicitações
```
ABERTA → ORCADA → APROVADA/REJEITADA → REDIRECIONADA → ARRUMADA → PAGA → FINALIZADA
```

## 🛡️ Segurança e Autenticação

### Estratégia de Segurança
- **Autenticação**: Baseada em email e senha
- **Autorização**: Controle por perfis (CLIENTE/FUNCIONARIO)
- **Criptografia**: SHA-256 com SALT para senhas
- **Sessão**: Armazenamento local no frontend

### Validações de Segurança
- Validação dupla (frontend + backend)
- Sanitização de inputs
- Proteção contra SQL Injection (JPA/Hibernate)
- CORS configurado para domínios específicos

## 📊 Modelo de Dados

### Entidades Principais

#### Usuario
- Representa clientes e funcionários
- Campos únicos: email, cpf
- Relacionamento com Perfil e Endereco
- Auditoria com timestamps

#### Solicitacao
- Central do sistema de manutenção
- Relacionamentos com Usuario, Categoria, Estado
- Índices otimizados para consultas
- Histórico completo de mudanças

#### Categoria
- Classificação de equipamentos
- Soft delete para preservar histórico
- Relacionamento com Solicitações

### Relacionamentos
- **Usuario** 1:N **Solicitacao** (cliente)
- **Categoria** 1:N **Solicitacao**
- **Solicitacao** 1:1 **Orcamento**
- **Solicitacao** 1:N **HistoricoSolicitacao**

## 🚀 Tecnologias e Dependências

### Backend Stack
- **Java 21**: Linguagem principal
- **Spring Boot 3.5.5**: Framework base
- **Spring Security**: Autenticação e autorização
- **Spring Data JPA**: Persistência de dados
- **MySQL 8.0**: Banco de dados
- **Lombok**: Redução de boilerplate
- **Docker**: Containerização

### Frontend Stack
- **Angular 18.2.0**: Framework SPA
- **TypeScript 5.5.2**: Linguagem tipada
- **Bootstrap 5.3.7**: UI Framework
- **RxJS**: Programação reativa
- **jsPDF**: Geração de relatórios

## 📈 Performance e Escalabilidade

### Otimizações Implementadas
- **Índices de Banco**: Otimizados para consultas frequentes
- **Lazy Loading**: Carregamento sob demanda de relacionamentos
- **Paginação**: Para listagens grandes
- **Cache Local**: Dados de sessão no frontend

### Limitações Atuais
- Arquitetura monolítica
- Sem cache distribuído
- Processamento síncrono
- Sem balanceamento de carga

## 🔧 Configuração e Deploy

### Ambiente de Desenvolvimento
- **Docker Compose**: Orquestração de serviços
- **Hot Reload**: Desenvolvimento ágil
- **Logs Estruturados**: Debug facilitado
- **Banco de Dados**: Containerizado

### Ambiente de Produção
- **Containerização**: Docker para deploy
- **Banco Gerenciado**: MySQL em produção
- **Proxy Reverso**: Nginx para roteamento
- **SSL/TLS**: Certificados de segurança

## 📋 Funcionalidades Implementadas

### Módulo de Autenticação
- ✅ Cadastro de usuários com validação
- ✅ Login com verificação de credenciais
- ✅ Controle de perfis e permissões
- ✅ Integração com ViaCEP para endereços

### Módulo de Solicitações
- ✅ Criação de solicitações de manutenção
- ✅ Acompanhamento de status em tempo real
- ✅ Histórico completo de mudanças
- ✅ Notificações automáticas

### Módulo de Orçamentos
- ✅ Geração de orçamentos por funcionários
- ✅ Aprovação/rejeição por clientes
- ✅ Cálculo automático de valores
- ✅ Relatórios financeiros

### Módulo de Relatórios
- ✅ Relatórios de receita por período
- ✅ Análise por categorias de equipamentos
- ✅ Exportação em PDF
- ✅ Dashboards interativos

## 🎨 Interface do Usuário

### Design System
- **Framework**: Bootstrap 5.3.7
- **Responsividade**: Mobile-first
- **Acessibilidade**: Componentes semânticos
- **UX**: Feedback visual e validações

### Componentes Principais
- **Formulários**: Validação em tempo real
- **Tabelas**: Paginação e filtros
- **Modais**: Confirmações e detalhes
- **Navegação**: Menu contextual por perfil

## 🔍 Monitoramento e Logs

### Estratégia de Logs
- **Níveis**: INFO, WARN, ERROR
- **Formato**: Estruturado para análise
- **Rotação**: Automática por tamanho/tempo
- **Contexto**: Usuário, operação, timestamp

### Métricas Importantes
- **Performance**: Tempo de resposta das APIs
- **Erros**: Taxa de erro por endpoint
- **Uso**: Número de usuários ativos
- **Negócio**: Solicitações por período

## 🚧 Limitações e Melhorias Futuras

### Limitações Atuais
- Senhas de 4 dígitos (segurança limitada)
- Sem recuperação de senha
- Validação de CPF apenas por formato
- Configurações hardcoded

### Melhorias Planejadas
- **Segurança**: JWT, validação matemática de CPF
- **Performance**: Cache Redis, CDN
- **Monitoramento**: APM, alertas
- **Integração**: APIs externas, webhooks

## 📚 Documentação e Manutenção

### Documentação Disponível
- **Técnica**: Arquitetura e implementação
- **Execução**: Guias de instalação e uso
- **Suposições**: Decisões de projeto
- **API**: Endpoints e contratos

### Estratégia de Manutenção
- **Versionamento**: Git com branches
- **Testes**: Unitários e integração
- **Deploy**: Pipeline automatizado
- **Backup**: Diário do banco de dados

---

**Versão da Análise**: 1.0  
**Data**: Dezembro 2024  
**Autor**: Equipe de Desenvolvimento  
**Status**: Documentação Atualizada
