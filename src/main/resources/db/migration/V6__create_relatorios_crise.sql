CREATE TABLE relatorios_crise (
    id                     BIGSERIAL     PRIMARY KEY,
    titulo                 VARCHAR(200)  NOT NULL,
    resumo_ocorrido        VARCHAR(2000) NOT NULL,
    impactos_identificados VARCHAR(2000),
    acoes_realizadas       VARCHAR(2000),
    resultado_final        VARCHAR(2000),
    recomendacoes          VARCHAR(2000),
    crise_id               BIGINT        NOT NULL UNIQUE REFERENCES crises (id),
    usuario_id             BIGINT        NOT NULL REFERENCES users (id),
    created_at             TIMESTAMP     NOT NULL DEFAULT now()
);
