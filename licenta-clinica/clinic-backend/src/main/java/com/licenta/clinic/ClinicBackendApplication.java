package com.licenta.clinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class ClinicBackendApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(ClinicBackendApplication.class, args);

        Environment env = context.getEnvironment();

        System.out.println("APP STARTED WITH MEDICAL CLINIC DB CONFIG");
        System.out.println("MONGO DATABASE = " + env.getProperty("spring.data.mongodb.database"));
    }
}