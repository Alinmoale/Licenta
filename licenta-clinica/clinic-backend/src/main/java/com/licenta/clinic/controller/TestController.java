package com.licenta.clinic.controller;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final MongoTemplate mongoTemplate;

    public TestController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/db")
    public String db() {
        return mongoTemplate.getDb().getName();
    }

    @GetMapping("/hello")
    public String hello() {
        return "OK";
    }
}
