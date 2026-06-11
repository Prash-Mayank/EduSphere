# ── Stage 1: Build the WAR ──────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app
COPY pom.xml .
# Download dependencies first (layer cache)
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn clean package -q -DskipTests

# ── Stage 2: Run on Tomcat 10 ───────────────────────────────────────────────
FROM tomcat:10.1-jdk17

# Remove default Tomcat apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the WAR as ROOT.war so it's served at /  (not /edusphere-api)
COPY --from=builder /app/target/edusphere-api.war /usr/local/tomcat/webapps/ROOT.war

# Render passes PORT env var; Tomcat default is 8080 which matches
EXPOSE 8080

CMD ["catalina.sh", "run"]
