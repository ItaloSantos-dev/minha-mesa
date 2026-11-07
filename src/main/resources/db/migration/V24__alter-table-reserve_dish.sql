ALTER TABLE tb_reserve_dish
    ADD COLUMN completed_quantity INTEGER NOT NULL default 0 CHECK  (completed_quantity >= 0 AND completed_quantity <= quantity),
    ADD COLUMN status reserve_dish_status NOT NULL DEFAULT 'PENDING';
