import { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";

function App() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [custom, setCustom] = useState(false);
  const [options, setOptions] = useState({
    category: [],
    type: [],
    safe: false,
    lang: "en",
    amount: 1,
    search: "",
    blackListFlags: {
      nsfw: false,
      religious: false,
      political: false,
      racist: false,
      sexist: false,
      explicit: false,
    },
  });

  // Fetch jokes from API based on current options
  const getJoke = async () => {
    setLoading(true);
    setError("");

    try {
      // Basic validation before making the request
      if (options.amount < 1 || options.amount > 10) {
        throw new Error("Amount must be between 1 and 10");
      }

      // 1. Build categories part of URL
      const categories =
        options.category.length > 0 ? options.category.join(",") : "Any";

      // 2. Collect all parameters
      const params = [];

      if (options.lang) params.push(`lang=${options.lang}`);
      if (options.type) params.push(`type=${options.type.join(",")}`);
      if (options.safe) params.push("safe-mode");
      if (options.amount > 0) params.push(`amount=${options.amount}`);
      if (options.search) params.push(`contains=${options.search}`);

      // 3. Process blacklist flags
      const blacklistFlags = Object.entries(options.blackListFlags)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(",");

      if (blacklistFlags) params.push(`blacklistFlags=${blacklistFlags}`);

      // Build final URL
      const queryString = params.length > 0 ? `?${params.join("&")}` : "";
      const url = `https://v2.jokeapi.dev/joke/${categories}${queryString}`;
      console.log(url);
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No jokes found matching your criteria");
        } else if (response.status === 429) {
          throw new Error("Too many requests. Please wait before trying again");
        } else if (response.status === 400) {
          throw new Error("No jokes found matching your criteria");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const result = await response.json();

      // Validate response structure
      if (options.amount > 1) {
        if (!result.jokes || !Array.isArray(result.jokes)) {
          throw new Error("Invalid response format for multiple jokes");
        }
      } else {
        if (
          !result.type ||
          (!result.joke && !(result.setup && result.delivery))
        ) {
          throw new Error("Invalid joke format received");
        }
      }

      setData(result);
    } catch (err) {
      if (err.message.includes("No matching joke found")) {
        setError(
          "No jokes match your selected criteria. Try changing filters.",
        );
      } else if (err.message.includes("Too many requests")) {
        setError("You're requesting jokes too fast. Please wait a moment.");
      } else {
        setError(
          "Failed to fetch jokes. Please check your connection and try again.",
        );
      }
      setError(err.message);
      setData(null); // Clear data on error
      setLoading(false);
    } finally {
      setLoading(false);
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle category radio button toggle
  const handleCategoryToggle = (e) => {
    const isCustom = e.target.id === "categoryCustom";
    setCustom(isCustom);
    if (!isCustom) {
      setOptions((prev) => ({ ...prev, category: [] }));
    }
  };

  // Handle category checkbox changes
  const handleSettingCategory = (e) => {
    const { value, checked } = e.target;

    setOptions((prevOptions) => {
      const updatedCategories = checked
        ? [...prevOptions.category, value]
        : prevOptions.category.filter((cat) => cat !== value);

      return {
        ...prevOptions,
        category: updatedCategories,
      };
    });
  };

  // Available joke categories
  const availableCategories = [
    { id: "categoryProgramming", value: "Programming", label: "Programming" },
    { id: "categoryMisc", value: "Misc", label: "Miscellaneous" },
    { id: "categoryDark", value: "Dark", label: "Dark" },
    { id: "categoryPun", value: "Pun", label: "Pun" },
    { id: "categorySpooky", value: "Spooky", label: "Spooky" },
    { id: "categoryChristmas", value: "Christmas", label: "Christmas" },
  ];

  // Toggle blacklist flags
  const handleBlacklistToggle = (flag) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      blackListFlags: {
        ...prevOptions.blackListFlags,
        [flag]: !prevOptions.blackListFlags[flag],
      },
    }));
  };

  // Handle language selection
  const selectedLanguageHandle = (e) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      lang: e.value,
    }));
  };

  // Language options for dropdown
  const languageOptions = [
    { value: "en", label: "🇺🇸 English" },
    { value: "es", label: "🇪🇸 Spanish" },
    { value: "pt", label: "🇵🇹 Portuguese" },
    { value: "de", label: "🇩🇪 German" },
    { value: "fr", label: "🇫🇷 French" },
  ];

  // Custom styles for react-select dropdown
  const comicSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      // Adjusted border to match the slightly thicker theme elements
      border: "4px solid var(--comic-black)",
      borderRadius: "10px", // Slightly more rounded corners
      // More pronounced shadow, similar to other elements
      boxShadow: state.isFocused
        ? "5px 5px 0 var(--comic-blue)"
        : "5px 5px 0 var(--comic-shadow)",
      fontFamily: '"Comic Neue", cursive', // Use Comic Neue for control text
      fontSize: "1.3rem", // Slightly larger font size
      padding: "8px 15px", // Increased padding
      cursor: "pointer",
      minHeight: "55px", // Increased minimum height
      backgroundColor: "var(--comic-white)",
      transition: "all 0.2s ease", // Slightly longer transition
      "&:hover": {
        borderColor: "var(--comic-blue)",
        boxShadow: "5px 5px 0 var(--comic-blue)", // Consistent hover shadow
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 10px", // Adjusted padding
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none", // Keep indicator separator hidden
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "var(--comic-blue)" : "var(--comic-red)", // Color change on focus
      padding: "10px", // Increased padding
      transition: "color 0.2s ease", // Smooth color transition
      "&:hover": {
        color: "var(--comic-black)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      border: "4px solid var(--comic-black)", // Thicker border for menu
      borderRadius: "10px", // Consistent border radius
      boxShadow: "6px 6px 0 var(--comic-shadow)", // More pronounced shadow for menu
      overflow: "hidden",
      marginTop: "12px", // Adjusted margin top
      zIndex: 9999, // Add a high z-index to ensure it appears on top
    }),
    option: (provided, state) => ({
      ...provided,
      fontFamily: '"Comic Neue", cursive',
      fontSize: "1.2rem", // Slightly larger font size for options
      padding: "15px 20px", // Consistent padding
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "var(--comic-blue)"
        : state.isFocused
          ? "var(--comic-yellow)"
          : "var(--comic-white)",
      color: state.isSelected ? "var(--comic-white)" : "var(--comic-black)",
      transition: "background-color 0.15s ease, color 0.15s ease", // Smooth transition
      "&:active": {
        backgroundColor: "var(--comic-blue)", // Added active state color
        color: "var(--comic-white)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--comic-black)",
      fontFamily: '"Comic Neue", cursive',
    }),
    // Added styles for the placeholder
    placeholder: (provided) => ({
      ...provided,
      color: "#6c757d", // Softer placeholder color
      fontStyle: "italic", // Italic placeholder
    }),
    // Added styles for the container
    container: (provided) => ({
      ...provided,
      transition: "box-shadow 0.2s ease", // Transition for consistency
    }),
  };

  // Handle joke type selection
  const handleType = (e) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      type: prevOptions.type.includes(e.target.value)
        ? prevOptions.type.filter((item) => item !== e.target.value)
        : [...prevOptions.type, e.target.value],
    }));
  };

  // Handle search input
  const handleSearch = (e) => {
    setOptions((prevOptions) => ({ ...prevOptions, search: e.target.value }));
  };

  // Toggle safe mode
  const handleSafeMode = (e) => {
    setOptions((prevOptions) => ({ ...prevOptions, safe: e.target.checked }));
  };

  // Set default joke types on component mount
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      type: ["single", "twopart"],
    }));
  }, []);

  // Fetch initial joke on component mount
  useEffect(() => {
    getJoke();
  }, []);

  if (error) {
    return (
      <div className="error-message">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => {
            setError("");
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="app-container">
      <header className="comic-header">
        <h1 className="comic-title">Joke Generator 3000!</h1>
        <p className="app-subtitle">BAM! POW! LAUGH!</p>
      </header>

      <div className="joke-container">
        {loading ? (
          <div className="loading-indicator">LOADING... ⚡</div>
        ) : error ? (
          <div className="error-message">
            <p>💥 {error}</p>
            <button className="get-joke-btn" onClick={getJoke}>
              TRY AGAIN
            </button>
          </div>
        ) : !data ? (
          <div className="error-message">NO DATA!</div>
        ) : "amount" in data ? (
          <>
            {data.jokes.map((joke, index) => (
              <div key={index} className="comic-panel">
                <p className="comic-label">JOKE #{index + 1}</p>
                {joke.type === "single" ? (
                  <p className="setup">{joke.joke}</p>
                ) : (
                  <>
                    <p className="setup">{joke.setup}</p>
                    <p className="delivery">{joke.delivery}</p>
                  </>
                )}
              </div>
            ))}
          </>
        ) : data.type === "single" ? (
          <p className="setup">{data.joke}</p>
        ) : (
          <>
            <p className="setup">{data.setup}</p>
            <p className="delivery">{data.delivery}</p>
          </>
        )}
      </div>

      <div className="controls-container">
        <div className="comic-panel">
          <h3>Categories</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                className="comic-radio"
                id="categoryAny"
                name="category"
                onChange={handleCategoryToggle}
                checked={!custom}
              />
              ANY
            </label>
            <label>
              <input
                type="radio"
                className="comic-radio"
                id="categoryCustom"
                name="category"
                onChange={handleCategoryToggle}
                checked={custom}
              />
              CUSTOM
            </label>
          </div>
          <div className="checkbox-group">
            {availableCategories.map((category) => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  className="comic-checkbox"
                  value={category.value}
                  onChange={handleSettingCategory}
                  disabled={!custom}
                  checked={options.category.includes(category.value)}
                />
                {category.label}
              </label>
            ))}
          </div>
        </div>

        <div className="comic-panel">
          <h3>Language</h3>
          <div>
            <Select
              styles={comicSelectStyles}
              options={languageOptions}
              value={languageOptions.find((opt) => opt.value === options.lang)}
              onChange={selectedLanguageHandle}
              isSearchable={false}
              components={{
                IndicatorSeparator: () => null,
              }}
            />
          </div>
        </div>

        <div className="comic-panel">
          <h3>Safety First!</h3>
          <label>
            <input
              type="checkbox"
              className="comic-checkbox"
              checked={options.safe}
              onChange={handleSafeMode}
            />
            SAFE MODE 🛡️
          </label>
        </div>

        <div className="comic-panel">
          <h3>Content Filters 🚫</h3>
          <div className="checkbox-group">
            {Object.keys(options.blackListFlags).map((flag) => (
              <label key={flag}>
                <input
                  type="checkbox"
                  checked={options.blackListFlags[flag]}
                  onChange={() => handleBlacklistToggle(flag)}
                  className="comic-checkbox"
                />
                {flag.charAt(0).toUpperCase() + flag.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="comic-panel">
          <h3>Joke Type</h3>
          <label>
            <input
              type="checkbox"
              className="comic-checkbox"
              value="single"
              onChange={handleType}
              checked={options.type.includes("single")}
            />
            SINGLE 🎯
          </label>
          <label>
            <input
              type="checkbox"
              className="comic-checkbox"
              value="twopart"
              onChange={handleType}
              checked={options.type.includes("twopart")}
            />
            TWO-PART 🎭
          </label>
        </div>

        <div className="comic-panel">
          <h3>Joke Power Level!</h3>
          <input
            type="range"
            className="comic-slider"
            min="1"
            max="10"
            value={options.amount}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, amount: e.target.value }))
            }
          />
          <div className="amount-display">{options.amount}</div>
        </div>

        <div className="comic-panel">
          <h3>Secret Code Search 🔍</h3>
          <input
            type="text"
            className="comic-search"
            placeholder="Enter magic words..."
            onChange={handleSearch}
            value={options.search}
          />
        </div>

        <button className="get-joke-btn" onClick={getJoke}>
          GENERATE JOKE! 💥
        </button>
      </div>
    </main>
  );
}

export default App;
