-- Crear usuario de prueba sin consentimiento
INSERT INTO users (id, email, password_hash, first_name, last_name, is_active, is_email_verified, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test.consent@vitam.cl',
  '$2b$10$YourHashedPasswordHere',
  'Test',
  'Consentimiento',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id, email;
