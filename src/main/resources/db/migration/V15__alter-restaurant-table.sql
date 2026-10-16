ALTER TABLE tb_restaurant
    ADD COLUMN image_perfil_path TEXT,
    ADD COLUMN image_banner_path TEXT;

UPDATE tb_restaurant
SET image_perfil_path = 'default/image.jpg',
    image_banner_path = 'default/image.jpg';

ALTER TABLE tb_restaurant
    ALTER COLUMN image_perfil_path SET NOT NULL,
    ALTER COLUMN image_banner_path SET NOT NULL;