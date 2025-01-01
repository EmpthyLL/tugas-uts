-- Create DB
CREATE DATABASE dev_a3mart;

-- Use the database
USE dev_a3mart;

-- User table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE, 
    fullname VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    refresh_token TEXT,
    gender VARCHAR(10),
    birth_date DATE,
    profile_pic TEXT,
    balance DECIMAL(20, 2) DEFAULT 0,
    is_member BOOLEAN DEFAULT FALSE,
    member_since DATE,
    member_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart table (current cart for the user)
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    cart_total DECIMAL(15, 2) DEFAULT 0,
    tax DECIMAL(15, 2) DEFAULT 0,
    member_discount DECIMAL(15, 2) DEFAULT 0,
    delivery DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Cart items table (items in a cart)
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
    item_id INT,
    title VARCHAR(255),
    price DECIMAL(15, 2),
    brand VARCHAR(255),
    category VARCHAR(255),
    thumbnail TEXT,
    quantity INT DEFAULT 1,
    total DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- History table (order history)
CREATE TABLE histories (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
    uuid CHAR(36) NOT NULL UNIQUE,
    driver_id INT REFERENCES drivers(id) ON DELETE CASCADE,
    status INT DEFAULT 3,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    body TEXT,
    type VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    plat_num VARCHAR(11)
);

INSERT INTO `drivers` (`id`, `nama_lengkap`, `plat_bk`) VALUES
(1, 'Andi Saputra', 'BK 8347 A'),
(2, 'Siti Aisyah', 'BK 5294 QWZ'),
(3, 'Budi Santoso', 'BK 6741 PXY'),
(4, 'Rina Pratiwi', 'BK 9203 GT'),
(5, 'Ahmad Zulkarnain', 'BK 5872 KLD'),
(6, 'Dewi Lestari', 'BK 2649 RHP'),
(7, 'Toni Fauzi', 'BK 1385 ZUJ'),
(8, 'Nina Amalia', 'BK 7126 QK'),
(9, 'Eko Prasetyo', 'BK 4571 FJN'),
(10, 'Tia Setiawati', 'BK 6938 QWZ'),
(11, 'Dedi Susanto', 'BK 3852 LVX'),
(12, 'Maya Citra', 'BK 2741 BKG'),
(13, 'Rudi Hartono', 'BK 8123 CTH'),
(14, 'Zara Lestari', 'BK 5369 VDB'),
(15, 'Faisal Hidayat', 'BK 4792 IL'),
(16, 'Lina Suryani', 'BK 9514 MPF'),
(17, 'Toni Saputra', 'BK 5863 KQA'),
(18, 'Dina Anggraini', 'BK 3627 ZWB'),
(19, 'Krisna Wardana', 'BK 7289 TZN'),
(20, 'Ria Putri', 'BK 4105 WJK'),
(21, 'Heru Prabowo', 'BK 5983 LX'),
(22, 'Winda Novita', 'BK 6819 TLD'),
(23, 'Bima Aditya', 'BK 3207 MZP'),
(24, 'Sari Maharani', 'BK 9416 FHR'),
(25, 'Fajar Nugroho', 'BK 2735 BSK'),
(26, 'Mutiara Puspita', 'BK 5809 VA'),
(27, 'Rendi Saputra', 'BK 7962 JZT'),
(28, 'Citra Dewi', 'BK 1348 PRH'),
(29, 'Junaedi Halim', 'BK 9205 XC'),
(30, 'Siti Nurhaliza', 'BK 4263 WFL'),
(31, 'Agus Widodo', 'BK 5798 YXV'),
(32, 'Eva Rahayu', 'BK 6812 NLB'),
(33, 'Tommy Harsono', 'BK 2739 DQP'),
(34, 'Linda Pratiwi', 'BK 5204 ZKC'),
(35, 'Rizky Kurniawan', 'BK 3498 VFT'),
(36, 'Amelia Yuliana', 'BK 6743 VNC'),
(37, 'Irwan Setiawan', 'BK 1237 QX'),
(38, 'Siti Farida', 'BK 5816 GYJ'),
(39, 'Darto Mulyono', 'BK 7128 HNL'),
(40, 'Alya Zahria', 'BK 3947 UPI'),
(41, 'Soni Prabowo', 'BK 5426 FDC'),
(42, 'Fikri Zainuddin', 'BK 1839 QWL'),
(43, 'Indah Sari', 'BK 9645 KZH'),
(44, 'Yulianto Nugroho', 'BK 5072 PFE'),
(45, 'Nabila Rachmawati', 'BK 1386 LON'),
(46, 'Krisna Wibowo', 'BK 6814 PJV'),
(47, 'Asep Suryana', 'BK 1473 X'),
(48, 'Lia Mulyani', 'BK 6295 QWT'),
(49, 'Doni Rahmat', 'BK 7854 PZR'),
(50, 'Siska Pratama', 'BK 2958 YKJ'),
(51, 'Novianto Putra', 'BK 8467 VLU'),
(52, 'Mira Anggraini', 'BK 5132 RX'),
(53, 'Dian Kurniawan', 'BK 9576 JTV'),
(54, 'Nina Puspita', 'BK 3485 LKZ'),
(55, 'Yogi Setiawan', 'BK 4631 FXU'),
(56, 'Sari Ramadhani', 'BK 6824 WYN'),
(57, 'Fadhil Putra', 'BK 2959 TK'),
(58, 'Ria Agustin', 'BK 7643 YRL'),
(59, 'Reza Pramudya', 'BK 8217 GVR'),
(60, 'Vina Ramadhan', 'BK 5736 ZXM'),
(61, 'Rizky Fauzan', 'BK 3642 TXJ'),
(62, 'Siti Kholifah', 'BK 2389 QWP'),
(63, 'Aldo Satria', 'BK 1347 FDN'),
(64, 'Lia Rahayu', 'BK 5941 KTR'),
(65, 'Anton Hidayat', 'BK 7056 PLX'),
(66, 'Vivi Santosa', 'BK 9284 WCF'),
(67, 'Fery Gunawan', 'BK 1357 VN'),
(68, 'Dina Purnama', 'BK 2863 YQ'),
(69, 'Tina Amalia', 'BK 5374 ZW'),
(70, 'Suleman Halim', 'BK 7429 VQK');