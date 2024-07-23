-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 23-07-2024 a las 16:21:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `caritas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `publicacion_id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `respuesta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id`, `publicacion_id`, `texto`, `user_email`, `respuesta`) VALUES
(1, 2, 'Me interesa', 'usuarioComun_2@gmail.com', NULL),
(2, 4, 'Messirve', 'usuarioComun_1@gmail.com', 'okay'),
(3, 4, 'Messirve', 'usuarioComun_1@gmail.com', 'lll'),
(4, 1, 'iiii', 'usuarioComun_2@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `filial`
--

CREATE TABLE `filial` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` enum('inactiva','activa') NOT NULL DEFAULT 'inactiva'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `filial`
--

INSERT INTO `filial` (`id`, `nombre`, `estado`) VALUES
(15, 'FilialPrueba03', 'activa'),
(16, 'FilialMarco', 'activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `filial_voluntario`
--

CREATE TABLE `filial_voluntario` (
  `id` int(11) NOT NULL,
  `id_filial` int(11) NOT NULL,
  `id_voluntario` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `filial_voluntario`
--

INSERT INTO `filial_voluntario` (`id`, `id_filial`, `id_voluntario`) VALUES
(3, 15, 'laloVoluntario@gmail.com'),
(4, 16, 'marcoVoluntario@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `id` int(11) NOT NULL,
  `fechaHora` datetime NOT NULL,
  `fk_IdFilial` int(11) NOT NULL,
  `estado` enum('disponible','ocupado') DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`id`, `fechaHora`, `fk_IdFilial`, `estado`) VALUES
(61, '2024-07-22 03:00:00', 15, 'ocupado'),
(62, '2024-07-22 04:00:00', 15, 'ocupado'),
(63, '2024-07-22 05:00:00', 15, 'ocupado'),
(64, '2024-07-22 06:00:00', 15, 'ocupado'),
(65, '2024-07-22 07:00:00', 15, 'ocupado'),
(66, '2024-07-22 08:00:00', 15, 'ocupado'),
(67, '2024-07-22 09:00:00', 15, 'disponible'),
(68, '2024-07-22 10:00:00', 15, 'ocupado'),
(69, '2024-07-22 11:00:00', 15, 'disponible'),
(70, '2024-07-22 12:00:00', 15, 'ocupado'),
(71, '2024-07-22 13:00:00', 15, 'disponible'),
(72, '2024-07-22 14:00:00', 15, 'disponible'),
(73, '2024-07-24 03:00:00', 16, 'ocupado'),
(74, '2024-07-24 04:00:00', 16, 'disponible'),
(75, '2024-07-24 05:00:00', 16, 'disponible'),
(76, '2024-07-24 06:00:00', 16, 'disponible'),
(77, '2024-07-24 07:00:00', 16, 'disponible'),
(78, '2024-07-24 08:00:00', 16, 'disponible'),
(79, '2024-07-24 09:00:00', 16, 'disponible'),
(80, '2024-07-24 10:00:00', 16, 'disponible'),
(81, '2024-07-24 11:00:00', 16, 'disponible'),
(82, '2024-07-24 12:00:00', 16, 'disponible'),
(83, '2024-07-24 13:00:00', 16, 'disponible'),
(84, '2024-07-24 14:00:00', 16, 'disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas`
--

CREATE TABLE `ofertas` (
  `id` int(12) NOT NULL,
  `dni_ofertante` int(10) NOT NULL,
  `nombre_ofertante` varchar(50) NOT NULL,
  `dni_receptor` int(10) NOT NULL,
  `nombre_receptor` varchar(50) NOT NULL,
  `id_producto_ofertante` int(10) NOT NULL,
  `id_producto_receptor` int(10) NOT NULL,
  `id_filial` int(10) NOT NULL,
  `estado` enum('pendiente','rechazada','aceptada','finalizada') NOT NULL,
  `fecha_intercambio` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ofertas`
--

INSERT INTO `ofertas` (`id`, `dni_ofertante`, `nombre_ofertante`, `dni_receptor`, `nombre_receptor`, `id_producto_ofertante`, `id_producto_receptor`, `id_filial`, `estado`, `fecha_intercambio`) VALUES
(1, 2, 'UserComún_2', 1, 'UserComún_1', 4, 2, 15, 'aceptada', '2024-07-22 06:00:00'),
(2, 2, 'UserComún_2', 1, 'UserComún_1', 3, 1, 15, 'aceptada', '2024-07-22 07:00:00'),
(3, 1, 'UserComún_1', 2, 'UserComún_2', 2, 4, 15, 'aceptada', '2024-07-22 08:00:00'),
(4, 2, 'UserComún_2', 1, 'UserComún_1', 8, 5, 15, 'finalizada', '2024-07-22 10:00:00'),
(5, 2, 'UserComún_2', 1, 'UserComún_1', 7, 6, 15, 'finalizada', '2024-07-22 12:00:00'),
(6, 1, 'UserComún_1', 2, 'UserComún_2', 6, 7, 16, 'finalizada', '2024-07-24 03:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicacion`
--

CREATE TABLE `publicacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagenes` text DEFAULT NULL,
  `estado` enum('Nuevo','Usado') NOT NULL,
  `categoria` enum('Productos de limpieza','Indumentaria','Utiles escolares','Alimentos') DEFAULT NULL,
  `fk_usuario_correo` varchar(30) DEFAULT NULL,
  `fecha_publicacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trueques`
--

CREATE TABLE `trueques` (
  `id` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` enum('exitoso','fallido') NOT NULL,
  `voluntario` varchar(50) DEFAULT NULL,
  `id_oferta` int(11) NOT NULL,
  `dni_ofertante` int(10) NOT NULL,
  `nombre_ofertante` varchar(50) NOT NULL,
  `dni_receptor` int(10) NOT NULL,
  `nombre_receptor` varchar(50) NOT NULL,
  `id_filial` int(11) NOT NULL,
  `id_producto_ofertante` int(11) NOT NULL,
  `id_producto_receptor` int(11) NOT NULL,
  `nombre_filial` varchar(50) NOT NULL,
  `fecha_intercambio` datetime NOT NULL,
  `donacion` enum('si','no') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `trueques`
--

INSERT INTO `trueques` (`id`, `descripcion`, `estado`, `voluntario`, `id_oferta`, `dni_ofertante`, `nombre_ofertante`, `dni_receptor`, `nombre_receptor`, `id_filial`, `id_producto_ofertante`, `id_producto_receptor`, `nombre_filial`, `fecha_intercambio`, `donacion`) VALUES
(1, 'Ok', 'exitoso', 'laloVoluntario@gmail.com', 4, 2, 'UserComún_2', 1, 'UserComún_1', 15, 8, 5, 'FilialPrueba03', '2024-07-22 10:00:00', 'no'),
(2, 'oke', 'fallido', 'laloVoluntario@gmail.com', 5, 2, 'UserComún_2', 1, 'UserComún_1', 15, 7, 6, 'FilialPrueba03', '2024-07-22 12:00:00', 'si'),
(3, 'si', 'exitoso', 'marcoVoluntario@gmail.com', 6, 1, 'UserComún_1', 2, 'UserComún_2', 16, 6, 7, 'FilialMarco', '2024-07-24 03:00:00', 'si');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Correo` varchar(30) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Usuario` varchar(50) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `DNI` int(10) NOT NULL,
  `nacimiento` date NOT NULL,
  `Telefono` int(10) NOT NULL,
  `rol` enum('comun','administrador','voluntario') NOT NULL DEFAULT 'comun'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Clientes, voluntarios y administradores';

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Usuario`, `Nombre`, `apellido`, `DNI`, `nacimiento`, `Telefono`, `rol`) VALUES
('lalo@gmail.com', '$2a$10$KG9hclZolvDymUz.rM9Mi.ZQSdeTGhWFIg.LUhf59TIKMSfDdF.Q2', 'lalo', 'lalo', 'landa', 10, '1999-12-12', 1234, 'comun'),
('laloAdmin@gmail.com', '$2a$10$ON96K41A463CthMGAot.5.xjnm3.TZfSx7IKfuJWLw36XbRQ3Lph6', 'laloAdmin', 'laloAdmin', 'landa', 11, '1999-12-12', 1234, 'administrador'),
('laloVoluntario@gmail.com', '$2a$10$eWBDUER/5X3nBL45lqtEeeBGh73rasFyLbmLQvT6b4MgjzQbk44hW', 'laloVoluntario', 'LaloVolunterio', 'ApellidoDeLalo', 12, '1999-12-12', 1234, 'voluntario'),
('marco@gmail.com', '$2a$10$Taf/5UBcWKPnS9vnqNJefO4G7Q9QxUm.TOIhVSdXOCzP4g.6uE7Gi', 'marco', 'marcoUser', 'polo', 20, '1999-12-12', 1234, 'comun'),
('marcoVoluntario@gmail.com', '$2a$10$73uplTpYcqIrsyOC4A678uzigz0BAGL/t/S2M6m43kOMinH1MOZWm', 'marcoVoluntario', 'Marco', 'POLO', 22, '1999-12-12', 1234, 'voluntario'),
('usuarioComun_1@gmail.com', '$2a$10$40uMbD1jgCjzI5UDZbtopOcF6eSk8rgDLm4JqpJHeLtAgw2zSjKDq', 'usuarioComun_1', 'UserComún_1', 'Usuario Común 1', 1, '1999-12-12', 1234, 'comun'),
('usuarioComun_2@gmail.com', '$2a$10$Xw0y/EBUEub/Hqbk4vXAuuLtKQzl3n3RR87KkH0g5oTAoC59T.P2.', 'userComun2', 'UserComún_2', 'Usuario Común 2', 2, '1999-12-12', 303456, 'comun'),
('usuarioComun_3@gmail.com', '$2a$10$oy/4j7VEqAZmkxcNv5p8neB50CrJ7PsuPSnw9h8AfDWo/66j9tZp2', 'usuarioComun_3', 'Usuario Común', 'Usuario Común 3', 3, '1998-12-12', 1234, 'comun');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `filial`
--
ALTER TABLE `filial`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `filial_voluntario`
--
ALTER TABLE `filial_voluntario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_filial` (`id_filial`),
  ADD KEY `id_voluntario` (`id_voluntario`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_IdFilial` (`fk_IdFilial`);

--
-- Indices de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `trueques`
--
ALTER TABLE `trueques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id_oferta`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `filial`
--
ALTER TABLE `filial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `filial_voluntario`
--
ALTER TABLE `filial_voluntario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `trueques`
--
ALTER TABLE `trueques`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`fk_IdFilial`) REFERENCES `filial` (`id`);

--
-- Filtros para la tabla `trueques`
--
ALTER TABLE `trueques`
  ADD CONSTRAINT `id` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
