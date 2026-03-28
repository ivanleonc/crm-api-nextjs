-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-03-2026 a las 17:31:00
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
-- Base de datos: `crm_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `table_name` varchar(100) NOT NULL,
  `record_id` varchar(100) NOT NULL,
  `action` varchar(20) NOT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `table_name`, `record_id`, `action`, `old_values`, `new_values`, `ip_address`, `created_at`) VALUES
(1, 1, 'customers', '1', 'INSERT', NULL, '{\"first_name\":\"Carlos\",\"last_name\":\"Gómez\",\"email\":\"carlos.gomez@empresa.com\",\"phone\":\"555-0192\",\"company\":\"Tech Solutions SA\",\"status\":\"lead\"}', NULL, '2026-03-28 00:59:37'),
(2, 1, 'customers', '2', 'INSERT', NULL, '{\"first_name\":\"Sergio\",\"last_name\":\"Ramos\",\"email\":\"sergio.ramos@empresa.com\",\"phone\":\"555-02232\",\"company\":\"Tech ABC SA\",\"status\":\"lead\"}', NULL, '2026-03-28 01:15:02'),
(3, 1, 'customers', '6', 'INSERT', NULL, '{\"first_name\":\"Sergio\",\"last_name\":\"Ramos\",\"email\":\"sergio2.ramos@empresa.com\",\"phone\":\"555-02232\",\"company\":\"Tech ABC SA\",\"status\":\"lead\"}', NULL, '2026-03-28 01:57:07'),
(4, 1, 'customers', '7', 'INSERT', NULL, '{\"first_name\":\"Leon\",\"last_name\":\"Capote\",\"email\":\"mai@mail.com\",\"phone\":\"3015415334\",\"company\":\"tech\",\"status\":\"lead\"}', NULL, '2026-03-28 14:02:11'),
(5, 1, 'customers', '7', 'UPDATE', '{\"id\":7,\"first_name\":\"Leon\",\"last_name\":\"Capote\",\"email\":\"mai@mail.com\",\"phone\":\"3015415334\",\"company\":\"tech\",\"status\":\"lead\",\"created_at\":\"2026-03-28T14:02:11.000Z\",\"updated_at\":\"2026-03-28T14:02:11.000Z\"}', '{\"first_name\":\"Leonsss\",\"last_name\":\"Capote\",\"email\":\"mai@mail.com\",\"phone\":\"3015415334\",\"company\":\"tech\",\"status\":\"lead\"}', NULL, '2026-03-28 15:11:17'),
(6, 1, 'customers', '6', 'DELETE', '{\"id\":6,\"first_name\":\"Sergio\",\"last_name\":\"Ramos\",\"email\":\"sergio2.ramos@empresa.com\",\"phone\":\"555-02232\",\"company\":\"Tech ABC SA\",\"status\":\"lead\",\"created_at\":\"2026-03-28T01:57:07.000Z\",\"updated_at\":\"2026-03-28T01:57:07.000Z\"}', NULL, NULL, '2026-03-28 15:11:23'),
(7, 1, 'customers', '7', 'UPDATE', '{\"id\":7,\"first_name\":\"Leonsss\",\"last_name\":\"Capote\",\"email\":\"mai@mail.com\",\"phone\":\"3015415334\",\"company\":\"tech\",\"status\":\"lead\",\"created_at\":\"2026-03-28T14:02:11.000Z\",\"updated_at\":\"2026-03-28T15:11:17.000Z\"}', '{\"first_name\":\"Ivan\",\"last_name\":\"Leon\",\"email\":\"ivan@mail.com\",\"phone\":\"3015415334\",\"company\":\"tech cari\",\"status\":\"lead\"}', NULL, '2026-03-28 15:11:43'),
(8, 1, 'customers', '7', 'UPDATE', '{\"id\":7,\"first_name\":\"Ivan\",\"last_name\":\"Leon\",\"email\":\"ivan@mail.com\",\"phone\":\"3015415334\",\"company\":\"tech cari\",\"status\":\"lead\",\"created_at\":\"2026-03-28T14:02:11.000Z\",\"updated_at\":\"2026-03-28T15:11:43.000Z\"}', '{\"first_name\":\"Ivan\",\"last_name\":\"Leon\",\"email\":\"ivan@mail.com\",\"phone\":\"3015415334\",\"company\":\"Tech Cari\",\"status\":\"lead\"}', NULL, '2026-03-28 15:11:57'),
(9, 1, 'customers', '8', 'INSERT', NULL, '{\"first_name\":\"Julian\",\"last_name\":\"Rodriguez\",\"email\":\"julian@mail.com\",\"phone\":\"3154945031\",\"company\":\"CEO\",\"status\":\"lead\"}', NULL, '2026-03-28 15:12:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `status` enum('lead','active','inactive') DEFAULT 'lead',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `customers`
--

INSERT INTO `customers` (`id`, `first_name`, `last_name`, `email`, `phone`, `company`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Carlos', 'Gómez', 'carlos.gomez@empresa.com', '555-0192', 'Tech Solutions SA', 'lead', '2026-03-28 00:59:37', '2026-03-28 00:59:37'),
(2, 'Sergio', 'Ramos', 'sergio.ramos@empresa.com', '555-02232', 'Tech ABC SA', 'lead', '2026-03-28 01:15:02', '2026-03-28 01:15:02'),
(7, 'Ivan', 'Leon', 'ivan@mail.com', '3015415334', 'Tech Cari', 'lead', '2026-03-28 14:02:11', '2026-03-28 15:11:57'),
(8, 'Julian', 'Rodriguez', 'julian@mail.com', '3154945031', 'CEO', 'lead', '2026-03-28 15:12:26', '2026-03-28 15:12:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `module`, `description`) VALUES
(1, 'clientes.ver', 'Clientes', 'Permite ver la información de los clientes'),
(2, 'clientes.crear', 'Clientes', 'Permite registrar nuevos clientes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrador total del sistema');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'juan.perez@ejemplo.com', '$2b$10$2AlK3c9B6IZc.E4WU4dvs.zU7FclRXsYMUHwSkvffwlUOzrwXe3Q6', 'Juan', 'Pérez', 1, '2026-03-27 23:46:53', '2026-03-27 23:46:53'),
(2, 'ivan@ejemplo.com', '$2b$10$ejoDasmuf9KEGRMHPUj9GOO4CZ4qcrKGUsJxTwXtJ.Y.DOpAJyidW', 'Ivan', 'Leon', 1, '2026-03-28 00:49:38', '2026-03-28 00:49:38'),
(3, 'julian@ejemplo.com', '$2b$10$V6e4OsXcVXbRmVs6mw6NeucR4YmRF/PsdBXChmrCFjBsrd/p5znbi', 'julian', 'rodriguez', 1, '2026-03-28 15:20:20', '2026-03-28 15:20:20'),
(4, 'leoncapote@mail.com', '$2b$10$fo.x184fXdn4U.ux7VIiUeOeqeC2QdT1Js4pBRVXZcggppR6sTyqS', 'leon', 'capote', 1, '2026-03-28 15:37:21', '2026-03-28 15:37:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1),
(4, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
