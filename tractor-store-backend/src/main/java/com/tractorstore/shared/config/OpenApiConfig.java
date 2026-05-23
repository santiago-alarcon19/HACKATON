package com.tractorstore.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  OpenAPI tractorStoreOpenApi() {
    return new OpenAPI()
        .info(
            new Info()
                .title("Tractor Store API")
                .version("1.0")
                .description("Modular monolith backend for the Tractor Store hackathon"));
  }
}
