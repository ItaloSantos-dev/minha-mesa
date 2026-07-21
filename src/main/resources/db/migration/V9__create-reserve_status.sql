CREATE TYPE reserve_status AS ENUM (
    'SCHEDULED',
    'CONFIRMED',
    'CANCELED',
    'COMPLETED',
    'NO-SHOW'
);