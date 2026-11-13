package com.italosantos.minha_mesa.dto.dish_category;

import org.jspecify.annotations.Nullable;

import java.util.List;

public record UpdateDishCategoryResponseDTO(
        @Nullable
        String name,

        @Nullable
        List<Integer> dishesToAdd,

        @Nullable
        List<Integer> dishesToRemove,

        @Nullable
        Boolean updateActive, //Os pratos seguem o de desativar mas não o de ativar

        @Nullable
        Boolean removeAllDishsOfCategory //Apena caso o novo estado do restaurante seja = false

) {
}
