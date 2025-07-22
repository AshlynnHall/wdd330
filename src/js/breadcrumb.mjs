export function setBreadcrumb(breadcrumbHtml) {
    const breadcrumbNav = document.getElementById('breadcrumb');
    const breadcrumbContent = document.getElementById('breadcrumb-content');
    
    if (breadcrumbNav && breadcrumbContent) {
        breadcrumbContent.innerHTML = breadcrumbHtml;
        breadcrumbNav.style.display = 'block';
    }
}

export function hideBreadcrumb() {
    const breadcrumbNav = document.getElementById('breadcrumb');
    if (breadcrumbNav) {
        breadcrumbNav.style.display = 'none';
    }
}

export function showCategoryBreadcrumb(category, count) {
    const categoryNames = {
        'tents': 'Tents',
        'backpacks': 'Backpacks',
        'sleeping-bags': 'Sleeping Bags',
        'hammocks': 'Hammocks'
    };
    
    const categoryName = categoryNames[category] || category;
    const breadcrumbHtml = `<a href="/index.html">Home</a> > <span>${categoryName} (${count} items)</span>`;
    setBreadcrumb(breadcrumbHtml);
}

export function showProductBreadcrumb(category, productName) {
    const categoryNames = {
        'tents': 'Tents',
        'backpacks': 'Backpacks',
        'sleeping-bags': 'Sleeping Bags',
        'hammocks': 'Hammocks'
    };
    
    const categoryName = categoryNames[category] || category;
    const breadcrumbHtml = `<a href="/index.html">Home</a> > <a href="/product-list/?category=${category}">${categoryName}</a> > <span>${productName}</span>`;
    setBreadcrumb(breadcrumbHtml);
}

export function showCartBreadcrumb() {
    const breadcrumbHtml = `<a href="/index.html">Home</a> > <span>Shopping Cart</span>`;
    setBreadcrumb(breadcrumbHtml);
}

export function showCheckoutBreadcrumb() {
    const breadcrumbHtml = `<a href="/index.html">Home</a> > <a href="/cart/">Shopping Cart</a> > <span>Checkout</span>`;
    setBreadcrumb(breadcrumbHtml);
}

export function showSearchBreadcrumb(searchTerm, count) {
    const breadcrumbHtml = `<a href="/index.html">Home</a> > <span>Search: "${searchTerm}" (${count} items)</span>`;
    setBreadcrumb(breadcrumbHtml);
}
