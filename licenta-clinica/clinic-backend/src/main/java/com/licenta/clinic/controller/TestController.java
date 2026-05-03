package com.licenta.clinic.controller;

import com.licenta.clinic.model.Role;
import com.licenta.clinic.repository.RoleRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final RoleRepository roleRepository;
    private final MongoTemplate mongoTemplate;

    public TestController(RoleRepository roleRepository, MongoTemplate mongoTemplate) {
        this.roleRepository = roleRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/db")
    public String db() {
        return mongoTemplate.getDb().getName();
    }

    @PostMapping("/role")
    public Role createRole(@RequestBody Role role) {
        System.out.println("Saving role in DB = " + mongoTemplate.getDb().getName());
        return roleRepository.save(role);
    }

    @GetMapping("/hello")
    public String hello() {
        return "OK";
    }
}