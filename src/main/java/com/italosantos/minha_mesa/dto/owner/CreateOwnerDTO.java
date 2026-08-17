package com.italosantos.minha_mesa.dto.owner;

import com.italosantos.minha_mesa.dto.auth.RegisterRequestDTO;
import com.italosantos.minha_mesa.model.UserModel;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.br.CPF;
import org.jspecify.annotations.Nullable;

import java.time.LocalDate;

public record CreateOwnerDTO(
        @CPF
        @NotBlank
        String cpf,

        @NotNull
        @Past
        LocalDate nasciment,

        @Nullable
        RegisterRequestDTO userData
) {
}
