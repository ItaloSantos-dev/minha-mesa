CREATE TABLE tb_rate_dish(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    reserve_dish_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comment TEXT,

    CONSTRAINT pk_rate_dish PRIMARY KEY (id),
    CONSTRAINT fk_rate_dish_reserve_dish FOREIGN KEY (reserve_dish_id) REFERENCES tb_reserve_dish(id),
    CONSTRAINT un_rate_dish_reserve_dish UNIQUE (reserve_dish_id)

)