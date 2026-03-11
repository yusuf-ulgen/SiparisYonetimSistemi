# 1. Aşama: Uygulamayı derleme (Build)
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Aşama: Uygulamayı çalıştırma (Run)
# 'openjdk' yerine güncel ve güvenilir 'eclipse-temurin' kullanıyoruz
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# RAM limitini yönetmek için -Xmx300m hâlâ kritik
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]
