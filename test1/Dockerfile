# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/test1-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8082

# Set the entry point to run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]