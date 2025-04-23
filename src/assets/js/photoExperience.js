function initPhotoExperience(storyId, language) {
  const lang = language || 'en';

  fetch(`/photoStories/${storyId}.json`)
    .then(res => res.json())
    .then(data => {
      const photos = (data[lang] && data[lang].photos) || data.en.photos || [];
      photos.sort((a, b) => a.order - b.order);
      buildImmersiveSlides(storyId, photos, lang);

      if (photos.length === 0) {
        const container = document.getElementById(`photo-experience-${storyId}`);
        container.innerHTML += '<p class="text-center">No photos available</p>';
        return;
      }

      let currentIndex = 0;
      const sliderImg = document.getElementById(`slider-img-${storyId}`);
      const sliderCaption = document.getElementById(`slider-caption-${storyId}`);
      const currentPosition = document.getElementById(`current-position-${storyId}`);
      const totalCount = document.getElementById(`total-count-${storyId}`);

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

      document.getElementById(`next-btn-${storyId}`).addEventListener('click', nextSlide);
      document.getElementById(`prev-btn-${storyId}`).addEventListener('click', prevSlide);

      updateSlide();
    })
    .catch(error => {
      console.error('Error loading photo story:', error);
      document.getElementById(`photo-experience-${storyId}`).innerHTML =
        '<p class="text-red-500 text-center">Failed to load photo gallery. Please try again later.</p>';
    });
}

function buildImmersiveSlides(storyId, photos, lang) {
  const container = document.getElementById(`immersive-content-${storyId}`);
  container.innerHTML = ''; // clear placeholder

  photos.forEach((photo, index) => {
    const caption = lang === "es" ? photo.caption_es : photo.caption_en;
    const alt = lang === "es" ? photo.alt_es : photo.alt_en;

    const slide = document.createElement('section');
    slide.className = "h-screen flex items-center justify-center px-4";

    slide.innerHTML = `
      <div class="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-6xl immersive-inner">
        <img 
          src="${photo.src}" 
          alt="${alt || ''}" 
          class="max-h-[70vh] w-auto opacity-0 translate-x-20 transition-all duration-700 ease-in-out immersive-photo"
          data-slide="${index}"
        >
        <p 
          class="max-w-xl text-lg md:text-xl text-center md:text-left text-white opacity-0 translate-x-20 transition-all delay-200 duration-700 ease-in-out immersive-caption"
          data-slide="${index}"
        >
          ${caption || ''}
        </p>
      </div>
    `;

    container.appendChild(slide);

    // Orientation detection goes here
    const imgEl = slide.querySelector('img');
    imgEl.onload = () => {
      const isLandscape = imgEl.naturalWidth > imgEl.naturalHeight;
      slide.classList.add(isLandscape ? 'landscape' : 'portrait');
    };
  });

  // Animate when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-x-20');
        entry.target.classList.add('opacity-100', 'translate-x-0');
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(`#immersive-content-${storyId} .immersive-photo, #immersive-content-${storyId} .immersive-caption`)
    .forEach(el => observer.observe(el));
}



window.initPhotoExperience = initPhotoExperience;

window.launchImmersive = function(storyId, lang) {
  const immersive = document.getElementById(`immersive-${storyId}`);
  immersive.classList.remove("hidden");
  immersive.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('click', (e) => {
  if (e.target.matches('[id^="close-immersive-"]')) {
    const id = e.target.id.replace("close-immersive-", "");
    const immersive = document.getElementById(`immersive-${id}`);
    immersive.classList.add("hidden");
  }
});
