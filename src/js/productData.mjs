const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export async function getData(category = "tents") {
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
    if (!baseURL) {
      throw new Error("No API base URL");
    }
    
    const response = await fetch(baseURL + `product/${id}`);
    
    if (!response.ok) {
      throw new Error(`API response not ok: ${response.status}`);
    }
    
    const data = await convertToJson(response);
    
    return data.Result;
  } catch (error) {
    return findProductInLocalData(id);
  }
}

async function findProductInLocalData(id) {
  const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
  
  for (const category of categories) {
    try {
      const response = await fetch(`/json/${category}.json`);
      if (response.ok) {
        const products = await response.json();
        const product = products.find(p => p.Id === id);
        if (product) {
          return product;
        }
      }
    } catch (error) {
    }
  }
  
  return null;
}
