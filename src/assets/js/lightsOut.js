document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('videoOverlay');
  const btn = document.getElementById('toggleOverlayBtn');

  if (!overlay || !btn) return;

  // Determine if we’re on a story page based on body class or URL path.
  const isStoryPage = document.body.classList.contains('page-story') || window.location.pathname.includes('/stories/');

  if (isStoryPage) {
    // For story pages, we want the overlay to cover only the video container.
    // Remove fixed fullscreen positioning
    overlay.classList.remove('fixed', 'inset-0');
    // Add absolute positioning so that it stays within the .video-container
    overlay.classList.add('absolute');
    // Set styles to cover 120% of the video container (10% extra on top and bottom)
    // and shift left so it also covers the space to the left.
    overlay.style.top = '-50%';
    overlay.style.left = '-50%';
    overlay.style.width = '200%';
    overlay.style.height = '200%';

  }

  // Toggle the overlay's visibility by toggling an "active" class.
  btn.addEventListener('click', () => {
    overlay.classList.toggle('active');
  });
});