-- Dono (criador) da crise: permite que o usuario COMUM acompanhe apenas as
-- crises que ele mesmo cadastrou. Nulo para crises anteriores a esta versao.
ALTER TABLE crises ADD COLUMN created_by BIGINT REFERENCES users (id);
CREATE INDEX idx_crises_created_by ON crises (created_by);

-- Dados de perfil do usuario exibidos em "Meu Perfil".
ALTER TABLE users ADD COLUMN cargo VARCHAR(100);
ALTER TABLE users ADD COLUMN instituicao_id BIGINT REFERENCES instituicoes (id);

-- Recuperacao de senha ("Esqueci minha senha"): guarda o hash SHA-256 do token
-- enviado por e-mail e o instante de expiracao. Ambos nulos fora de um fluxo ativo.
ALTER TABLE users ADD COLUMN reset_token VARCHAR(64);
ALTER TABLE users ADD COLUMN reset_token_expires_at TIMESTAMP;
