# 🚀 Guia de Instalação Detalhado - Sistema de Manutenção de Equipamentos

## 📋 Pré-requisitos

### Software Necessário
- **Java 21** - [Download Adoptium](https://adoptium.net/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **Docker Desktop** - [Download Docker](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download Git](https://git-scm.com/)
- **IDE Recomendado**: IntelliJ IDEA, VS Code ou Eclipse

### Verificação de Instalação
```bash
# Verificar Java
java --version
# Deve mostrar: openjdk 21.x.x

# Verificar Node.js
node --version
# Deve mostrar: v18.x.x ou superior

# Verificar Docker
docker --version
# Deve mostrar: Docker version 24.x.x

# Verificar Docker Compose
docker-compose --version
# Deve mostrar: Docker Compose version 2.x.x
```

## 🏗️ Configuração do Ambiente

### 1. Clone do Repositório
```bash
git clone <url-do-repositorio>
cd web2
```

### 2. Configuração do Backend

#### 2.1. Arquivo de Ambiente
Crie o arquivo `.env` na pasta `backend/`:
```bash
cd backend
```

Crie o arquivo `.env` com o seguinte conteúdo:
```env
# Configurações do MySQL
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=manutencao_equipamentos
MYSQL_USER=manutencao_user
MYSQL_PASSWORD=manutencao123

# Configurações da aplicação Spring Boot
SPRING_PROFILES_ACTIVE=docker
```

#### 2.2. Inicialização do Backend
```bash
# Iniciar containers Docker
docker-compose up -d

# Verificar logs do banco de dados
docker-compose logs -f db

# Verificar logs da aplicação
docker-compose logs -f app
```

#### 2.3. Verificação do Backend
- **URL**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health
- **API Docs**: http://localhost:8080/swagger-ui.html (se configurado)

### 3. Configuração do Frontend

#### 3.1. Instalação de Dependências
```bash
cd manutencao-de-equipamentos
npm install
```

#### 3.2. Configuração de Proxy (Opcional)
Crie o arquivo `proxy.conf.json` na raiz do projeto frontend:
```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

#### 3.3. Inicialização do Frontend
```bash
# Desenvolvimento
npm start
# ou
ng serve

# Com proxy
ng serve --proxy-config proxy.conf.json
```

#### 3.4. Verificação do Frontend
- **URL**: http://localhost:4200
- **Hot Reload**: Ativado automaticamente

## 🗄️ Configuração do Banco de Dados

### 1. Estrutura Inicial
O banco é criado automaticamente pelo Docker Compose com:
- **Host**: localhost
- **Porta**: 3306
- **Database**: manutencao_equipamentos
- **Usuário**: manutencao_user
- **Senha**: manutencao123

### 2. Dados de Teste
Execute o script de inicialização (se disponível):
```sql
-- Inserir estados de solicitação
INSERT INTO estados_solicitacao (codigo, nome, cor_hex) VALUES
('ABERTA', 'Aberta', '#6c757d'),
('ORCADA', 'Orçada', '#8b4513'),
('APROVADA', 'Aprovada', '#ffc107'),
('REJEITADA', 'Rejeitada', '#dc3545'),
('REDIRECIONADA', 'Redirecionada', '#6f42c1'),
('ARRUMADA', 'Arrumada', '#007bff'),
('PAGA', 'Paga', '#fd7e14'),
('FINALIZADA', 'Finalizada', '#28a745');

-- Inserir categorias
INSERT INTO categorias (nome, descricao, ativo) VALUES
('Notebook', 'Computadores portáteis', true),
('Desktop', 'Computadores de mesa', true),
('Impressora', 'Equipamentos de impressão', true),
('Mouse', 'Dispositivos de entrada', true),
('Teclado', 'Dispositivos de entrada', true);
```

## 🔧 Configurações Avançadas

### 1. Configuração de E-mail (Para RF001)
Adicione no `application.properties`:
```properties
# Configuração de e-mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu-email@gmail.com
spring.mail.password=sua-senha-app
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 2. Configuração de CORS
No `application.properties`:
```properties
# CORS Configuration
cors.allowed-origins=http://localhost:4200
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
```

### 3. Configuração de Logs
No `application.properties`:
```properties
# Logging Configuration
logging.level.com.Manutencao=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

## 🧪 Testes e Validação

### 1. Testes Unitários
```bash
# Backend
cd backend
./mvnw test

# Frontend
cd manutencao-de-equipamentos
npm test
```

### 2. Testes de Integração
```bash
# Backend
cd backend
./mvnw integration-test
```

### 3. Testes E2E
```bash
# Frontend
cd manutencao-de-equipamentos
npm run e2e
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Conexão com Banco
```bash
# Verificar se o MySQL está rodando
docker-compose ps

# Reiniciar containers
docker-compose down
docker-compose up -d

# Verificar logs
docker-compose logs db
```

#### 2. Erro de Porta em Uso
```bash
# Verificar processos usando as portas
netstat -ano | findstr :8080
netstat -ano | findstr :4200
netstat -ano | findstr :3306

# Matar processo (Windows)
taskkill /PID <PID> /F
```

#### 3. Erro de Dependências Node
```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

#### 4. Erro de Compilação Java
```bash
# Limpar e recompilar
./mvnw clean compile

# Verificar versão do Java
java --version
```

### Logs Importantes

#### Backend
```bash
# Logs da aplicação
docker-compose logs -f app

# Logs do banco
docker-compose logs -f db

# Logs completos
docker-compose logs
```

#### Frontend
```bash
# Logs do Angular
ng serve --verbose

# Logs do build
ng build --verbose
```

## 📊 Monitoramento

### 1. Health Checks
- **Backend**: http://localhost:8080/actuator/health
- **Frontend**: http://localhost:4200 (verificar console do navegador)

### 2. Métricas de Performance
- **Tempo de resposta**: < 200ms
- **Uso de memória**: < 512MB
- **CPU**: < 50%

### 3. Logs de Aplicação
- **Nível DEBUG**: Para desenvolvimento
- **Nível INFO**: Para produção
- **Rotação**: Diária, 30 dias de retenção

## 🔄 Atualizações

### 1. Atualização do Código
```bash
# Pull das mudanças
git pull origin main

# Rebuild do backend
docker-compose down
docker-compose up --build -d

# Rebuild do frontend
npm install
npm start
```

### 2. Atualização de Dependências
```bash
# Backend
./mvnw versions:display-dependency-updates

# Frontend
npm outdated
npm update
```

---

**Versão**: 1.0  
**Última Atualização**: Setembro 2024  
**Suporte**: Equipe de Desenvolvimento
