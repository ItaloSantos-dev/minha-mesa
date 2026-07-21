CREATE TABLE tb_owner(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    nasciment DATE NOT NULL,

    CONSTRAINT pk_owner PRIMARY KEY (id),
    CONSTRAINT fk_owner_user FOREIGN KEY(user_id) REFERENCES tb_user(id),
    CONSTRAINT un_owner_cpf UNIQUE (cpf)
)