CREATE TABLE tb_schedule_exception (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    date DATE NOT NULL,
    reason TEXT NOT NULL,

    CONSTRAINT pk_schedule_exception PRIMARY KEY(id)
)