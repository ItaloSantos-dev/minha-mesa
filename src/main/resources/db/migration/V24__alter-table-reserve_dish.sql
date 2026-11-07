ALTER TABLE tb_reserve_dish
    ADD COLUMN status reserve_dish_status NOT NULL DEFAULT 'PENDING',
    ADD COLUMN completed_quantity INTEGER NOT NULL default 0 CHECK  (completed_quantity >= 0),
    ADD COLUMN canceled_quantity INTEGER NOT NULL default 0 CHECK  (canceled_quantity >= 0),

    ADD CONSTRAINT chk_reserve_dish_quantities
        CHECK (completed_quantity + canceled_quantity <= quantity);
