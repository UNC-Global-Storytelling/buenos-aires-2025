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
  container.innerHTML = '';

  photos.forEach((photo, index) => {
    const caption = lang === "es" ? photo.caption_es : photo.caption_en;
    const alt = lang === "es" ? photo.alt_es : photo.alt_en;

    const section = document.createElement('section');
    section.className = "relative h-[300vh] bg-black";

    const scene = document.createElement('div');
    scene.className = "sticky top-0 h-screen flex items-center justify-center overflow-hidden";

    scene.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center">
        <img 
          src="${photo.src}" 
          alt="${alt || ''}" 
          class="immersive-photo absolute object-contain max-h-[85vh] w-auto scale-[0.85] opacity-90 transition-all duration-1000 ease-in-out"
          data-slide="${index}"
        >
        <div 
          class="immersive-caption absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white opacity-0 transition-opacity duration-1000 ease-in-out px-6"
          style="max-width: 90%;"
        >
          <p class="text-base md:text-lg leading-relaxed text-shadow-md">
        ${caption || ''}
      </p>
    </div>
      </div>
    `;

    section.appendChild(scene);
    container.appendChild(section);

    if (index < photos.length - 1) {
      const spacer = document.createElement('div');
      spacer.className = "h-[100vh] bg-black";
      container.appendChild(spacer);
    }
  });

  // Animate scroll-based zoom and caption fade
  const scenes = document.querySelectorAll(`#immersive-content-${storyId} section`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      const img = section.querySelector('.immersive-photo');
      const caption = section.querySelector('.immersive-caption');

      if (entry.isIntersecting) {
        img.classList.remove('scale-[0.85]', 'opacity-90');
        img.classList.add('scale-100', 'opacity-100');

        setTimeout(() => {
          caption.classList.add('opacity-100');
        }, 500);
      } else {
        img.classList.add('scale-[0.85]', 'opacity-90');
        img.classList.remove('scale-100', 'opacity-100');

        caption.classList.remove('opacity-100');
      }
    });
  }, { threshold: 0.6 });

  scenes.forEach(scene => observer.observe(scene));
}



window.initPhotoExperience = initPhotoExperience;

window.launchImmersive = function(storyId, lang) {
  const immersive = document.getElementById(`immersive-${storyId}`);
  immersive.classList.remove("hidden");
  immersive.scrollTo({ top: 0, behavior: 'smooth' });

  const overlayId = `title-overlay-${storyId}`;
  if (!document.getElementById(overlayId)) {
    const titleOverlay = document.createElement('div');
    titleOverlay.className = `
      fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 text-white pointer-events-none 
      transition-opacity duration-700 ease-in-out opacity-100
    `;
    titleOverlay.id = overlayId;
    titleOverlay.innerHTML = `
      <div class="text-center px-6 space-y-4">
        <h1 class="text-3xl md:text-5xl font-bold">${document.querySelector(`#photo-experience-${storyId} .photo-title`)?.innerText || 'Photo Story'}</h1>
        <p class="text-base md:text-lg font-light text-gray-300">Scroll to begin</p>
      </div>
    `;
    immersive.appendChild(titleOverlay);

    // 👇 Fade out on scroll
    immersive.addEventListener('scroll', function handleScroll() {
      titleOverlay.classList.add('opacity-0');
      titleOverlay.classList.remove('opacity-100');
      immersive.removeEventListener('scroll', handleScroll); // Only trigger once
    });
  }

  const hash = `#immersive-${storyId}`;
  if (window.location.hash !== hash) {
    history.pushState(null, "", hash);
  }
};


window.addEventListener('popstate', () => {
  const immersiveEls = document.querySelectorAll('[id^="immersive-"]');
  immersiveEls.forEach(el => {
    if (!location.hash.includes(el.id)) {
      el.classList.add('hidden');
    }
  });
});

document.addEventListener('click', (e) => {
  if (e.target.matches('[id^="close-immersive-"]')) {
    const id = e.target.id.replace("close-immersive-", "");
    const immersive = document.getElementById(`immersive-${id}`);
    immersive.classList.add("hidden");
  }
});
