-- garante o schema
CREATE DATABASE IF NOT EXISTS `appdb`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- habilita root remoto com a senha do .env (1234)
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH mysql_native_password BY '1234';

-- privilégios para o app usar root@'%'
GRANT ALL PRIVILEGES ON `appdb`.* TO 'root'@'%';
FLUSH PRIVILEGES;
