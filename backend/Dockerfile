# Etapa de build
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

# Etapa de runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
# Ajuste o nome do jar final conforme o seu pom.xml
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-XX:+UseZGC","-XX:InitialRAMPercentage=50.0","-XX:MaxRAMPercentage=75.0","-jar","/app/app.jar"]
