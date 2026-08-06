package com.italosantos.minha_mesa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MinhaMesaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MinhaMesaApplication.class, args);
	}

}
