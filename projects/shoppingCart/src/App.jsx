import { useState, useEffect, useMemo } from "react";
import { create } from "zustand";
import "./App.css";
// Ensure this path is correct for your KoLProducts.json
import KoLProductsData from "./mocks/koLProducts.json";

// Zustand Store for Theme Management
const themeStore = create((set) => ({
  currentTheme: "original", // Initial theme
  toggleTheme: () =>
    set((state) => ({
      currentTheme: state.currentTheme === "original" ? "kol" : "original",
    })),
}));

function App() {
  const [minPrice, setMinPrice] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  // We'll store the original products fetched from dummyjson.com
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]); // This will be the actively displayed products
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Get currentTheme and toggleTheme from the Zustand store
  const { currentTheme, toggleTheme } = themeStore();

  function handleMinPriceFilter(e) {
    let newMinPrice = e.target.value;
    setMinPrice(Number(newMinPrice));
  }

  function handleAddToCart(productToAdd) {
    const existingProductIndex = cart.findIndex(
      (product) => product.id === productToAdd.id,
    );

    if (existingProductIndex === -1) {
      setCart([...cart, { ...productToAdd, amount: 1 }]);
    }
  }

  function handleUpdateCartItemAmount(productId, delta) {
    setCart(
      cart.map((product) =>
        product.id === productId
          ? { ...product, amount: product.amount + delta }
          : product,
      ),
    );
  }

  function handleRemoveFromCart(productId) {
    setCart(cart.filter((product) => product.id !== productId));
  }

  // Effect to fetch initial product data and categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/products/categories",
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchOriginalProducts = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/products?select=id,title,price,description,category,thumbnail&limit=0",
        );
        const data = await response.json();
        setOriginalProducts(data.products); // Store original products
        setProducts(data.products); // Initially display original products
      } catch (error) {
        console.error("Error fetching original products:", error);
      }
    };

    fetchCategories();
    fetchOriginalProducts();
  }, []);

  // Effect to update products based on theme
  useEffect(() => {
    if (currentTheme === "kol") {
      // Map KoL specific titles/descriptions onto the original products
      const kolThemedProducts = originalProducts.map((originalProduct) => {
        const kolProduct = KoLProductsData.find(
          (kolItem) => kolItem.id === originalProduct.id,
        );
        return {
          ...originalProduct,
          // If a matching KoL product is found, use its title/description
          // Otherwise, revert to original (or keep current if no match)
          title: kolProduct ? kolProduct.kolTitle : originalProduct.title,
          description: kolProduct
            ? kolProduct.kolDescription
            : originalProduct.description,
        };
      });
      setProducts(kolThemedProducts);
    } else {
      // Revert to original products
      setProducts(originalProducts);
    }
  }, [currentTheme, originalProducts]); // Re-run when theme or original products change

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (minPrice > 0) {
      result = result.filter((product) => product.price >= minPrice);
    }

    if (selectedCategory) {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }
    return result;
  }, [minPrice, selectedCategory, products]);

  console.log("Displayed products:", products);

  return (
    <div className="App">
      <div className="controls-section">
        <h1>Product Catalog</h1>
        <button type="button" onClick={() => setShowCart(!showCart)}>
          {showCart ? "Hide Cart" : `Show Cart (${cart.length} items)`}
        </button>
        {/* Button to toggle between original and KoL theme */}
        <button type="button" onClick={toggleTheme}>
          {currentTheme === "original"
            ? "Change to Kingdom of Loathing Theme"
            : "Revert to Original Theme"}
        </button>
      </div>

      {showCart && (
        <div className="cart-overlay">
          <div className="cart-content">
            <h2>Your Shopping Cart</h2>
            <ul className="cart-list">
              {cart.length === 0 && (
                <li className="empty-cart-message">The cart is empty</li>
              )}
              {cart.map((product) => (
                <li key={product.id} className="cart-item">
                  <img src={product.thumbnail} alt={product.title} />
                  <div>
                    {/* Titles in cart will also reflect the theme */}
                    <h3>{product.title}</h3>
                    <p className="price">${product.price}</p>
                    <p>Quantity: {product.amount}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      onClick={() => handleUpdateCartItemAmount(product.id, 1)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        if (product.amount > 1) {
                          handleUpdateCartItemAmount(product.id, -1);
                        } else {
                          handleRemoveFromCart(product.id);
                        }
                      }}
                    >
                      -
                    </button>
                    <button onClick={() => handleRemoveFromCart(product.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="filter-controls">
        <label htmlFor="minPrice">Minimum Price: ${minPrice}</label>
        <input
          type="range"
          id="minPrice"
          name="minPrice"
          onChange={handleMinPriceFilter}
          value={minPrice}
          min="0"
          max="1000"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="product-list">
        {filteredProducts.length === 0 && (
          <li>No products found matching your criteria.</li>
        )}
        {filteredProducts.map((product) => (
          <li key={product.id} className="product-item">
            <img src={product.thumbnail} alt={product.thumbnail} />
            <div>
              <h3>{product.title}</h3> {/* Will be original or KoL themed */}
              <p className="price">${product.price}</p>
              <p>{product.description}</p>{" "}
              {/* Will be original or KoL themed */}
            </div>
            <button type="button" onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
