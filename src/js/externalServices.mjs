const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export async function getProductsByCategory(category = "tents") {
  const response = await fetch(baseURL + `products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
}

export async function getSearchResults(searchTerm) {
  const response = await fetch(baseURL + `products/search/${searchTerm}`);
  const data = await convertToJson(response);
  return data.Result;
}

export async function findProductById(id) {
  try {
    console.log("Fetching product with ID:", id, "from URL:", baseURL + `product/${id}`);
    
    if (!baseURL) {
      console.warn("No API base URL found, falling back to local data");
      throw new Error("No API base URL");
    }
    
    const response = await fetch(baseURL + `product/${id}`);
    console.log("Response status:", response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`API response not ok: ${response.status}`);
    }
    
    const data = await convertToJson(response);
    console.log("Raw API response:", data);
    
    return data.Result;
  } catch (error) {
    console.error("Error fetching product from API:", error);
    console.log("Falling back to local data search");
    
    // Fallback to local data
    return findProductInLocalData(id);
  }
}

// Fallback function to search in local JSON files
async function findProductInLocalData(id) {
  const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
  
  for (const category of categories) {
    try {
      const response = await fetch(`/json/${category}.json`);
      if (response.ok) {
        const products = await response.json();
        const product = products.find(p => p.Id === id);
        if (product) {
          console.log("Found product in local data:", product);
          return product;
        }
      }
    } catch (error) {
      console.warn(`Could not load local data for ${category}:`, error);
    }
  }
  
  console.error("Product not found in local data either");
  return null;
}

export async function checkout(orderData) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  };
  
  try {
    const checkoutURL = baseURL ? baseURL + 'checkout' : 'https://wdd330-backend.onrender.com/checkout';
    const response = await fetch(checkoutURL, options);
    const data = await convertToJson(response);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginRequest(creds) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(creds)
  };
  
  const response = await fetch('http://server-nodejs.cit.byui.edu:3000/login', options);
  const data = await convertToJson(response);
  return data.accessToken;
}

export async function getOrders(token) {
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  const response = await fetch('http://server-nodejs.cit.byui.edu:3000/orders', options);
  const data = await convertToJson(response);
  return data;
}
