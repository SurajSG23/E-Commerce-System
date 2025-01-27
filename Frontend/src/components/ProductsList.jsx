// src/ProductsList.js
import React, { useState, useEffect } from 'react';
import { fetchProducts } from './api';

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.product_id}>
            {product.name} - ${product.price} - {product.stock} in stock
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
