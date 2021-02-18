-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-01-2021 a las 15:48:38
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `404_g04`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiquetas`
--

CREATE TABLE `etiquetas` (
  `id_pregunta` int(11) NOT NULL,
  `texto` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `etiquetas`
--

INSERT INTO `etiquetas` (`id_pregunta`, `texto`) VALUES
(56, 'css'),
(56, 'css3'),
(57, 'css'),
(57, 'html'),
(58, 'javascript'),
(59, 'nodejs'),
(60, 'mysql'),
(60, 'sql'),
(61, 'css'),
(61, 'css3'),
(61, 'html'),
(61, 'javascript'),
(61, 'mysql'),
(62, 'css'),
(62, 'nueva'),
(62, 'nueva2'),
(62, 'sql');

--
-- Disparadores `etiquetas`
--
DELIMITER $$
CREATE TRIGGER `etiqueta_mas_usada` AFTER INSERT ON `etiquetas` FOR EACH ROW UPDATE USUARIO SET etiqueta_mas_usada = (SELECT SOL.TEXTO FROM ( SELECT MAX(J.NUM), J.TEXTO FROM ( SELECT COUNT(*) AS NUM, E.texto FROM etiquetas E JOIN PREGUNTA P ON P.ID=E.id_pregunta WHERE P.id_usuario=( SELECT ID_USUARIO FROM PREGUNTA WHERE ID=NEW.ID_PREGUNTA) GROUP BY E.texto ORDER BY NUM DESC) AS J) AS SOL) WHERE EMAIL=(SELECT ID_USUARIO FROM PREGUNTA WHERE ID=NEW.ID_PREGUNTA)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medalla`
--

CREATE TABLE `medalla` (
  `id` int(11) NOT NULL,
  `metal` varchar(15) NOT NULL,
  `nombre` varchar(21) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `medalla`
--

INSERT INTO `medalla` (`id`, `metal`, `nombre`) VALUES
(1, 'BRONCE', 'ESTUDIANTE'),
(2, 'BRONCE', 'PREGUNTA INTERESANTE'),
(3, 'PLATA', 'BUENA PREGUNTA'),
(4, 'ORO', 'EXCELENTE PREGUNTA'),
(5, 'BRONCE', 'PREGUNTA POPULAR'),
(6, 'PLATA', 'PREGUNTA DESTACADA'),
(7, 'ORO', 'PREGUNTA FAMOSA'),
(8, 'BRONCE', 'RESPUESTA INTERESANTE'),
(9, 'PLATA', 'BUENA RESPUESTA'),
(10, 'ORO', 'EXCELENTE RESPUESTA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medalla_pregunta`
--

CREATE TABLE `medalla_pregunta` (
  `id_medalla` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `medalla_pregunta`
--
DELIMITER $$
CREATE TRIGGER `gana_medalla_pregunta` AFTER INSERT ON `medalla_pregunta` FOR EACH ROW INSERT INTO usuario_gana_medalla(id_usuario, id_medalla)
    VALUES((SELECT ID_USUARIO FROM
    PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA), NEW.id_medalla)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medalla_respuesta`
--

CREATE TABLE `medalla_respuesta` (
  `id_medalla` int(11) NOT NULL,
  `id_respuesta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `medalla_respuesta`
--
DELIMITER $$
CREATE TRIGGER `gana_medalla_respuesta` AFTER INSERT ON `medalla_respuesta` FOR EACH ROW INSERT INTO usuario_gana_medalla(id_usuario, id_medalla)
    VALUES((SELECT ID_USUARIO FROM
    RESPUESTA
    WHERE
        ID = NEW.ID_RESPUESTA), NEW.id_medalla)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id_usuario` varchar(50) NOT NULL,
  `id` int(11) NOT NULL,
  `fecha` varchar(10) NOT NULL DEFAULT current_timestamp(),
  `cuerpo` longtext NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `num_visitas` int(11) NOT NULL DEFAULT 0,
  `num_votos` int(11) NOT NULL,
  `num_respuestas` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id_usuario`, `id`, `fecha`, `cuerpo`, `titulo`, `num_visitas`, `num_votos`, `num_respuestas`) VALUES
('nico@404.es', 56, '2021-01-14', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 0, 0, 1),
('roberto@404.es', 57, '2021-01-14', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', '¿Cómo funciona exactamente nth-child?', 0, 0, 1),
('sfg@404.es', 58, '2021-01-14', 'Siempre he visto que en JavaScript hay:\r\n\r\nasignaciones =\r\ncomparaciones == y ===\r\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también compara el tipo (como un equals de java).', 'Diferencias entre == y === (comparaciones en JavaScript)', 0, 0, 0),
('marta@404.es', 59, '2021-01-14', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pg-node. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro modulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi seguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan disponibles al momento de usarlos.', 'Problema con asincronismo en Node', 0, 0, 0),
('lucas@404.es', 60, '2021-01-14', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que guardan información en una base de datos (especialmente en PHP y MySQL) y que contienen graves problemas de seguridad relacionados principalmente con la inyección SQL.\r\n\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario no da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes sobre el tema así que decidí escribir esta pregunta.', '¿Qué es la inyección SQL y cómo puedo evitarla?', 0, 0, 0),
('nico@404.es', 61, '2021-01-27', 'prueba', 'probando etiquetas nuevas', 1, 0, 0),
('nico@404.es', 62, '2021-01-27', 'etiquetita', 'añado una nueva', 1, 0, 0);

--
-- Disparadores `pregunta`
--
DELIMITER $$
CREATE TRIGGER `sumar_num_preguntas_usuario` BEFORE INSERT ON `pregunta` FOR EACH ROW UPDATE usuario SET num_preguntas = num_preguntas + 1 WHERE email = NEW.id_usuario
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id_usuario` varchar(50) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `fecha` varchar(10) NOT NULL DEFAULT current_timestamp(),
  `cuerpo` longtext NOT NULL,
  `num_votos` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuesta`
--

INSERT INTO `respuesta` (`id_usuario`, `id_pregunta`, `id`, `fecha`, `cuerpo`, `num_votos`) VALUES
('lucas@404.es', 56, 49, '2021-01-14', 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo, dependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra para posicionarse respecto a ella.\r\n\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute | fixed | inherit | initial.', 0),
('emy@404.es', 57, 50, '2021-01-14', 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en la fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa un ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.', 0);

--
-- Disparadores `respuesta`
--
DELIMITER $$
CREATE TRIGGER `sumar_num_respuestas` AFTER INSERT ON `respuesta` FOR EACH ROW UPDATE pregunta SET num_respuestas = num_respuestas + 1 WHERE id = NEW.id_pregunta
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sumar_num_respuestas_usuario` BEFORE INSERT ON `respuesta` FOR EACH ROW UPDATE usuario SET num_respuestas = num_respuestas + 1 WHERE email = NEW.id_usuario
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('ViogE0kZ0TLdT-hwkHXc4KBb8zk_knrd', 1611845311, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"nico@404.es\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `email` varchar(50) NOT NULL,
  `num_usuario` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `fecha_alta` varchar(10) NOT NULL DEFAULT current_timestamp(),
  `num_respuestas` int(11) NOT NULL DEFAULT 0,
  `num_preguntas` int(11) NOT NULL DEFAULT 0,
  `imagen` varchar(150) DEFAULT NULL,
  `contraseña` varchar(25) NOT NULL,
  `reputacion` int(11) NOT NULL DEFAULT 1,
  `etiqueta_mas_usada` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`email`, `num_usuario`, `nombre`, `fecha_alta`, `num_respuestas`, `num_preguntas`, `imagen`, `contraseña`, `reputacion`, `etiqueta_mas_usada`) VALUES
('emy@404.es', 51, 'Emy', '2021-01-14', 1, 0, 'foto-1610637411441.png', '12345678', 1, NULL),
('lucas@404.es', 50, 'Lucas', '2021-01-14', 1, 1, 'defecto1.png', '12345678', 1, 'sql'),
('marta@404.es', 49, 'Marta', '2021-01-14', 0, 1, 'foto-1610637287370.png', '12345678', 1, 'nodejs'),
('nico@404.es', 46, 'Nico', '2021-01-14', 0, 3, 'foto-1610637072161.png', '12345678', 1, 'css'),
('roberto@404.es', 47, 'Roberto', '2021-01-14', 0, 1, 'foto-1610637098818.png', '12345678', 1, 'css'),
('sfg@404.es', 48, 'SFG', '2021-01-14', 0, 1, 'foto-1610637129166.png', '12345678', 1, 'javascript');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_gana_medalla`
--

CREATE TABLE `usuario_gana_medalla` (
  `id_usuario` varchar(50) NOT NULL,
  `id_medalla` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_visita_pregunta`
--

CREATE TABLE `usuario_visita_pregunta` (
  `id_usuario` varchar(50) NOT NULL,
  `id_pregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario_visita_pregunta`
--

INSERT INTO `usuario_visita_pregunta` (`id_usuario`, `id_pregunta`) VALUES
('nico@404.es', 61),
('nico@404.es', 62);

--
-- Disparadores `usuario_visita_pregunta`
--
DELIMITER $$
CREATE TRIGGER `medalla_pregunta_visita` BEFORE INSERT ON `usuario_visita_pregunta` FOR EACH ROW IF (SELECT NUM_VISITAS FROM PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA)=2 THEN
    INSERT INTO usuario_gana_medalla(id_usuario, id_medalla)
    VALUES((SELECT ID_USUARIO FROM
    PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA), 5);
    ELSEIF (SELECT NUM_VISITAS FROM PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA)=4 THEN
    INSERT INTO usuario_gana_medalla(id_usuario, id_medalla)
    VALUES((SELECT ID_USUARIO FROM
    PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA), 6);

    ELSEIF (SELECT NUM_VISITAS FROM
     PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA)=6 THEN
    INSERT INTO usuario_gana_medalla(id_usuario, id_medalla)
    VALUES((SELECT ID_USUARIO FROM
    PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA), 7);

    
    END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sumar num_visitas` BEFORE INSERT ON `usuario_visita_pregunta` FOR EACH ROW UPDATE pregunta SET num_visitas = num_visitas + 1 WHERE id = NEW.id_pregunta
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_vota_pregunta`
--

CREATE TABLE `usuario_vota_pregunta` (
  `id_usuario` varchar(50) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `tipo_voto` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `usuario_vota_pregunta`
--
DELIMITER $$
CREATE TRIGGER `medalla_pregunta_voto` AFTER INSERT ON `usuario_vota_pregunta` FOR EACH ROW IF NEW.TIPO_VOTO=1 THEN

IF (SELECT NUM_VOTOS FROM PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA)=1 THEN
    INSERT IGNORE INTO medalla_pregunta(id_pregunta, id_medalla)
    VALUES(NEW.ID_PREGUNTA, 1);
    ELSEIF (SELECT NUM_VOTOS FROM PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA)=2 THEN
    INSERT IGNORE INTO medalla_pregunta(id_pregunta, id_medalla)
    VALUES(NEW.ID_PREGUNTA, 2);

ELSEIF (SELECT NUM_VOTOS FROM
     PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA)=4 THEN
    INSERT IGNORE INTO medalla_pregunta(id_pregunta, id_medalla)
    VALUES(NEW.ID_PREGUNTA, 3);
    ELSEIF (SELECT NUM_VOTOS FROM
     PREGUNTA
    WHERE
        ID = NEW.ID_PREGUNTA)=6 THEN
    INSERT IGNORE INTO medalla_pregunta(id_pregunta, id_medalla)
    VALUES(NEW.ID_PREGUNTA, 4);
        END IF;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sumar_num_votos_pregunta` BEFORE INSERT ON `usuario_vota_pregunta` FOR EACH ROW UPDATE pregunta SET num_votos = num_votos + NEW.tipo_voto WHERE id = NEW.id_pregunta
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sumar_reputacion` AFTER INSERT ON `usuario_vota_pregunta` FOR EACH ROW IF NEW.tipo_voto = 1 THEN 
	UPDATE usuario SET reputacion = reputacion 		+ 10 WHERE email = (SELECT id_usuario FROM PREGUNTA WHERE id = 		new.id_pregunta);
ELSEIF NEW.tipo_voto = -1 THEN 
	IF (SELECT reputacion FROM usuario WHERE 	email = (SELECT id_usuario FROM pregunta 		WHERE id = new.id_pregunta)) > 2 THEN
UPDATE usuario SET reputacion = reputacion - 2 WHERE email = (SELECT id_usuario FROM pregunta WHERE id = new.id_pregunta); 
ELSEIF (SELECT reputacion FROM usuario WHERE 	email = (SELECT id_usuario FROM pregunta 		WHERE id = new.id_pregunta)) = 2 THEN UPDATE usuario SET reputacion = 1 WHERE email = (SELECT id_usuario FROM pregunta WHERE id = new.id_pregunta); 
END IF;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_vota_respuesta`
--

CREATE TABLE `usuario_vota_respuesta` (
  `id` int(11) NOT NULL,
  `id_usuario` varchar(50) NOT NULL,
  `id_respuesta` int(11) NOT NULL,
  `tipo` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `usuario_vota_respuesta`
--
DELIMITER $$
CREATE TRIGGER `medalla_respuesta_voto` AFTER INSERT ON `usuario_vota_respuesta` FOR EACH ROW IF NEW.TIPO=1 THEN
    IF (SELECT NUM_VOTOS FROM respuesta
    WHERE
        ID = NEW.ID_RESPUESTA)=2 THEN
    INSERT IGNORE INTO medalla_respuesta(id_respuesta, id_medalla)
    VALUES(NEW.ID_RESPUESTA, 8);

    ELSEIF (SELECT NUM_VOTOS FROM
     respuesta
    WHERE
        ID = NEW.ID_RESPUESTA)=4 THEN
    INSERT IGNORE INTO medalla_respuesta(id_respuesta, id_medalla)
    VALUES(NEW.ID_RESPUESTA, 9);

    ELSEIF (SELECT NUM_VOTOS FROM
     respuesta
    WHERE
        ID = NEW.ID_RESPUESTA)=6 THEN
    INSERT IGNORE INTO medalla_respuesta(id_respuesta, id_medalla)
    VALUES(NEW.ID_RESPUESTA, 10);
    END IF;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sumar_num_votos_respuesta` AFTER INSERT ON `usuario_vota_respuesta` FOR EACH ROW UPDATE respuesta SET num_votos = num_votos + NEW.tipo WHERE id=new.id_respuesta
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sumar_reputacion_respuesta` BEFORE INSERT ON `usuario_vota_respuesta` FOR EACH ROW IF NEW.tipo = 1 THEN 
	UPDATE usuario SET reputacion = reputacion 		+ 10 WHERE email = (SELECT DISTINCT id_usuario FROM RESPUESTA WHERE id = new.id_respuesta);
ELSEIF NEW.tipo = -1 THEN 
	IF (SELECT reputacion FROM usuario WHERE 	email = (SELECT id_usuario FROM RESPUESTA 		WHERE id = new.id_respuesta)) > 2 THEN
UPDATE usuario SET reputacion = reputacion - 2 WHERE email = (SELECT DISTINCT id_usuario FROM RESPUESTA WHERE id = new.id_respuesta); 
ELSEIF (SELECT reputacion FROM usuario WHERE 	email = (SELECT id_usuario FROM RESPUESTA 		WHERE id = new.id_respuesta)) = 2 THEN UPDATE usuario SET reputacion = 1 WHERE email = (SELECT DISTINCT id_usuario FROM RESPUESTA WHERE id = new.id_respuesta); 
END IF;
END IF
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `etiquetas`
--
ALTER TABLE `etiquetas`
  ADD PRIMARY KEY (`id_pregunta`,`texto`);

--
-- Indices de la tabla `medalla`
--
ALTER TABLE `medalla`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medalla_pregunta`
--
ALTER TABLE `medalla_pregunta`
  ADD PRIMARY KEY (`id_medalla`,`id_pregunta`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `medalla_respuesta`
--
ALTER TABLE `medalla_respuesta`
  ADD PRIMARY KEY (`id_medalla`,`id_respuesta`),
  ADD KEY `id_respuesta` (`id_respuesta`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pregunta_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pregunta` (`id_pregunta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `num_usuario` (`num_usuario`);

--
-- Indices de la tabla `usuario_gana_medalla`
--
ALTER TABLE `usuario_gana_medalla`
  ADD PRIMARY KEY (`id_usuario`,`id_medalla`,`fecha`),
  ADD KEY `id_medalla` (`id_medalla`);

--
-- Indices de la tabla `usuario_visita_pregunta`
--
ALTER TABLE `usuario_visita_pregunta`
  ADD PRIMARY KEY (`id_usuario`,`id_pregunta`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `usuario_vota_pregunta`
--
ALTER TABLE `usuario_vota_pregunta`
  ADD PRIMARY KEY (`id_usuario`,`id_pregunta`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `usuario_vota_respuesta`
--
ALTER TABLE `usuario_vota_respuesta`
  ADD PRIMARY KEY (`id_usuario`,`id_respuesta`),
  ADD KEY `id_respuesta` (`id_respuesta`),
  ADD KEY `id` (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `medalla`
--
ALTER TABLE `medalla`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `num_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `usuario_vota_respuesta`
--
ALTER TABLE `usuario_vota_respuesta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `etiquetas`
--
ALTER TABLE `etiquetas`
  ADD CONSTRAINT `etiquetas_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `medalla_pregunta`
--
ALTER TABLE `medalla_pregunta`
  ADD CONSTRAINT `medalla_pregunta_ibfk_1` FOREIGN KEY (`id_medalla`) REFERENCES `medalla` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `medalla_pregunta_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `medalla_respuesta`
--
ALTER TABLE `medalla_respuesta`
  ADD CONSTRAINT `medalla_respuesta_ibfk_1` FOREIGN KEY (`id_medalla`) REFERENCES `medalla` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `medalla_respuesta_ibfk_2` FOREIGN KEY (`id_respuesta`) REFERENCES `respuesta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `pregunta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `respuesta_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `respuesta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_gana_medalla`
--
ALTER TABLE `usuario_gana_medalla`
  ADD CONSTRAINT `usuario_gana_medalla_ibfk_1` FOREIGN KEY (`id_medalla`) REFERENCES `medalla` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_gana_medalla_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_visita_pregunta`
--
ALTER TABLE `usuario_visita_pregunta`
  ADD CONSTRAINT `usuario_visita_pregunta_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_visita_pregunta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_vota_pregunta`
--
ALTER TABLE `usuario_vota_pregunta`
  ADD CONSTRAINT `usuario_vota_pregunta_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_vota_pregunta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_vota_respuesta`
--
ALTER TABLE `usuario_vota_respuesta`
  ADD CONSTRAINT `usuario_vota_respuesta_ibfk_1` FOREIGN KEY (`id_respuesta`) REFERENCES `respuesta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_vota_respuesta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
