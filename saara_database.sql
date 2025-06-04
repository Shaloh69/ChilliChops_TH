-- 1) Create database if missing, with modern charset & collation
CREATE DATABASE IF NOT EXISTS `Saara_ThesisDB`
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
USE `Saara_ThesisDB`;

-- 2) Drop tables in dependency order
DROP TABLE IF EXISTS `order_item`;
DROP TABLE IF EXISTS `customer_order`;
DROP TABLE IF EXISTS `daily_report`;
DROP TABLE IF EXISTS `category_menu_item`;
DROP TABLE IF EXISTS `menu_item`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `kiosk`;
DROP TABLE IF EXISTS `cashier`;
DROP TABLE IF EXISTS `admin`;

-- 3) Admins
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id`      INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(50)       NOT NULL,
  `password_hash` VARCHAR(255)      NOT NULL,
  `name`          VARCHAR(100)      NOT NULL,
  `email`         VARCHAR(100)      NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `ux_admin_username` (`username`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 4) Categories (each created by an admin)
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)     NOT NULL,
  `admin_id`    INT UNSIGNED    NOT NULL,
  PRIMARY KEY (`category_id`),
  KEY `ix_category_admin` (`admin_id`),
  CONSTRAINT `fk_category_admin`
    FOREIGN KEY (`admin_id`)
    REFERENCES `admin` (`admin_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 5) Menu Items
CREATE TABLE IF NOT EXISTS `menu_item` (
  `menu_item_id` INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  `name`         VARCHAR(100)      NOT NULL,
  `description`  VARCHAR(400)      NULL,
  `price`        DECIMAL(10,2)     NOT NULL,
  `created_at`   DATETIME(6)       NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at`   DATETIME(6)       NOT NULL 
                     DEFAULT CURRENT_TIMESTAMP(6)
                     ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`menu_item_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 6) Category ⇆ MenuItem (M:N)
CREATE TABLE IF NOT EXISTS `category_menu_item` (
  `category_id`  INT UNSIGNED NOT NULL,
  `menu_item_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`category_id`,`menu_item_id`),
  KEY `ix_cmi_menu_item` (`menu_item_id`),
  CONSTRAINT `fk_cmi_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `category` (`category_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cmi_menu_item`
    FOREIGN KEY (`menu_item_id`)
    REFERENCES `menu_item` (`menu_item_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 7) Kiosks
CREATE TABLE IF NOT EXISTS `kiosk` (
  `kiosk_id` INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  `location` VARCHAR(100)      NOT NULL,
  PRIMARY KEY (`kiosk_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 8) Cashiers
CREATE TABLE IF NOT EXISTS `cashier` (
  `cashier_id` INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100)     NOT NULL,
  `cashier_no` SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (`cashier_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 9) Daily Reports
CREATE TABLE IF NOT EXISTS `daily_report` (
  `report_date`  DATE            NOT NULL,
  `total_orders` INT UNSIGNED    NOT NULL DEFAULT 0,
  `total_sales`  DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`report_date`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 10) Customer Orders
CREATE TABLE IF NOT EXISTS `customer_order` (
  `order_id`       INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  `order_datetime` DATETIME(6)       NOT NULL,
  `total_amount`   DECIMAL(10,2)     NOT NULL,
  `cashier_id`     INT UNSIGNED      NOT NULL,
  `kiosk_id`       INT UNSIGNED      NOT NULL,
  `report_date`    DATE              NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `ix_order_cashier` (`cashier_id`),
  KEY `ix_order_kiosk`   (`kiosk_id`),
  KEY `ix_order_report`  (`report_date`),
  CONSTRAINT `fk_order_cashier`
    FOREIGN KEY (`cashier_id`)
    REFERENCES `cashier` (`cashier_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_kiosk`
    FOREIGN KEY (`kiosk_id`)
    REFERENCES `kiosk` (`kiosk_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_report`
    FOREIGN KEY (`report_date`)
    REFERENCES `daily_report` (`report_date`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 11) Order Items
CREATE TABLE IF NOT EXISTS `order_item` (
  `order_item_id` INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  `quantity`      INT UNSIGNED      NOT NULL,
  `item_price`    DECIMAL(10,2)     NOT NULL,
  `order_id`      INT UNSIGNED      NOT NULL,
  `menu_item_id`  INT UNSIGNED      NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `ix_oi_order`      (`order_id`),
  KEY `ix_oi_menu_item`  (`menu_item_id`),
  CONSTRAINT `fk_oi_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `customer_order` (`order_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_oi_menu_item`
    FOREIGN KEY (`menu_item_id`)
    REFERENCES `menu_item` (`menu_item_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `menu_item` 
ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT 'active' 
AFTER `price`;