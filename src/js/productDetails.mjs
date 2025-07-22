import { findProductById } from "./externalServices.mjs";
import { setLocalStorage, getLocalStorage, animateCartIcon, updateCartCount, getParam } from "./utils.mjs";
import { showProductBreadcrumb } from "./breadcrumb.mjs";

let product = {};
let currentImageIndex = 0;
let allImages = [];

function addToCart() {
  let cartItems = getLocalStorage("so-cart") || [];
  
  const existingItemIndex = cartItems.findIndex(item => item.Id === product.Id);
  
  if (existingItemIndex > -1) {
    const currentQuantity = cartItems[existingItemIndex].quantity || 1;
    cartItems[existingItemIndex].quantity = currentQuantity + 1;
  } else {
    const productToAdd = { ...product, quantity: 1 };
    cartItems.push(productToAdd);
  }

  setLocalStorage("so-cart", cartItems);
  
  updateCartCount();
  
  // Animate the cart icon to show something was added
  animateCartIcon();
}

function renderProductDetails() {
  document.getElementById("productName").textContent = product.Name;
  document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
  
  const productImage = document.getElementById("productImage");
  const productImageMedium = document.getElementById("productImageMedium");
  const productImageLarge = document.getElementById("productImageLarge");
  
  const imageLarge = product.Images?.PrimaryLarge || product.Image || '';
  const imageMedium = product.Images?.PrimaryMedium || product.Image || '';
  const imageSmall = product.Images?.PrimarySmall || product.Images?.PrimaryMedium || product.Image || '';
  
  productImage.src = imageSmall;
  productImage.alt = product.Name;
  productImageMedium.srcset = imageMedium;
  productImageLarge.srcset = imageLarge;
  
  document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice || product.ListPrice || 0}`;
  document.getElementById("productColorName").textContent = product.Colors[0]?.ColorName || 'N/A';
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").setAttribute("data-id", product.Id);
  
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const discountPercent = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    
    const productDetailSection = document.querySelector(".product-detail");
    if (productDetailSection) {
      productDetailSection.style.position = "relative";
    }
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
  allImages = [];
  
  if (product.Images?.PrimaryLarge) {
    allImages.push({
      large: product.Images.PrimaryLarge,
      medium: product.Images.PrimaryMedium || product.Images.PrimaryLarge,
      small: product.Images.PrimarySmall || product.Images.PrimaryMedium || product.Images.PrimaryLarge
    });
  }
  
  if (product.Images?.ExtraImages && Array.isArray(product.Images.ExtraImages)) {
    product.Images.ExtraImages.forEach(extraImage => {
      allImages.push({
        large: extraImage.Src || extraImage,
        medium: extraImage.Src || extraImage,
        small: extraImage.Src || extraImage
      });
    });
  }
  
  if (allImages.length > 1) {
    const thumbnailContainer = document.getElementById('imageThumbnails');
    
    if (thumbnailContainer) {
      thumbnailContainer.classList.remove('hide');
      
      thumbnailContainer.innerHTML = allImages.map((img, index) => 
        `<img class="thumbnail ${index === 0 ? 'active' : ''}" 
              src="${img.small}" 
              alt="Product image ${index + 1}" 
              data-index="${index}">`
      ).join('');
      
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
  
  document.getElementById('productImage').src = image.small;
  document.getElementById('productImageMedium').srcset = image.medium;
  document.getElementById('productImageLarge').srcset = image.large;
  
  document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

export default async function productDetails(productId) {
  try {
    product = await findProductById(productId);
    
    if (!product) {
      renderProductNotFound(productId);
      return;
    }
    
    renderProductDetails();
    
    setupImageCarousel();
    
    let category = getParam("category");
    
    if (!category) {
      if (product.Category) {
        category = product.Category.toLowerCase().replace(/\s+/g, '-');
      } else {
        if (productId.includes('tent') || productId.includes('ajax') || productId.includes('alpine') || productId.includes('talus') || productId.includes('rimrock')) {
          category = 'tents';
        } else if (productId.includes('backpack') || productId.includes('pack')) {
          category = 'backpacks';
        } else if (productId.includes('sleeping') || productId.includes('bag')) {
          category = 'sleeping-bags';
        } else if (productId.includes('hammock')) {
          category = 'hammocks';
        } else {
          category = 'tents';
        }
      }
    }
    

    
    setTimeout(() => {
      showProductBreadcrumb(category, product.NameWithoutBrand || product.Name);
    }, 200);
    
    await loadRecommendations();
    
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", addToCart);
    }
    
    loadRecommendations();
    
    setupImageCarousel();
  } catch (error) {
    renderProductNotFound(productId || "unknown");
  }
}
