CREATE TABLE instituicoes (
    id         BIGSERIAL     PRIMARY KEY,
    nome       VARCHAR(150)  NOT NULL,
    sigla      VARCHAR(20)   NOT NULL,
    active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE campi (
    id             BIGSERIAL     PRIMARY KEY,
    nome           VARCHAR(150)  NOT NULL,
    instituicao_id BIGINT        NOT NULL REFERENCES instituicoes (id),
    active         BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE cenarios_crise (
    id              BIGSERIAL     PRIMARY KEY,
    descricao       VARCHAR(500)  NOT NULL,
    nivel_sugerido  VARCHAR(50),
    tipo_crise_id   BIGINT        NOT NULL REFERENCES tipos_crise (id),
    departamento_id BIGINT        NOT NULL REFERENCES departamentos (id),
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT now()
);
