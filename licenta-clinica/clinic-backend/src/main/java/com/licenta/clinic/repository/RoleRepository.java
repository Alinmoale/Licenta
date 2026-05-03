package com.licenta.clinic.repository;

import com.licenta.clinic.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoleRepository extends MongoRepository<Role, String> {
}
