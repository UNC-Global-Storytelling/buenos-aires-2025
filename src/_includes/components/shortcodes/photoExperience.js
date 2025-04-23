export default function(data) {
  const storyId = data.storyId;
  const lang = data.lang || 'en';
  const title = data.title;
  const hasDescription = data.description && data.description.trim() !== '';

  return `
    <div class="photo-experience flex items-center justify-between" id="photo-experience-${storyId}">
      <!-- Title and Description -->
      <div class="photo-header flex justify-between items-center mb-4 w-full">
        <h2 class="photo-title text-xl font-semibold">
          ${title}
      </h2>
      <button class="immersive-btn bg-[#D2DCA9] text-black text-sm px-4 py-2 rounded hover:bg-green-700 transition">
        Launch Immersive Mode
      </button>
      </div>

      <!-- Main Photo Slider -->
      <div class="photo-slider">
        <!-- Image Section -->
        <div class="photo-container">
          <img id="slider-img-${storyId}" src="" alt="" class="photo-image">
        </div>

        <!-- Caption and Controls Section -->
        <div class="caption-container">
          <div class="caption-text-wrapper">
            <p id="slider-caption-${storyId}" class="caption-text"></p>
          </div>
          <div class="position-indicator">
            <button id="prev-btn-${storyId}" class="prev-slide" aria-label="Previous photo">←</button>
            <span id="current-position-${storyId}">1</span>/<span id="total-count-${storyId}">10</span>
            <button id="next-btn-${storyId}" class="next-slide" aria-label="Next photo">→</button>
          </div>
        </div>
      </div>

      <!-- Scripts -->
      <script src="/assets/js/photoExperience.js"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          initPhotoExperience('${storyId}', '${lang}');
        });
      </script>
    </div>
  `;
}
