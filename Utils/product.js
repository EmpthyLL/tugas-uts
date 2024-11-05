async function fetchProducts() {
    try {
      const response = await fetch('https://dummyjson.com/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.products; 
    } catch (error) {
      console.error(error);
    }
  }

  function groupByCategory(products) {
    const categoryMap = {};
    products.forEach(product => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = []; 
      }
      categoryMap[product.category].push(product);
    });
    return categoryMap;
  }

  async function displayProductsByCategory() {
    const products = await fetchProducts();
    const groupedProducts = groupByCategory(products);

    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = ''; 

    for (const category in groupedProducts) {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category';

      const categoryTitle = document.createElement('h2');
      categoryTitle.innerText = category;
      categoryDiv.appendChild(categoryTitle);

      groupedProducts[category].forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerText = product.title; 
        categoryDiv.appendChild(productDiv);
      });

      categoriesContainer.appendChild(categoryDiv);
    }
  }

  displayProductsByCategory();async function fetchProducts() {
    try {
      const response = await fetch('https://dummyjson.com/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.products; 
    } catch (error) {
      console.error(error);
    }
  }


  function groupByCategory(products) {
    const categoryMap = {};
    products.forEach(product => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = []; 
      }
      categoryMap[product.category].push(product); 
    });
    return categoryMap;
  }

  async function displayProductsByCategory() {
    const products = await fetchProducts();
    const groupedProducts = groupByCategory(products);

    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = ''; 

    for (const category in groupedProducts) {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category m-4 p-2 border-b border-gray-300';

      const categoryTitle = document.createElement('h2');
      categoryTitle.className = 'text-lg font-bold mb-2';
      categoryTitle.innerText = category;
      categoryDiv.appendChild(categoryTitle);

      groupedProducts[category].forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product p-1';
        productDiv.innerText = product.title; 
        categoryDiv.appendChild(productDiv);
      });

      categoriesContainer.appendChild(categoryDiv);
    }
}

document.addEventListener('DOMContentLoaded', displayProductsByCategory);