
import React, { useState, useEffect } from 'react';

import { FaShoppingCart } from 'react-icons/fa';
import './Catalog.css';
import { products as hardcodedProducts } from './products';

const Catalog = () => {
  const [products] = useState(hardcodedProducts);
  const [filteredProducts, setFilteredProducts] = useState(hardcodedProducts);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    let result = [...products];

    // Filtering
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // Searching
    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [category, searchTerm, sortOrder, products]);

  useEffect(() => {
    const uniqueCategories = ['all', ...new Set(products.map(p => p.category))];
    setCategories(uniqueCategories);
  }, [products]);



  return (
    <div className="catalog-container">
      <div className="catalog-title">
        <h2>Nuestro Catálogo</h2>
        <p>Descubre la belleza de la artesanía Boliviana</p>
      </div>

      <div className="controls-container">
        <div className="filter-container">
          {categories.map(cat => (
            <button key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="search-sort-container">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="search-input"
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select className="sort-select" onChange={e => setSortOrder(e.target.value)}>
            <option value="asc">Precio: Ascendente</option>
            <option value="desc">Precio: Descendente</option>
          </select>
        </div>
      </div>

      <div className="products-container">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="product-card"
          >
            <div className="product-image-container">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-footer">
                <p className="price">${product.price}</p>
                <button className="add-to-cart-btn">
                  <FaShoppingCart style={{ marginRight: '8px' }} />
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
