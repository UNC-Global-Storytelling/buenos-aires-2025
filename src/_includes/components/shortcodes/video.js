export default (data) => {
    const { videoId } = data;
    return `
      <div class="video-container">
        <div class="video-player">
          <iframe 
            src="https://player.vimeo.com/video/${videoId}" 
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
  
        <button 
          id="toggleOverlayBtn" 
          class="rounded-full bg-[var(--color-green)] text-white font-medium px-6 py-2 mt-4 transition hover:bg-[var(--color-brown)]">
          Lights Out Display
        </button>
      </div>
  
      <div class="overlay" id="videoOverlay"></div>
  
      <script src="https://player.vimeo.com/api/player.js"></script>  
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          const overlay = document.getElementById('videoOverlay');
          const btn = document.getElementById('toggleOverlayBtn');
  
          if (overlay && btn) {
            btn.addEventListener('click', () => {
              overlay.classList.toggle('active');
            });
          }
        });
      </script>
    `;
  }
  