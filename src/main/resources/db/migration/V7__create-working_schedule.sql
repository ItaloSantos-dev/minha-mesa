CREATE TABLE tb_working_schedule(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    restaurant_id INTEGER NOT NULL,
    day_week day_of_week NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,

    CONSTRAINT pk_working_schedule PRIMARY KEY (id),
    CONSTRAINT fk_working_schedule_restaurant FOREIGN KEY (restaurant_id) REFERENCES tb_restaurant(id),
    CONSTRAINT un_working_schedule_restaurant_day_week_time_start_time_end UNIQUE (restaurant_id, day_week, time_start, time_end),
    CONSTRAINT ck_working_schedule_time CHECK (time_start < time_end)
)