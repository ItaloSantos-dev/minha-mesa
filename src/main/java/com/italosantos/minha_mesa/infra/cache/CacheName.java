package com.italosantos.minha_mesa.infra.cache;

import tools.jackson.databind.ObjectMapper;

public class CacheName {
    //RESERVES
    public final static String RESERVESBYUSERSCACHENAME = "reserves-by-user";
    public final static String RESERVESRESTAURANTBYOWNERCACHENAME = "reserves-by-owner";

    //RESTAURANT
    public final static String RESTAURANTCACHENAME = "restaurant";
    public final static String RESTAURANTSBYSEARCHEDCACHENAME = "restaurants-by-search";
    public final static String RESTAURANTBYOWNERCACHENAME = "restaurant-by-owner";

    //REQUESTS
    public final static String REQUESTSLOGINCACHENAME = "requests-login";
    public final static String REQUESTSGETCACHENAME = "requests-get";
    public final static String REQUESTSOTHERSMETHODSCACHENAME = "requests-";

    //TABLES
    public final static String TABLEAVALIABLESBYRESTAURANTCACHENAME = "table-avaliables-by-restaurant";
    public final static String TABLESBYRESTAURANTCACHENAME = "tables-by-restaurant";

    //DASHBOARD
    public final static String DASHBOARDBYOWNERCACHENAME = "dashboard-by-owner";

    //WORKINGDAYS
    public final static String WORKINGDAYSBYRESTAURANTCACHENAME = "working-days-by-restaurant";
    public final static String WORKINGDAYSBYOWNERCACHENAME = "working-days-by-owner";

    //EXCEPTIONS
    public final static String EXCEPTIONSBYOWNERCACHENAME = "exceptions-by-owner";

    //DISHES
    public final static String DISHESBYRESTAURANTSLUGCACHENAME = "dishes-by-restaurant-slug";
    public final static String DISHESBYOWNERCACHENAME = "dishes-by-owner";

    //CLIENTS
    public final static String CLIENTSRESTAURANTBYOWNER = "clients-by-owner";



}
