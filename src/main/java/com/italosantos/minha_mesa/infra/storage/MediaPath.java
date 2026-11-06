package com.italosantos.minha_mesa.infra.storage;

public enum MediaPath {
    RESTAURANT_PERFIL_PATH("/restaurant/perfil"),
    RESTAURANT_BANNER_PATH("/restaurant/banner"),
    DISH_CATEGORY_PATH("restaurant/dish_category"),
    DISH("restaurant/dish");

    private String path;

    public String getPath(){
         return this.path;
    }
    MediaPath(String  path){
        this.path = path;
    }
}
