-- This project uses SINGLE_TABLE inheritance for User/Etudiant/Enseignant/Admin.
-- Etudiant rows live in the `users` table with discriminator user_type = 'ETUDIANT'.
-- This view makes it easier to query students directly in MySQL (XAMPP) DB `educationn`.

DROP VIEW IF EXISTS etudiants;
CREATE VIEW etudiants AS
SELECT *
FROM users
WHERE user_type = 'ETUDIANT';
