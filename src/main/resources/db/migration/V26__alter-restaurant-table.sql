CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE tb_restaurant
    ADD CONSTRAINT un_restaurant_name UNIQUE (name);


ALTER TABLE tb_restaurant
    ADD COLUMN slug VARCHAR(100);

ALTER TABLE tb_restaurant
    ADD CONSTRAINT un_restaurant_slug UNIQUE(slug);

UPDATE tb_restaurant
    SET slug = LOWER(
        REGEXP_REPLACE(
                UNACCENT(TRIM(name)),
                '[^a-zA-Z0-9]+',
                '-',
                'g'
        )
    );

ALTER TABLE tb_restaurant
    ALTER COLUMN slug SET NOT NULL;
