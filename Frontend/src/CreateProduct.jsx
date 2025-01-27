import React, { useState, useEffect } from 'react';
import { createProduct, fetchProducts, fetchCategories } from './api';

function CreateProduct({ refreshProducts }) {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: ''
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(response => setCategories(response.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(product).then(() => {
      refreshProducts();
      setProduct({ name: '', price: '', stock: '', category_id: '' });
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <input
            type="text"
            name="name"
            value={product.name}
            placeholder="Product Name"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Product Price */}
        <div>
          <input
            type="number"
            name="price"
            value={product.price}
            placeholder="Price"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Product Stock */}
        <div>
          <input
            type="number"
            name="stock"
            value={product.stock}
            placeholder="Stock"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
