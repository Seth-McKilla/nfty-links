#
# Package stage
#
FROM adoptopenjdk/openjdk11
COPY dependencies/ ./
COPY snapshot-dependencies/ ./
COPY spring-boot-loader/ ./
COPY internal-dependencies/ ./
COPY application/ ./
EXPOSE 8082
ENTRYPOINT ["java","org.springframework.boot.loader.JarLauncher"]
