document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('videoOverlay');
    const btn = document.getElementById('toggleOverlayBtn');

    if (overlay && btn) {
      btn.addEventListener('click', () => {
        overlay.classList.toggle('active');
      });
    }
  });