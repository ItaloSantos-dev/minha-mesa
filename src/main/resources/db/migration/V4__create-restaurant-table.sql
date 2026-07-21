CREATE TABLE tb_restaurant(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(45) NOT NULL,
    owner_id INTEGER NOT NULL,
    address VARCHAR(100) NOT NULL,
    phone VARCHAR(11) NOT NULL,

    CONSTRAINT pk_restaurant PRIMARY KEY (id),
    CONSTRAINT fk_restaurant_owner FOREIGN KEY(owner_id) REFERENCES tb_owner(id),
    CONSTRAINT un_restaurant_owner UNIQUE (owner_id),
    CONSTRAINT un_restaurant_phone UNIQUE (phone)
)