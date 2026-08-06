FROM eclipse-temurin:21
LABEL authors="Italo-Santos"
WORKDIR /app
COPY target/minha-mesa-0.0.1-SNAPSHOT.jar /app/minha-mesa.jar
ENTRYPOINT ["java", "-jar", "minha-mesa.jar"]