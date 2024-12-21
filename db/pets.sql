
CREATE DATABASE pets;
USE pets;

CREATE TABLE user(
	user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    user_lastname VARCHAR(100) NOT NULL,
    email VARCHAR(75) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
	description VARCHAR(250) NOT NULL,
    tel VARCHAR(50) NOT NULL,
    user_image VARCHAR(100),
    user_is_deleted BOOLEAN DEFAULT 0
);

CREATE TABLE pet(
	pet_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    pet_name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    year_of_adoption CHAR(4) NOT NULL,
    specie VARCHAR(50),
    pet_is_deleted BOOLEAN DEFAULT 0,
    user_id INT UNSIGNED NOT NULL,
    CONSTRAINT fK_id_user foreign key (user_id)
    REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);