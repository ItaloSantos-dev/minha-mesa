CREATE TABLE tb_reserve_dish (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    reserve_id INTEGER NOT NULL,
    dish_id INTEGER NOT NULL,
    dish_price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK ( quantity>0 ),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_reserve_dish_id PRIMARY KEY (id),
    CONSTRAINT fk_reserve_dish_reserve FOREIGN KEY(reserve_id) REFERENCES tb_reserve(id),
    CONSTRAINT fk_reserve_dish_dish FOREIGN KEY(dish_id) REFERENCES tb_dish(id),
    CONSTRAINT un_reserve_dish UNIQUE (reserve_id, dish_id)

)