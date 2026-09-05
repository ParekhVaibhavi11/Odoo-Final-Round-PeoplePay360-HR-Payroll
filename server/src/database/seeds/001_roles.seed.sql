INSERT INTO users (
    email,
    password_hash,
    role_id,
    is_active,
    must_change_password
)
SELECT
    'admin@peoplepay360.com',
    '$2b$12$S42cbnrIiey8tMSOpbNV7uubL13MecehY/jNFET6ntcwY9UEuDtQK',
    id,
    TRUE,
    FALSE
FROM roles
WHERE name = 'ADMIN'
ON CONFLICT (email)
DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role_id = EXCLUDED.role_id,
    is_active = EXCLUDED.is_active,
    must_change_password = EXCLUDED.must_change_password;