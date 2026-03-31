package ru.itis.backend;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ModularityTests {

    ApplicationModules modules = ApplicationModules.of(BackendApplication.class);

    @Test
    void verifyArchitecture() {
        System.out.println(modules);
        modules.verify();
    }

}
