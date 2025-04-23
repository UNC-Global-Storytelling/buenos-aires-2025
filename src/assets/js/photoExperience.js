
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')     // remove punctuation
    .trim()
    .replace(/\s+/g, '-')         // replace spaces with hyphens
    .replace(/--+/g, '-');         // remove double hyphens
}

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

      // Auto-launch immersive mode if URL matches hash
      const title = document.querySelector(`#photo-experience-${storyId} .photo-title`)?.innerText || 'photo-story';
      const slug = slugify(title);
      if (window.location.hash === `#photo-${slug}`) {
        launchImmersive(storyId, lang);
      }
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
    section.className = "relative h-[200vh] bg-black";

    section.innerHTML = `
      <div class="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4">
        <img 
          src="${photo.src}" 
          alt="${alt || ''}" 
          class="immersive-photo max-h-[85vh] w-auto object-contain mb-8 opacity-0 scale-95 transition-all duration-1000 ease-out"
        >
        <div 
          class="immersive-caption opacity-0 translate-y-4 text-white text-center max-w-5xl px-6 transition-all duration-1000 ease-out delay-300"
        >
          <p class="font-serif text-base md:text-lg leading-relaxed">
            ${caption || ''}
          </p>
        </div>
      </div>
    `;

    container.appendChild(section);

    if (index < photos.length - 1) {
      const spacer = document.createElement('div');
      spacer.className = "h-[20vh] bg-black";
      container.appendChild(spacer);
    }
  });

  const observers = document.querySelectorAll(`#immersive-content-${storyId} section`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const img = entry.target.querySelector('.immersive-photo');
      const caption = entry.target.querySelector('.immersive-caption');

      if (entry.isIntersecting) {
        img.classList.remove('opacity-0', 'scale-95');
        img.classList.add('opacity-100', 'scale-100');

        setTimeout(() => {
          caption.classList.remove('opacity-0', 'translate-y-4');
          caption.classList.add('opacity-100', 'translate-y-0');
        }, 300);
      } else {
        img.classList.add('opacity-0', 'scale-95');
        img.classList.remove('opacity-100', 'scale-100');

        caption.classList.add('opacity-0', 'translate-y-4');
        caption.classList.remove('opacity-100', 'translate-y-0');
      }
    });
  }, { threshold: 0.5 });

  observers.forEach(section => observer.observe(section));
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

    immersive.addEventListener('scroll', function handleScroll() {
      titleOverlay.classList.add('opacity-0');
      titleOverlay.classList.remove('opacity-100');
      immersive.removeEventListener('scroll', handleScroll);
    });
  }

  const title = document.querySelector(`#photo-experience-${storyId} .photo-title`)?.innerText || 'photo-story';
  const slug = slugify(title);
  const hash = `#photo-${slug}`;

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

    if (window.location.hash.startsWith('#photo-')) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }
});
