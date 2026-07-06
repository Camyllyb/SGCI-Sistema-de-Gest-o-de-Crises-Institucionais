CREATE TABLE departamentos (
    id         BIGSERIAL     PRIMARY KEY,
    nome       VARCHAR(150)  NOT NULL,
    sigla      VARCHAR(20)   NOT NULL,
    active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE tipos_crise (
    id         BIGSERIAL     PRIMARY KEY,
    nome       VARCHAR(150)  NOT NULL,
    descricao  VARCHAR(500),
    active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP     NOT NULL DEFAULT now()
);

INSERT INTO departamentos (nome, sigla, active, created_at)
VALUES ('Coordenação de TI', 'CTI', TRUE, now());

INSERT INTO tipos_crise (nome, descricao, active, created_at)
VALUES ('Tecnologia', 'Crises relacionadas a sistemas, infraestrutura e segurança da informação', TRUE, now());
