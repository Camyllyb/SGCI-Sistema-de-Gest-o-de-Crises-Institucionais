CREATE TABLE crises (
    id              BIGSERIAL     PRIMARY KEY,
    titulo          VARCHAR(200)  NOT NULL,
    descricao       VARCHAR(1000) NOT NULL,
    status          VARCHAR(20)   NOT NULL,
    nivel           VARCHAR(20)   NOT NULL,
    tipo_crise_id   BIGINT        NOT NULL REFERENCES tipos_crise (id),
    campus_id       BIGINT        NOT NULL REFERENCES campi (id),
    cenario_id      BIGINT        REFERENCES cenarios_crise (id),
    departamento_id BIGINT        NOT NULL REFERENCES departamentos (id),
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT now()
);
