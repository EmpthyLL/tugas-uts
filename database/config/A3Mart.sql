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
    navigate VARCHAR(255),
    category VARCHAR(255),
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

INSERT INTO `drivers` (`name`, `plat_num`) VALUES
('Andi Saputra', 'BK 8347 A'),
('Siti Aisyah', 'BK 5294 QWZ'),
('Budi Santoso', 'BK 6741 PXY'),
('Rina Pratiwi', 'BK 9203 GT'),
('Ahmad Zulkarnain', 'BK 5872 KLD'),
('Dewi Lestari', 'BK 2649 RHP'),
('Toni Fauzi', 'BK 1385 ZUJ'),
('Nina Amalia', 'BK 7126 QK'),
('Eko Prasetyo', 'BK 4571 FJN'),
('Tia Setiawati', 'BK 6938 QWZ'),
('Dedi Susanto', 'BK 3852 LVX'),
('Maya Citra', 'BK 2741 BKG'),
('Rudi Hartono', 'BK 8123 CTH'),
('Zara Lestari', 'BK 5369 VDB'),
('Faisal Hidayat', 'BK 4792 IL'),
('Lina Suryani', 'BK 9514 MPF'),
('Toni Saputra', 'BK 5863 KQA'),
('Dina Anggraini', 'BK 3627 ZWB'),
('Krisna Wardana', 'BK 7289 TZN'),
('Ria Putri', 'BK 4105 WJK'),
('Heru Prabowo', 'BK 5983 LX'),
('Winda Novita', 'BK 6819 TLD'),
('Bima Aditya', 'BK 3207 MZP'),
('Sari Maharani', 'BK 9416 FHR'),
('Fajar Nugroho', 'BK 2735 BSK'),
('Mutiara Puspita', 'BK 5809 VA'),
('Rendi Saputra', 'BK 7962 JZT'),
('Citra Dewi', 'BK 1348 PRH'),
('Junaedi Halim', 'BK 9205 XC'),
('Siti Nurhaliza', 'BK 4263 WFL'),
('Agus Widodo', 'BK 5798 YXV'),
('Eva Rahayu', 'BK 6812 NLB'),
('Tommy Harsono', 'BK 2739 DQP'),
('Linda Pratiwi', 'BK 5204 ZKC'),
('Rizky Kurniawan', 'BK 3498 VFT'),
('Amelia Yuliana', 'BK 6743 VNC'),
('Irwan Setiawan', 'BK 1237 QX'),
('Siti Farida', 'BK 5816 GYJ'),
('Darto Mulyono', 'BK 7128 HNL'),
('Alya Zahria', 'BK 3947 UPI'),
('Soni Prabowo', 'BK 5426 FDC'),
('Fikri Zainuddin', 'BK 1839 QWL'),
('Indah Sari', 'BK 9645 KZH'),
('Yulianto Nugroho', 'BK 5072 PFE'),
('Nabila Rachmawati', 'BK 1386 LON'),
('Krisna Wibowo', 'BK 6814 PJV'),
('Asep Suryana', 'BK 1473 X'),
('Lia Mulyani', 'BK 6295 QWT'),
('Doni Rahmat', 'BK 7854 PZR'),
('Siska Pratama', 'BK 2958 YKJ'),
('Novianto Putra', 'BK 8467 VLU'),
('Mira Anggraini', 'BK 5132 RX'),
('Dian Kurniawan', 'BK 9576 JTV'),
('Nina Puspita', 'BK 3485 LKZ'),
('Yogi Setiawan', 'BK 4631 FXU'),
('Sari Ramadhani', 'BK 6824 WYN'),
('Fadhil Putra', 'BK 2959 TK'),
('Ria Agustin', 'BK 7643 YRL'),
('Reza Pramudya', 'BK 8217 GVR'),
('Vina Ramadhan', 'BK 5736 ZXM'),
('Rizky Fauzan', 'BK 3642 TXJ'),
('Siti Kholifah', 'BK 2389 QWP'),
('Aldo Satria', 'BK 1347 FDN'),
('Lia Rahayu', 'BK 5941 KTR'),
('Anton Hidayat', 'BK 7056 PLX'),
('Vivi Santosa', 'BK 9284 WCF'),
('Fery Gunawan', 'BK 1357 VN'),
('Dina Purnama', 'BK 2863 YQ'),
('Tina Amalia', 'BK 5374 ZW'),
('Suleman Halim', 'BK 7429 VQK');