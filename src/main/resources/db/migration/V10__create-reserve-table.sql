CREATE TABLE tb_reserve(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    table_id INTEGER NOT NULL,
    date DATE,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    number_of_people INTEGER,
    status reserve_status NOT NULL,
    observation TEXT,
    created_at TIMESTAMP,

    CONSTRAINT pk_reserve PRIMARY KEY (id),
    CONSTRAINT fk_reserve_user FOREIGN KEY(user_id) REFERENCES tb_user(id),
    CONSTRAINT fk_reserve_table FOREIGN KEY (table_id) REFERENCES tb_table(id)
)