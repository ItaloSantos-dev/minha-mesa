package com.italosantos.minha_mesa.infra.storage;

public enum MediaPath {
    RESTAURANT_PERFIL_PATH("/restaurant/perfil"),
    RESTAURANT_BANNER_PATH("/restaurant/banner");

    private String path;

    public String getPath(){
         return this.path;
    }
    MediaPath(String  path){
        this.path = path;
    }
}
