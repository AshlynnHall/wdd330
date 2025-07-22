import { findProductById } from "./externalServices.mjs";
import { setLocalStorage, getLocalStorage, animateCartIcon, updateCartCount, getParam } from "./utils.mjs";
import { showProductBreadcrumb } from "./breadcrumb.mjs";

let product = {};
let currentImageIndex = 0;
let allImages = [];

function addToCart() {
  // Get existing cart items or start with an empty array
  let cartItems = getLocalStorage("so-cart") || [];
  
  // Check if this product is already in the cart
  const existingItemIndex = cartItems.findIndex(item => item.Id === product.Id);
  
  if (existingItemIndex > -1) {
    // Product already exists, increase quantity
    const currentQuantity = cartItems[existingItemIndex].quantity || 1;
    cartItems[existingItemIndex].quantity = currentQuantity + 1;
  } else {
    // New product, add to cart with quantity of 1
    const productToAdd = { ...product, quantity: 1 };
    cartItems.push(productToAdd);
  }
  
  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cartItems);
  
  // Update cart count display
  updateCartCount();
  
  // Animate the cart icon to show something was added
  animateCartIcon();
}

function renderProductDetails() {
  document.getElementById("productName").textContent = product.Name;
  document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
  
  // Set up responsive images
  const productImage = document.getElementById("productImage");
  const productImageMedium = document.getElementById("productImageMedium");
  const productImageLarge = document.getElementById("productImageLarge");
  
  // Get different image sizes
  const imageLarge = product.Images?.PrimaryLarge || product.Image || '';
  const imageMedium = product.Images?.PrimaryMedium || product.Image || '';
  const imageSmall = product.Images?.PrimarySmall || product.Images?.PrimaryMedium || product.Image || '';
  
  // Set the image sources for responsive display
  productImage.src = imageSmall;
  productImage.alt = product.Name;
  productImageMedium.srcset = imageMedium;
  productImageLarge.srcset = imageLarge;
  
  document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice || product.ListPrice || 0}`;
  document.getElementById("productColorName").textContent = product.Colors[0]?.ColorName || 'N/A';
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").setAttribute("data-id", product.Id);
  
  // Add discount indicator if there's a discount (same style as main page)
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const discountPercent = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    
    // Make the product detail section relative for positioning
    const productDetailSection = document.querySelector(".product-detail");
    if (productDetailSection) {
      productDetailSection.style.position = "relative";
    }
    
    // Create and add discount badge (same style as main page)
    const discountBadge = document.createElement("div");
    discountBadge.style.cssText = "background: red; color: white; padding: 2px 4px; font-size: 12px; position: absolute; top: 75px; right: 15px; border: 2px solid black; z-index: 10;";
    discountBadge.textContent = `-${discountPercent}%`;
    productDetailSection.appendChild(discountBadge);
  }
}

function renderProductNotFound(productId) {
  const productDetailSection = document.querySelector(".product-detail");
  if (productDetailSection) {
    productDetailSection.style.display = "none";
  }
  
  const main = document.querySelector("main");
  if (main) {
    const errorContainer = document.createElement("div");
    errorContainer.className = "error-container";
    errorContainer.innerHTML = `
      <div class="error-message">
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
      </div>
    `;
    main.appendChild(errorContainer);
  }
}

async function loadRecommendations() {
  const recommendedIds = ['989CG', '21KMF'];
  const recommendationsContainer = document.getElementById('recommendations-list');
  
  if (!recommendationsContainer) return;
  
  try {
    const recommendations = await Promise.all(
      recommendedIds.map(id => findProductById(id))
    );
    
    const validRecommendations = recommendations.filter(product => product !== null);
    
    if (validRecommendations.length === 0) {
      recommendationsContainer.innerHTML = '<p>No recommendations available.</p>';
      return;
    }
    
    const recommendationsHtml = validRecommendations.map(product => `
      <li class="product-card">
        <a href="index.html?product=${product.Id}">
          <img src="${product.Images?.PrimaryMedium || product.Image}" alt="${product.Name}" />
          <h3 class="card__brand">${product.Brand?.Name || ''}</h3>
          <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
          <p class="product-card__price">$${product.FinalPrice || product.ListPrice || 0}</p>
        </a>
      </li>
    `).join('');
    
    recommendationsContainer.innerHTML = recommendationsHtml;
  } catch (error) {
    recommendationsContainer.innerHTML = '<p>Unable to load recommendations.</p>';
  }
}

function setupImageCarousel() {
  // Gather all images
  allImages = [];
  
  // Add primary image
  if (product.Images?.PrimaryLarge) {
    allImages.push({
      large: product.Images.PrimaryLarge,
      medium: product.Images.PrimaryMedium || product.Images.PrimaryLarge,
      small: product.Images.PrimarySmall || product.Images.PrimaryMedium || product.Images.PrimaryLarge
    });
  }
  
  // Add extra images if they exist
  if (product.Images?.ExtraImages && Array.isArray(product.Images.ExtraImages)) {
    product.Images.ExtraImages.forEach(extraImage => {
      allImages.push({
        large: extraImage.Src || extraImage,
        medium: extraImage.Src || extraImage,
        small: extraImage.Src || extraImage
      });
    });
  }
  
  // If we have more than one image, show thumbnails
  if (allImages.length > 1) {
    const thumbnailContainer = document.getElementById('imageThumbnails');
    
    if (thumbnailContainer) {
      thumbnailContainer.classList.remove('hide');
      
      // Create thumbnails
      thumbnailContainer.innerHTML = allImages.map((img, index) => 
        `<img class="thumbnail ${index === 0 ? 'active' : ''}" 
              src="${img.small}" 
              alt="Product image ${index + 1}" 
              data-index="${index}">`
      ).join('');
      
      // Add thumbnail click handlers
      thumbnailContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('thumbnail')) {
          const index = parseInt(e.target.dataset.index);
          showImage(index);
        }
      });
    }
  }
}

function showImage(index) {
  if (index < 0 || index >= allImages.length) return;
  
  currentImageIndex = index;
  const image = allImages[index];
  
  // Update main image
  document.getElementById('productImage').src = image.small;
  document.getElementById('productImageMedium').srcset = image.medium;
  document.getElementById('productImageLarge').srcset = image.large;
  
  // Update active thumbnail
  document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

export default async function productDetails(productId) {
  try {
    // use findProductById to get the details for the current product
    product = await findProductById(productId);
    
    if (!product) {
      // Show error message to user if product not found
      renderProductNotFound(productId);
      return;
    }
    
    // once we have the product details we can render out the HTML
    renderProductDetails();
    
    // Setup image carousel if multiple images exist
    setupImageCarousel();
    
    // Update breadcrumb with product name
    let category = getParam("category");
    
    // If no category parameter, try to determine from product data or URL
    if (!category) {
      // Try to determine category from product category field
      if (product.Category) {
        category = product.Category.toLowerCase().replace(/\s+/g, '-');
      } else {
        // Fallback: try to determine from product ID patterns or default to 'tents'
        if (productId.includes('tent') || productId.includes('ajax') || productId.includes('alpine') || productId.includes('talus') || productId.includes('rimrock')) {
          category = 'tents';
        } else if (productId.includes('backpack') || productId.includes('pack')) {
          category = 'backpacks';
        } else if (productId.includes('sleeping') || productId.includes('bag')) {
          category = 'sleeping-bags';
        } else if (productId.includes('hammock')) {
          category = 'hammocks';
        } else {
          // Default fallback
          category = 'tents';
        }
      }
    }
    

    
    // Show breadcrumb
    setTimeout(() => {
      showProductBreadcrumb(category, product.NameWithoutBrand || product.Name);
    }, 200);
    
    // Load product recommendations
    await loadRecommendations();
    
    // add a listener to Add to Cart button
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", addToCart);
    }
    
    // Load product recommendations
    loadRecommendations();
    
    // Set up image carousel
    setupImageCarousel();
  } catch (error) {
    // Show error message to user if there's any other error
    renderProductNotFound(productId || "unknown");
  }
}
