CREATE TABLE auditoria_logs (
    id               BIGSERIAL     PRIMARY KEY,
    usuario_id       BIGINT        NOT NULL REFERENCES users (id),
    usuario_nome     VARCHAR(150)  NOT NULL,
    acao             VARCHAR(30)   NOT NULL,
    metodo_http      VARCHAR(10)   NOT NULL,
    entidade_afetada VARCHAR(100)  NOT NULL,
    recurso          VARCHAR(255)  NOT NULL,
    status_resposta  INTEGER       NOT NULL,
    data_hora        TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_auditoria_data_hora ON auditoria_logs (data_hora DESC);
CREATE INDEX idx_auditoria_entidade ON auditoria_logs (entidade_afetada);
