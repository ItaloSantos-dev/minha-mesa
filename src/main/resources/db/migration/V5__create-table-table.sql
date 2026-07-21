CREATE TABLE tb_table(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    restaurant_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_table PRIMARY KEY (id),
    CONSTRAINT fk_table_restaurant FOREIGN KEY (restaurant_id) REFERENCES tb_restaurant(id),
    CONSTRAINT un_table_number_restaurant UNIQUE (restaurant_id, number)
)