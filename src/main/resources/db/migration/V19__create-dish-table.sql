CREATE TABLE tb_dish(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100),
    category_id INTEGER NOT NULL,
    description TEXT,
    preparation_time INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL ,
    image_path TEXT NOT NULL,
    rating NUMERIC(2,1) CHECK ( rating BETWEEN 0 AND 5),
    price NUMERIC(10,2) NOT NULL,
    slug VARCHAR(200) NOT NULL,

    CONSTRAINT pk_dish PRIMARY KEY (id),
    CONSTRAINT fk_dish_category FOREIGN KEY(category_id) REFERENCES tb_dish_category(id),
    CONSTRAINT un_dish_name_category UNIQUE (name, category_id),
    CONSTRAINT un_dish_slug_category UNIQUE (slug, category_id)

)