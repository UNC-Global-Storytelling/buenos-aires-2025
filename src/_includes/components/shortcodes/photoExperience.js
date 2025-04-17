export default function(data) {
  const storyId = data.storyId;
  const lang = data.lang || 'en';
  
  return `
    <div class="photo-experience" id="photo-experience-${storyId}">
      <div class="photo-slider">
        <div class="slider-container">
          <img id="slider-img-${storyId}" src="" alt="" class="w-full">
          
          <div class="slider-controls">
            <button id="prev-btn-${storyId}" class="prev-slide bg-green-700 hover:bg-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors" aria-label="Previous photo">
              <span class="text-2xl">←</span>
            </button>
            <button id="next-btn-${storyId}" class="next-slide bg-green-700 hover:bg-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors" aria-label="Next photo">
              <span class="text-2xl">→</span>
            </button>
          </div>
        </div>
        
        <div class="flex flex-col md:flex-row gap-6 mt-4">
          <div class="caption-container md:w-2/3">
            <div class="border-l-4 border-green-700 pl-4">
              <p id="slider-caption-${storyId}" class="font-lora text-lg"></p>
            </div>
          </div>
          
          <div class="position-indicator md:w-1/3 flex items-center justify-center">
            <span id="current-position-${storyId}" class="font-lora">1</span>
            <span class="mx-2">/</span>
            <span id="total-count-${storyId}" class="font-lora">10</span>
          </div>
        </div>
      </div>

      <script src="/assets/js/photoExperience.js"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Initialize the photo experience with storyId and current language
          initPhotoExperience('${storyId}', '${lang}');
        });
      </script>
    </div>
  `;
}