document.addEventListener('DOMContentLoaded', function() {
  // Get all language toggle links
  const toggleLinks = document.querySelectorAll('.toggle-option[data-lang]');
  
  toggleLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetLang = this.getAttribute('data-lang');
      const currentPath = window.location.pathname;
      
      // Replace language in URL or add it
      let newPath;
      if (currentPath.includes('/en/')) {
        newPath = currentPath.replace('/en/', '/es/');
      } else if (currentPath.includes('/es/')) {
        newPath = currentPath.replace('/es/', '/en/');
      } else {
        // Default case
        newPath = '/' + targetLang + '/';
      }
      
      // Force reload by adding a timestamp parameter to avoid caching issues
      const timestamp = new Date().getTime();
      window.location.href = newPath + (newPath.includes('?') ? '&' : '?') + '_ts=' + timestamp;
    });
  });
});