-- Perfis de acesso (ADMIN / COMUM) e vínculo departamental do usuário.
ALTER TABLE users ADD COLUMN perfil VARCHAR(20) NOT NULL DEFAULT 'COMUM';
ALTER TABLE users ADD COLUMN departamento_id BIGINT REFERENCES departamentos (id);

-- Promove o administrador semeado inicialmente.
UPDATE users SET perfil = 'ADMIN' WHERE email = 'admin@crisis.local';
