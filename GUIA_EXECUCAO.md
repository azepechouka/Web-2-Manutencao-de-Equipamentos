# Guia de Execução - Sistema de Manutenção de Equipamentos

Este projeto é um sistema full-stack composto por:
- **Backend**: Spring Boot (Java 21) com MySQL
- **Frontend**: Angular 18
- **Banco de dados**: MySQL 8.0

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

1. **Java 21** - [Download aqui](https://adoptium.net/)
2. **Node.js 18+** - [Download aqui](https://nodejs.org/)
3. **Docker e Docker Compose** - [Download aqui](https://www.docker.com/products/docker-desktop/)
4. **Maven** (opcional, pois o projeto usa Maven Wrapper)

## Passo 1: Configurar o arquivo .env

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
# Configurações do MySQL
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=manutencao_equipamentos
MYSQL_USER=manutencao_user
MYSQL_PASSWORD=manutencao123

# Configurações da aplicação Spring Boot
SPRING_PROFILES_ACTIVE=docker
```

## Passo 2: Executar o Backend (Spring Boot)

### Opção A: Usando Docker Compose (Recomendado)

1. Navegue até a pasta do backend:
```bash
cd Web-2-Manutencao-de-Equipamentos/backend
```

2. Execute o Docker Compose:
```bash
docker-compose up -d
```

Isso irá:
- Iniciar o MySQL 8.0 na porta 3306
- Compilar e executar a aplicação Spring Boot na porta 8080

### Opção B: Execução Local

1. Certifique-se de ter o MySQL rodando localmente
2. Configure as credenciais no arquivo `application.properties`
3. Execute:
```bash
cd Web-2-Manutencao-de-Equipamentos/backend
./mvnw spring-boot:run
```

## Passo 3: Executar o Frontend (Angular)

1. Navegue até a pasta do frontend:
```bash
cd Web-2-Manutencao-de-Equipamentos/manutencao-de-equipamentos
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm start
```

O frontend estará disponível em: `http://localhost:4200`

## Verificação da Execução

### Backend
- **URL**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health (se configurado)

### Frontend
- **URL**: http://localhost:4200

### Banco de Dados
- **Host**: localhost
- **Porta**: 3306
- **Database**: manutencao_equipamentos
- **Usuário**: manutencao_user
- **Senha**: manutencao123

## Comandos Úteis

### Parar os serviços Docker
```bash
cd Web-2-Manutencao-de-Equipamentos/backend
docker-compose down
```

### Ver logs do backend
```bash
docker-compose logs -f app
```

### Ver logs do banco de dados
```bash
docker-compose logs -f db
```

### Rebuild da aplicação
```bash
docker-compose down
docker-compose up --build -d
```

## Estrutura do Projeto

```
Web-2-Manutencao-de-Equipamentos/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/         # Código Java
│   ├── src/main/resources/    # Configurações
│   ├── docker-compose.yaml    # Configuração Docker
│   └── Dockerfile            # Imagem Docker
├── manutencao-de-equipamentos/ # Angular Frontend
│   ├── src/app/              # Código Angular
│   ├── package.json          # Dependências Node.js
│   └── angular.json          # Configuração Angular
└── README.md
```

## Solução de Problemas

### Erro de conexão com o banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se a porta 3306 está disponível

### Erro no frontend
- Execute `npm install` novamente
- Verifique se o Node.js está na versão 18+
- Limpe o cache: `npm cache clean --force`

### Erro no backend
- Verifique se o Java 21 está instalado
- Confirme se o Maven está funcionando: `./mvnw --version`
- Verifique os logs: `docker-compose logs app`

## Desenvolvimento

Para desenvolvimento ativo:

1. O backend suporta hot-reload com Spring DevTools
2. O frontend suporta hot-reload com Angular CLI
3. As mudanças no código são refletidas automaticamente

## Produção

Para deploy em produção, considere:
- Configurar variáveis de ambiente adequadas
- Usar um banco de dados gerenciado
- Configurar HTTPS
- Implementar monitoramento e logs




