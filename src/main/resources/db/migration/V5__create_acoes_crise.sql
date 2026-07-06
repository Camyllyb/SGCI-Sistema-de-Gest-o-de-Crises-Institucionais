CREATE TABLE acoes_crise (
    id         BIGSERIAL     PRIMARY KEY,
    descricao  VARCHAR(1000) NOT NULL,
    tipo       VARCHAR(20)   NOT NULL,
    crise_id   BIGINT        NOT NULL REFERENCES crises (id),
    usuario_id BIGINT        NOT NULL REFERENCES users (id),
    created_at TIMESTAMP     NOT NULL DEFAULT now()
);
