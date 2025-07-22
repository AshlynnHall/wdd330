// Simple test to check breadcrumb functionality
console.log("Testing breadcrumb elements...");

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded");
    testBreadcrumb();
});

// Also test after a delay
setTimeout(testBreadcrumb, 1000);
setTimeout(testBreadcrumb, 2000);

function testBreadcrumb() {
    console.log("=== Breadcrumb Test ===");
    const breadcrumbNav = document.getElementById('breadcrumb');
    const breadcrumbContent = document.getElementById('breadcrumb-content');
    
    console.log("Breadcrumb nav element:", breadcrumbNav);
    console.log("Breadcrumb content element:", breadcrumbContent);
    
    if (breadcrumbNav && breadcrumbContent) {
        console.log("Elements found! Setting test content...");
        breadcrumbContent.innerHTML = '<a href="/">Home</a> > <span>Test Breadcrumb</span>';
        breadcrumbNav.style.display = 'block';
        console.log("Test breadcrumb should now be visible");
    } else {
        console.log("Breadcrumb elements not found");
        console.log("All elements with ID:", document.querySelectorAll('[id]'));
    }
    
    console.log("Current URL:", window.location.href);
    console.log("Current path:", window.location.pathname);
}
