FROM maven:3.9.9-eclipse-temurin-21

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

# Find actual jar and run it
CMD ["sh", "-c", "java -jar target/*.jar"]