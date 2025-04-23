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
  container.innerHTML = ''; // Clear previous content

  photos.forEach((photo, index) => {
    const caption = lang === "es" ? photo.caption_es : photo.caption_en;
    const alt = lang === "es" ? photo.alt_es : photo.alt_en;

    const section = document.createElement('section');
    section.className = "relative h-[300vh] bg-black";

    const scene = document.createElement('div');
    scene.className = "scene-wrapper sticky top-0 h-screen flex flex-col items-center justify-center";

    scene.innerHTML = `
      <div class="max-w-6xl mx-auto w-full h-full flex flex-col items-center justify-center px-4 text-center space-y-6">
        <img 
          src="${photo.src}" 
          alt="${alt || ''}" 
          class="immersive-photo max-h-[80vh] w-auto md:max-w-[85vw] md:max-h-[80vh] max-h-[65vh] object-contain scale-100 opacity-100 transition-transform duration-700 ease-in-out"
          data-slide="${index}"
        >
        <p 
          class=class="immersive-caption opacity-0 pt-4 text-white text-base md:text-lg leading-relaxed font-light md:max-w-xl transition-opacity duration-700 ease-in-out"
          data-slide="${index}"
        >
          ${caption || ''}
        </p>
      </div>
    `;

    section.appendChild(scene);
    container.appendChild(section);

    // Spacer between scenes
    if (index < photos.length - 1) {
      const spacer = document.createElement('div');
      spacer.className = "h-[100vh] bg-black";
      container.appendChild(spacer);
    }

    const imgEl = scene.querySelector('img');
    imgEl.onload = () => {
      const isLandscape = imgEl.naturalWidth > imgEl.naturalHeight;
      section.classList.add(isLandscape ? 'landscape' : 'portrait');
    };
  });

  // Animate images + captions
  const scenes = document.querySelectorAll(`#immersive-content-${storyId} section`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const img = entry.target.querySelector('.immersive-photo');
      const caption = entry.target.querySelector('.immersive-caption');

      if (entry.isIntersecting) {
        img.classList.add('scale-90');
        caption.classList.add('opacity-100');
      } else {
        img.classList.remove('scale-90');
        caption.classList.remove('opacity-100');
      }
    });
  }, { threshold: 0.5 });

  scenes.forEach(scene => observer.observe(scene));
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
