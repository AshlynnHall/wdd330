import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import Alert from "./Alert.mjs";
import { hideBreadcrumb } from "./breadcrumb.mjs";

// Load header and footer, then initialize alerts
async function initializePage() {
  // Load header and footer first
  await loadHeaderFooter();
  
  // Hide breadcrumb on home page
  setTimeout(() => {
    hideBreadcrumb();
  }, 200);
  
  // Initialize and display alerts
  const alertManager = new Alert();
  await alertManager.displayAlerts("main");
}

// Initialize the page
initializePage();

// Show first visit modal
function showFirstVisitModal() {
  if (!localStorage.getItem('hasVisited')) {
    const modal = document.createElement('div');
    modal.className = 'first-visit-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Welcome to Sleep Outside!</h2>
        <p>Register today and enter our monthly giveaway for a chance to win outdoor gear worth $500!</p>
        <p>Plus, get exclusive access to member-only deals and early product releases.</p>
        <div class="modal-buttons">
          <button class="modal-button modal-register">Register Now</button>
          <button class="modal-button modal-close">Maybe Later</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle button clicks
    modal.querySelector('.modal-register').addEventListener('click', () => {
      alert('Registration feature coming soon!');
      modal.remove();
      localStorage.setItem('hasVisited', 'true');
    });
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
      localStorage.setItem('hasVisited', 'true');
    });
  }
}

// Show modal after page loads
setTimeout(showFirstVisitModal, 1000);

// Handle newsletter signup (does nothing)
document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Do nothing - just prevent the form from submitting
    });
  }
});
