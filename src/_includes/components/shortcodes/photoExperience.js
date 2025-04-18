export default function(data) {
  const storyId = data.storyId;
  const lang = data.lang || 'en';

  return `
    <div class="photo-experience" id="photo-experience-${storyId}">
      <!-- Title and Description -->
      <div class="photo-header">
        <h2 class="photo-title">${data.title || 'Photo Story Title'}</h2>
        <p class="photo-description">${data.description || ''}</p>
      </div>

      <!-- Main Content -->
      <div class="photo-slider">
        <!-- Image Section -->
        <div class="photo-container">
          <img id="slider-img-${storyId}" src="" alt="" class="photo-image">
        </div>

        <!-- Caption and Controls Section -->
        <div class="caption-container">
          <p id="slider-caption-${storyId}" class="caption-text"></p>
          <div class="position-indicator">
            <button id="prev-btn-${storyId}" class="prev-slide" aria-label="Previous photo">←</button>
            <span id="current-position-${storyId}">1</span>/<span id="total-count-${storyId}">10</span>
            <button id="next-btn-${storyId}" class="next-slide" aria-label="Next photo">→</button>
          </div>
        </div>
      </div>

      <script src="/assets/js/photoExperience.js"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          initPhotoExperience('${storyId}', '${lang}');
        });
      </script>
    </div>
  `;
}