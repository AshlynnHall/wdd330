function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export function getData(category = "tents") {
  console.log("Fetching data for category:", category);
  console.log("Fetch URL:", `/public/json/${category}.json`);
  return fetch(`/public/json/${category}.json`)
    .then(convertToJson)
    .then((data) => {
      console.log("Data received:", data);
      // Handle different data structures
      // Some files have products directly in an array, others have them in a "Result" property
      const products = Array.isArray(data) ? data : data.Result || [];
      console.log("Products extracted:", products);
      return products;
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      throw error;
    });
}

export async function findProductById(id) {
  // Try to find the product in all categories
  const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
  
  for (const category of categories) {
    try {
      const products = await getData(category);
      const product = products.find((item) => item.Id === id);
      if (product) {
        return product;
      }
    } catch (error) {
      console.log(`No products found in ${category}`);
    }
  }
  
  return null;
}
