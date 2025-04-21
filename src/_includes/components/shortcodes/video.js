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

      <div class="overlay fixed inset-0 bg-black opacity-0 pointer-events-none transition-opacity duration-300 z-50" id="videoOverlay"></div>
    </div>
    
  `;
};
