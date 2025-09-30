# 📝 Suposições do Projeto - Sistema de Manutenção de Equipamentos

## 🎯 Suposições de Negócio

### 1. **Gestão de Usuários**
- **Suposição**: O sistema não possui sistema de recuperação de senha, pois as senhas são geradas automaticamente pelo sistema
- **Justificativa**: Simplifica o fluxo de cadastro e garante que apenas o sistema conheça as senhas
- **Impacto**: Usuários devem entrar em contato com suporte para recuperação de senha

### 2. **Estados das Solicitações**
- **Suposição**: Uma solicitação pode ser redirecionada infinitas vezes entre funcionários
- **Justificativa**: Permite flexibilidade na distribuição de trabalho
- **Impacto**: Pode gerar histórico extenso, mas garante que nenhuma solicitação fique "perdida"

### 3. **Valores Monetários**
- **Suposição**: Todos os valores são armazenados em centavos para evitar problemas de precisão decimal
- **Justificativa**: Evita erros de arredondamento em cálculos financeiros
- **Impacto**: Necessário conversão na interface (centavos → reais)

### 4. **Categorias de Equipamentos**
- **Suposição**: Categorias são soft-deleted (desativação) em vez de remoção física
- **Justificativa**: Preserva histórico de solicitações já categorizadas
- **Impacto**: Categorias inativas não aparecem em novos cadastros, mas permanecem no histórico

## 🔧 Suposições Técnicas

### 1. **Autenticação e Autorização**
- **Suposição**: Sistema não implementa JWT ou sessões persistentes
- **Justificativa**: Simplifica o desenvolvimento e atende aos requisitos básicos
- **Impacto**: Usuários precisam fazer login a cada sessão

### 2. **Integração com ViaCEP**
- **Suposição**: API ViaCEP está sempre disponível e retorna dados válidos
- **Justificativa**: API gratuita e confiável do governo brasileiro
- **Impacto**: Se a API estiver indisponível, usuário deve preencher endereço manualmente

### 3. **Geração de Senhas**
- **Suposição**: Senhas de 4 dígitos são suficientes para segurança básica
- **Justificativa**: Atende ao requisito específico do projeto
- **Impacto**: Nível de segurança limitado, adequado para ambiente controlado

### 4. **Envio de E-mail**
- **Suposição**: Sistema de e-mail será implementado com SMTP simples
- **Justificativa**: Solução padrão e confiável para notificações
- **Impacto**: Dependência de serviço de e-mail externo

## 📊 Suposições de Dados

### 1. **Formato de Datas**
- **Suposição**: Todas as datas são armazenadas em UTC e convertidas para fuso horário brasileiro
- **Justificativa**: Padrão internacional para aplicações web
- **Impacto**: Necessário conversão para exibição no frontend

### 2. **Validação de CPF**
- **Suposição**: Validação de CPF é feita apenas no formato (11 dígitos)
- **Justificativa**: Simplifica a implementação
- **Impacto**: Não valida se o CPF é matematicamente válido

### 3. **Telefones**
- **Suposição**: Telefones são armazenados como string sem formatação
- **Justificativa**: Flexibilidade para diferentes formatos
- **Impacto**: Formatação deve ser feita na interface

### 4. **Endereços**
- **Suposição**: Endereços são armazenados como texto completo, não normalizados
- **Justificativa**: Preserva exatamente o que o usuário informou
- **Impacto**: Pode haver inconsistências na nomenclatura de ruas/cidades

## 🎨 Suposições de Interface

### 1. **Responsividade**
- **Suposição**: Interface funciona bem em dispositivos móveis e desktop
- **Justificativa**: Bootstrap 5 garante responsividade básica
- **Impacto**: Pode necessitar ajustes específicos para mobile

### 2. **Acessibilidade**
- **Suposição**: Componentes Bootstrap atendem aos padrões básicos de acessibilidade
- **Justificativa**: Framework maduro com boas práticas
- **Impacto**: Pode necessitar melhorias específicas para WCAG

### 3. **Navegadores**
- **Suposição**: Sistema funciona em navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Justificativa**: Angular 18 tem suporte amplo
- **Impacto**: Pode não funcionar em navegadores muito antigos

## 🔒 Suposições de Segurança

### 1. **Criptografia de Senhas**
- **Suposição**: SHA-256 + SALT é suficiente para o contexto do projeto
- **Justificativa**: Algoritmo amplamente usado e confiável
- **Impacto**: Adequado para ambiente controlado, mas não para dados sensíveis

### 2. **Validação de Dados**
- **Suposição**: Validação no frontend e backend é suficiente
- **Justificativa**: Dupla camada de validação
- **Impacto**: Pode ser contornada por usuários técnicos

### 3. **CORS**
- **Suposição**: CORS configurado para permitir localhost:4200
- **Justificativa**: Ambiente de desenvolvimento
- **Impacto**: Necessário ajuste para produção

## 📈 Suposições de Performance

### 1. **Concorrência**
- **Suposição**: Sistema suporta até 100 usuários simultâneos
- **Justificativa**: Estimativa baseada no hardware padrão
- **Impacto**: Pode necessitar otimizações para maior carga

### 2. **Tamanho de Dados**
- **Suposição**: Banco de dados não excederá 1GB
- **Justificativa**: Aplicação de pequeno/médio porte
- **Impacto**: Pode necessitar otimizações de consulta

### 3. **Tempo de Resposta**
- **Suposição**: Operações CRUD respondem em menos de 200ms
- **Justificativa**: Aplicação local com banco otimizado
- **Impacto**: Pode degradar com crescimento de dados

## 🚀 Suposições de Deploy

### 1. **Ambiente de Produção**
- **Suposição**: Sistema será deployado em servidor Linux com Docker
- **Justificativa**: Padrão da indústria para aplicações web
- **Impacto**: Necessário conhecimento de Docker e Linux

### 2. **Banco de Dados**
- **Suposição**: MySQL será usado em produção
- **Justificativa**: Banco relacional robusto e amplamente suportado
- **Impacto**: Necessário backup e manutenção do banco

### 3. **Monitoramento**
- **Suposição**: Logs básicos são suficientes para monitoramento
- **Justificativa**: Aplicação de pequeno porte
- **Impacto**: Pode necessitar ferramentas mais avançadas

## 🔄 Suposições de Manutenção

### 1. **Atualizações**
- **Suposição**: Sistema será atualizado mensalmente
- **Justificativa**: Ciclo de desenvolvimento ágil
- **Impacto**: Necessário processo de deploy bem definido

### 2. **Backup**
- **Suposição**: Backup diário do banco de dados é suficiente
- **Justificativa**: Dados não críticos para operação contínua
- **Impacto**: Pode haver perda de dados se backup falhar

### 3. **Suporte**
- **Suposição**: Suporte será fornecido durante horário comercial
- **Justificativa**: Aplicação interna
- **Impacto**: Problemas fora do horário podem não ser resolvidos imediatamente

## 📋 Suposições de Requisitos

### 1. **Funcionalidades Futuras**
- **Suposição**: Sistema não precisará de integração com sistemas externos
- **Justificativa**: Aplicação standalone
- **Impacto**: Pode necessitar refatoração para integrações

### 2. **Escalabilidade**
- **Suposição**: Sistema não precisará escalar horizontalmente
- **Justificativa**: Usuário base limitado
- **Impacto**: Pode necessitar arquitetura de microserviços

### 3. **Compliance**
- **Suposição**: Sistema não precisa atender a regulamentações específicas
- **Justificativa**: Aplicação interna
- **Impacto**: Pode necessitar ajustes para conformidade

---

**Documento aprovado por**: Equipe de Desenvolvimento  
**Data**: Setembro 2024  
**Versão**: 1.0  
**Próxima revisão**: Dezembro 2024
