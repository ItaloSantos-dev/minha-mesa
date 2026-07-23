ALTER TABLE tb_schedule_exception
ADD COLUMN restaurant_id INTEGER NOT NULL,
ADD CONSTRAINT fk_schedule_exception_restaurant FOREIGN KEY (restaurant_id) REFERENCES tb_restaurant(id);