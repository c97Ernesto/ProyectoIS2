-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-05-2024 a las 21:24:44
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
-- Estructura de tabla para la tabla `publicacion`
--

CREATE TABLE `publicacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagenes` text DEFAULT NULL,
  `estado` enum('Nuevo','Usado') NOT NULL,
  `categoria` enum('Productos de limpieza','Indumentaria','Utiles escolares','Alimentos') DEFAULT NULL,
  `fk_usuario_correo` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publicacion`
--

INSERT INTO `publicacion` (`id`, `nombre`, `descripcion`, `imagenes`, `estado`, `categoria`, `fk_usuario_correo`) VALUES
(5, 'Lapices', 'Lápices de 12 colores Fabercastell', 'https://papeleradelonce.com.ar/wp-content/uploads/2020/11/1321.jpg', 'Nuevo', 'Utiles escolares', NULL),
(6, 'Lavandina', '3 listros Ayudin', 'https://www.alloffice.com.py/12114-large_default/lavandina-concentrada-pino-triple-accion-bb-5-litros.jpg', 'Nuevo', 'Productos de limpieza', NULL),
(7, 'Zapatillas', 'Nike color azul', 'urlImagen3', 'Usado', 'Indumentaria', NULL),
(8, 'Campera', 'Adidas del CABJ', 'urlImagen1', 'Nuevo', 'Indumentaria', NULL),
(21, 'Cafe', 'asdasd', 'https://rincongaucho.net/wp-content/uploads/2023/01/Cafe-molido-intenso-La-Morenita.gif', 'Usado', 'Alimentos', 'laloConstante@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Correo` varchar(30) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Usuario` varchar(15) NOT NULL,
  `Nombre` varchar(15) NOT NULL,
  `apellido` varchar(15) NOT NULL,
  `DNI` int(10) NOT NULL,
  `nacimiento` date NOT NULL,
  `Telefono` int(10) NOT NULL,
  `rol` enum('comun','voluntario','administrador') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Usuario`, `Nombre`, `apellido`, `DNI`, `nacimiento`, `Telefono`, `rol`) VALUES
('lalo@gmail.com', '$2a$10$oPtM1i1EgTj/u975PEbax.FN9WnV6Hqjf2fTxNISe4bSTfhcv93Pa', 'lalo', 'lalo', 'landa', 1234, '1999-12-12', 1234, 'comun'),
('laloConstante@gmail.com', '$2a$10$wDfiRpyEntl/Ha4UW0n/vekstveNvBzxU3HMHeIM7tOmxfWgEP1aW', 'LaloVariableCon', 'Lalo', 'Landa', 1234, '1998-12-12', 1234, 'comun');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
