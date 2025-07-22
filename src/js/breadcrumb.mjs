/**
 * Breadcrumb utility for dynamic navigation context
 */

export function initializeBreadcrumb() {
    console.log("🍞 Initializing breadcrumb...");
    updateBreadcrumb();
}

export function updateBreadcrumb() {
    const breadcrumbNav = document.getElementById('breadcrumb');
    const breadcrumbContent = document.getElementById('breadcrumb-content');
    
    if (!breadcrumbNav || !breadcrumbContent) {
        console.log("🍞 Breadcrumb elements not found");
        return;
    }

    const currentPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    console.log("🍞 Current path:", currentPath);
    
    // Hide breadcrumb on home page
    if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html')) {
        console.log("🍞 Home page - hiding breadcrumb");
        breadcrumbNav.style.display = 'none';
        return;
    }

    let breadcrumbHtml = '<a href="/index.html">Home</a>';
    let shouldShow = false;
    
    // Product list pages
    if (currentPath.includes('/product-list/')) {
        shouldShow = true;
        const category = urlParams.get('category');
        const searchTerm = urlParams.get('search');
        
        if (searchTerm) {
            const itemCount = getProductCount();
            breadcrumbHtml += ` > <span>Search: "${searchTerm}" (${itemCount} items)</span>`;
        } else if (category) {
            const categoryName = formatCategoryName(category);
            const itemCount = getProductCount();
            breadcrumbHtml += ` > <span>${categoryName} (${itemCount} items)</span>`;
        }
    }
    // Product detail pages
    else if (currentPath.includes('/product_pages/')) {
        shouldShow = true;
        const category = urlParams.get('category');
        const product = urlParams.get('product');
        
        if (category) {
            const categoryName = formatCategoryName(category);
            breadcrumbHtml += ` > <a href="/product-list/?category=${category}">${categoryName}</a>`;
            
            if (product) {
                const productName = getProductName(product);
                breadcrumbHtml += ` > <span>${productName}</span>`;
            }
        }
    }
    // Cart page
    else if (currentPath.includes('/cart/')) {
        shouldShow = true;
        breadcrumbHtml += ' > <span>Shopping Cart</span>';
    }
    // Checkout page
    else if (currentPath.includes('/checkout/')) {
        shouldShow = true;
        breadcrumbHtml += ' > <a href="/cart/">Shopping Cart</a> > <span>Checkout</span>';
    }

    console.log("🍞 Should show:", shouldShow, "HTML:", breadcrumbHtml);
    
    if (shouldShow) {
        breadcrumbContent.innerHTML = breadcrumbHtml;
        breadcrumbNav.style.display = 'block';
        console.log("🍞 Breadcrumb displayed");
    } else {
        breadcrumbNav.style.display = 'none';
        console.log("🍞 Breadcrumb hidden");
    }
}

function formatCategoryName(category) {
    const categoryNames = {
        'tents': 'Tents',
        'backpacks': 'Backpacks',
        'sleeping-bags': 'Sleeping Bags',
        'hammocks': 'Hammocks'
    };
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

function getProductCount() {
    // Try to get count from a global variable set by product list
    if (window.currentProductCount !== undefined) {
        return window.currentProductCount;
    }
    
    // Fallback: count products in the DOM
    const productElements = document.querySelectorAll('.product-card, .product-item, [class*="product"]');
    if (productElements.length > 0) {
        return productElements.length;
    }
    
    // Default fallback
    return 0;
}

function getProductName(productId) {
    // Try to get product name from a global variable set by product detail
    if (window.currentProductName) {
        return window.currentProductName;
    }
    
    // Fallback: get from page title or heading
    const pageTitle = document.querySelector('h1, .product-detail h2, .product-detail h3');
    if (pageTitle) {
        return pageTitle.textContent.trim();
    }
    
    // Final fallback: format the product ID
    return productId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Update breadcrumb when navigating (for SPAs)
export function updateBreadcrumbForCategory(category, count) {
    console.log("🍞 updateBreadcrumbForCategory called:", { category, count });
    window.currentProductCount = count;
    // Ensure breadcrumb elements exist before updating
    setTimeout(() => {
        updateBreadcrumb();
    }, 100);
}

export function updateBreadcrumbForProduct(productName) {
    console.log("🍞 updateBreadcrumbForProduct called:", productName);
    window.currentProductName = productName;
    // Ensure breadcrumb elements exist before updating
    setTimeout(() => {
        updateBreadcrumb();
    }, 100);
}

// Force breadcrumb update - can be called from anywhere
export function forceBreadcrumbUpdate() {
    console.log("🍞 forceBreadcrumbUpdate called");
    setTimeout(() => {
        updateBreadcrumb();
    }, 200);
}
