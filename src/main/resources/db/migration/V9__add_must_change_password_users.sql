-- Flag que forca a troca de senha no proximo login (senha temporaria enviada por e-mail).
ALTER TABLE users ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE;
