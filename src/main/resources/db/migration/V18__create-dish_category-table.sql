CREATE TABLE tb_dish_category (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    restaurant_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    slug VARCHAR(200) NOT NULL,

    CONSTRAINT pk_dish_category PRIMARY KEY(id),
    CONSTRAINT fk_dish_category_restaurant FOREIGN KEY (restaurant_id) REFERENCES tb_restaurant(id),
    CONSTRAINT un_dish_category_name_restaurant UNIQUE (name ,restaurant_id),
    CONSTRAINT un_dish_category_slug_restaurant UNIQUE (slug, restaurant_id)
)