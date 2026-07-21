CREATE TABLE tb_user (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ,
    name VARCHAR(45) NOT NULL ,
    phone VARCHAR(11) NOT NULL ,/*12345678900*/
    email VARCHAR(100)  NOT NULL,
    password VARCHAR(100) NOT NULL,
    role user_role NOT NULL,

    CONSTRAINT pk_user PRIMARY KEY (id),
    CONSTRAINT un_user_phone UNIQUE (phone),
    CONSTRAINT un_user_email UNIQUE (email)
)