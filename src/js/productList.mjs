import { getProductsByCategory } from "./externalServices.mjs";

function productCardTemplate(product) {
  const imageLarge = product.Images?.PrimaryLarge || product.Image || '';
  const imageMedium = product.Images?.PrimaryMedium || product.Image || '';
  const imageSmall = product.Images?.PrimarySmall || product.Images?.PrimaryMedium || product.Image || '';
  
  const finalPrice = product.FinalPrice || product.ListPrice || 0;
  const suggestedPrice = product.SuggestedRetailPrice || product.FinalPrice || product.ListPrice || 0;
  
  let discountHtml = "";
  if (suggestedPrice > finalPrice) {
    const discountPercent = Math.round(((suggestedPrice - finalPrice) / suggestedPrice) * 100);
    discountHtml = `<div style="background: red; color: white; padding: 2px 4px; font-size: 12px; position: absolute; top: 5px; right: 5px; border: 2px solid black;">-${discountPercent}%</div>`;
  }
  
  return `<li class="product-card" style="position: relative;">
    <a href="../product_pages/?product=${product.Id}">
      ${discountHtml}
      <picture>
        <source media="(min-width: 768px)" srcset="${imageLarge}">
        <source media="(min-width: 480px)" srcset="${imageMedium}">
        <img src="${imageSmall}" alt="${product.Name}" />
      </picture>
      <h3 class="card__brand">${product.Brand?.Name || 'Unknown Brand'}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${finalPrice}</p>
    </a>
  </li>`;
}

export function renderList(productList, selector) {
  const element = document.querySelector(selector);
  if (element) {
    const htmlStrings = productList.map(productCardTemplate);
    element.innerHTML = htmlStrings.join("");
  }
}

export default async function productList(category, selector) {
  try {
    const products = await getProductsByCategory(category);
    
    renderList(products, selector);
  } catch (error) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = '<p>Unable to load products at this time. Please try again later.</p>';
    }
  }
}
