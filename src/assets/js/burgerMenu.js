// burgerMenu.js
  // Mobile menu toggle functionality
  document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Open menu
    mobileMenuButton?.addEventListener('click', function() {
      mobileMenu.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden'); // Prevent scrolling
    });
    
    // Close menu
    closeMenuButton?.addEventListener('click', function() {
      mobileMenu.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    });
    
    // Close menu when clicking a link (optional)
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
      });
    });
  });
