package com.italosantos.minha_mesa.infra.cache;

import tools.jackson.databind.ObjectMapper;

public class CacheName {

    public final static String RESERVESUSERSCACHENAME = "reserves-user";
    public final static String RESERVESRESTAURANTCACHENAME = "reserves-restaurant";
    public final static String RESTAURANTCACHENAME = "restaurant";
    public final static String REQUESTSLOGINCACHENAME = "requests-login";
    public final static String REQUESTSGETCACHENAME = "requests-get";
    public final static String REQUESTSOTHERSMETHODSCACHENAME = "requests-";
    public final static String TABLEAVALIABLECACHENAME = "table-avaliables";
    public final static String DASHBOARDRESTAURANTCACHENAME = "dashboard-restaurant";
    public final static String TABLESOFRESTAURANTCACHENAME = "tables-restaurant";
    public final static String RESTAURANTSEARCHEDCACHENAME = "restaurant-search";
    public final static String WORKINGDAYSRESTAURANTCACHENAME = "working-days-by-restaurant-id";
    public final static String WORKINGDAYSRESTAURANTBYOWNERCACHENAME = "working-days-by-owner";
    public final static String EXCEPTIONSRESTAURANTBYOWNERCACHENAME = "exceptions-by-owner";
    public final static String DISHESBYRESTAURANTSLUGCACHENAME = "dishes-by-restaurant-slug";
    public final static String DISHESBYOWNERCACHENAME = "dishes-by-owner";
    public final static String CLIENTSRESTAURANTBYOWNER = "clients-by-owner";
    public final static String RESTAURANTBYOWNERCACHENAME = "restaurant-by-owner";


}
