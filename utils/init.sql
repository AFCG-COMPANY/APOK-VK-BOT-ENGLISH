-- таблица для обратной связи
-- help

CREATE TABLE help (
 id integer PRIMARY KEY,
 message text,
 email text,
 phone text,
 vk text,
 tg text
);

-- таблица для пользователей
-- user

CREATE TABLE users (
 id integer PRIMARY KEY,
 email text UNIQUE,
 password text UNIQUE,
 vk text UNIQUE, -- id пользователя, может быть null
 tg text UNIQUE,  -- если он его не прикрепил
 english_tutor integer
);

INSERT INTO users (vk) VALUES (123321);

SELECT id FROM users WHERE vk=123321;

SELECT * FROM users;

INSERT into help (message, vk) VALUES ("test_message_new2", 200234103)


SELECT * FROM help;


-- таблица доступов к курсам
-- каждый столбец - это доступ и прогресс по какому-то курсу
-- access

CREATE TABLE access (
 id integer PRIMARY KEY,        -- -1 если у пользователя нет доступа, 0 или выше если доступ есть
 english_tutor integer          -- каждый курс содержит n заданий,
);                              -- получить доступ к следующему заданию можно только если пройдено предыдущее
                                -- у заданий может быть разный вес
                                -- но зная это число можно установить прогресс студента по курсу

-- следующие две таблицы содержут информацию о курсе
-- они должны создаваться программно и здесь представлены для примера
-- курс_theory описывает теорию для курса, курс_practice описывает задания
-- получив значение текущего прогресса из таблицы access можно выяснить номер урока и вывести его
-- это нужно сделать и для курс_practice

CREATE TABLE english_tutor_theory (
    lesson integer,                     -- номер урока
    message text,                       -- какое-то сообщение про материал
    link text                           -- ссылка на документ с уроком(внешняя или внутренняя) сам материал
);                                      -- если ссылка начинается с local, то материал лежит на диске иначе в вк

CREATE TABLE english_tutor_practice (
    lesson integer,                     -- номер урока
    message text,                       -- какое-то сообщение про материал
    link text,                          -- ссылка на документ с заданием(по аналогии с уроком)
    answer text                         -- ответ необходимо проверить совподение ответа пользователя
                                        -- и этого ответа, и если все ответы совпали, то увеличить число в таблице access
);

-- таблица для реферальной программы

CREATE TABLE referral_share (
    userId integer, -- пользователь который делится ссылкой по реферальной программе(-1 для системы)
    token integer  -- токен для реферальной программы
);

INSERT into referral_share (userId, token) VALUES (-1, 123321);

SELECT * FROM referral_share;

DELETE FROM referral_share
WHERE token = 123321;

-- удаление таблицы(подставить нужное)
 DROP TABLE users;

