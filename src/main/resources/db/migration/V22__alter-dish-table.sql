ALTER TABLE tb_dish
ALTER COLUMN category_id TYPE INTEGER;

ALTER TABLE tb_dish
    ADD COLUMN restaurant_id INTEGER;

UPDATE tb_dish d
SET restaurant_id = dc.restaurant_id
    FROM tb_dish_category dc
    WHERE d.category_id = dc.id;

ALTER TABLE tb_dish
    ALTER COLUMN restaurant_id SET NOT NULL;

ALTER TABLE tb_dish
    ADD CONSTRAINT fk_dish_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES tb_restaurant(id);

ALTER TABLE tb_dish
    DROP CONSTRAINT un_dish_name_category,
    DROP CONSTRAINT un_dish_slug_category;

ALTER TABLE tb_dish
    ADD CONSTRAINT un_dish_name_restaurant UNIQUE (name, restaurant_id),
    ADD CONSTRAINT un_dish_slug_restaurant UNIQUE (slug, restaurant_id);