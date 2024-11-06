const express = require('express');
const path = require('path');
const { getProductsByCategory } = require('./product'); // Import fungsi dari product.js

const app = express();
const PORT = 3000;

// Set view engine ke EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk menyajikan file statis
app.use(express.static(path.join(__dirname, 'public')));

// Rute untuk mendapatkan produk per kategori
app.get('/products', async (req, res) => {
    try {
        const { categories, productByCategory } = await getProductsByCategory();
        res.render('index', { categories, productByCategory });
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
