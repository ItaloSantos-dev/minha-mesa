package com.italosantos.minha_mesa.dto.owner;

import com.italosantos.minha_mesa.model.UserModel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record CreateOwnerDTO(
        @CPF
        @NotBlank
        String cpf,

        @NotNull
        @Past
        LocalDate nasciment
) {
}
