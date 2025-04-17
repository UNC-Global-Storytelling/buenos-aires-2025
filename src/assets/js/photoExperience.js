function initPhotoExperience(storyId, language) {
  const lang = language || 'en';

  fetch(`/photoStories/${storyId}.json`)
    .then(res => res.json())
    .then(data => {
      const photos = (data[lang] && data[lang].photos) || data.en.photos || [];
      const title = data[lang]?.title || 'Photo Gallery';
      const description = data[lang]?.description || '';

      // Add title and description to the page
      const headerEl = document.createElement('div');
      headerEl.className = 'text-center mb-8';
      headerEl.innerHTML = `
        <h2 class="text-3xl font-lora text-green-700 mb-2">${title}</h2>
        <p class="text-lg font-lora">${description}</p>
      `;

      const container = document.getElementById(`photo-experience-${storyId}`);
      container.prepend(headerEl);

      // Sort photos by order
      photos.sort((a, b) => a.order - b.order);

      if (photos.length === 0) {
        container.innerHTML += '<p class="text-center">No photos available</p>';
        return;
      }

      // Set up the slider functionality
      let currentIndex = 0;
      const sliderImg = document.getElementById(`slider-img-${storyId}`);
      const sliderCaption = document.getElementById(`slider-caption-${storyId}`);
      const currentPosition = document.getElementById(`current-position-${storyId}`);
      const totalCount = document.getElementById(`total-count-${storyId}`);

      // Set total count
      totalCount.textContent = photos.length;

      function updateSlide() {
        const photo = photos[currentIndex];
        const caption = lang === "es" ? photo.caption_es : photo.caption_en;
        const alt = lang === "es" ? photo.alt_es : photo.alt_en;
        sliderImg.src = photo.src;
        sliderImg.alt = alt || '';
        sliderCaption.textContent = caption || '';
        currentPosition.textContent = currentIndex + 1;
      }

      function nextSlide() {
        currentIndex = (currentIndex + 1) % photos.length;
        updateSlide();
      }

      function prevSlide() {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        updateSlide();
      }

      // Add event listeners
      document.getElementById(`next-btn-${storyId}`).addEventListener('click', nextSlide);
      document.getElementById(`prev-btn-${storyId}`).addEventListener('click', prevSlide);

      // Initialize with first photo
      updateSlide();
    })
    .catch(error => {
      console.error('Error loading photo story:', error);
      document.getElementById(`photo-experience-${storyId}`).innerHTML =
        '<p class="text-red-500 text-center">Failed to load photo gallery. Please try again later.</p>';
    });
}

// Make the function accessible globally
window.initPhotoExperience = initPhotoExperience;