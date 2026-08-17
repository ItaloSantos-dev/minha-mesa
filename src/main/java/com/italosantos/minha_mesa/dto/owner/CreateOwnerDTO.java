package com.italosantos.minha_mesa.dto.owner;

import com.italosantos.minha_mesa.model.UserModel;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record CreateOwnerDTO(
        @CPF
        @NotBlank
        String cpf,

        @NotNull
        @Past
        LocalDate nasciment,

        @NotBlank
        String name,

        @NotBlank
        String phone,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(min = 8)
        String password
) {
}
