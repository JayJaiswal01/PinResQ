# Use Java 17
FROM openjdk:17-jdk-slim

# Copy project
WORKDIR /app
COPY . .

# Build
RUN apt-get update && apt-get install -y maven
RUN mvn clean install

# Run
CMD ["java", "-jar", "target/*.jar"]