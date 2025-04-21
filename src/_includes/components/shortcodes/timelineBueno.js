export default function () {
  return `
    <div style="position: relative; max-width: 80%; margin: 0 auto;">
    <!-- Main Timeline Image -->
    <img 
      src="/assets/img/uploads/Rodrigo-Bueno-Interactive-Graphic.jpg" 
      alt="Rodrigo Bueno" 
      style="width: 100%; display: block;"
    />
  
    <!-- Clickable Leaves -->
    <img 
      src="/assets/img/uploads/Leaf-1 copy 2.png"
      alt="Leaf 1 Copy 2"
      style="position: absolute; top: 43%; left: 28%; width: 10%; cursor: pointer;"
      onclick="showMultipleTexts(['text2017', 'text2021'])"
    />
    <img 
      src="/assets/img/uploads/Leaf-1 copy 3.png"
      alt="Leaf 1 Copy 3"
      style="position: absolute; top: 72%; left: 25%; width: 10%; cursor: pointer;"
      onclick="showText('text2019')"
    />
    <img 
      src="/assets/img/uploads/Leaf-1 copy.png"
      alt="Leaf 1 Copy"
      style="position: absolute; top: 39%; left: 9%; width: 10%; cursor: pointer;"
      onclick="showText('text2016')"
    />
    <img 
      src="/assets/img/uploads/leaf-4.png"
      alt="Leaf 4"
      style="position: absolute; top: 22%; left: 13%; width: 10%; cursor: pointer;"
      onclick="showText('text1980')"
    />
    <img 
      src="/assets/img/uploads/Leaf-1.png"
      alt="Leaf 1"
      style="position: absolute; top: 72%; left: 48%; width: 10%; cursor: pointer;"
      onclick="showText('text2022')"
    />
  
    <!-- Title -->
    <h1 style="position: absolute; top: 4%; left: 60%; transform: translateX(-50%); line-height: 1.1; color: #57622E; font-size: 1.8rem; font-family: sans-serif;">
      The History of Rodrigo Bueno
    </h1>
    <p style="position: absolute; top: 21%; left: 50%; transform: translateX(-50%); color: Black; font-size: .8rem; font-family: sans-serif;">
    Click the leaves to reveal
    </p>
  
    <!-- Year Labels -->
    <h3 style="position: absolute; top: 0%; left: 6%; color: #57622E; font-size: 1.1rem;">1980<sub>s</sub></h3>
    <h3 style="position: absolute; top: 28%; left: 2%; color: #57622E; font-size: 1.1rem;">2016</h3>
    <h3 style="position: absolute; top: 22%; left: 24%; color: #57622E; font-size: 1.1rem;">2017</h3>
    <h3 style="position: absolute; top: 45%; left: 18%; color: #57622E; font-size: 1.1rem;">2019</h3>
    <h3 style="position: absolute; top: 51%; left: 37%; color: #57622E; font-size: 1.1rem;">2021</h3>
    <h3 style="position: absolute; top: 75%; left: 35%; color: #57622E; font-size: 1.1rem;">2022</h3>
  
    <!-- Argentina Info -->
    <h3 style="position: absolute; top: 34.5%; left: 56.5%; color: #57622E; font-size: 1rem;">ARGENTINA</h3>
    <p style="position: absolute; top: 44.5%; left: 59.5%; color: black; font-size: 0.5rem;">2,780,400 km<sup>2</sup></p>
    <p style="position: absolute; top: 51.5%; left: 59.5%; color: black; font-size: 0.5rem;">44,938,712</p>
    <p style="position: absolute; top: 58.5%; left: 59.5%; color: black; font-size: 0.5rem;">Buenos Aires</p>
  
    <!-- Paragraphs (initially hidden) -->
    <div id="text1980" style="display: none; position: absolute; top: 12%; left: 6%; color: black; font-size: 0.5rem; width: 34%; line-height: 1.1;">
      Rodrigo Bueno begins as a self-built settlement on unstable reclaimed river land, lacking basic services like clean water, electricity, sewage, and access to education or healthcare — all while facing high climate risks.
    </div>
    <div id="text2019" style="display: none; position: absolute; top: 56%; left: 11%; color: black; font-size: 0.5rem; width: 18%; line-height: 1.1;">
      Buenos Aires’ Housing Institute forms a “Territorial Team” of social workers, anthropologists, and architects. A new law is passed — Law 5784 — officially recognizing the land and homeownership rights of Rodrigo Bueno residents.
    </div>
    <div id="text2021" style="display: none; position: absolute; top: 63%; left: 37%; color: black; font-size: 0.4rem; width: 20%; line-height: 1.1;">
      A new city administration abandons prior eviction plans and implements a new strategy to address Rodrigo Bueno’s challenges.
    </div>
    <div id="text2022" style="display: none; position: absolute; top: 86%; left: 33%; color: black; font-size: 0.5rem; width: 29%; line-height: 1.1;">
      The Housing Institute launched efforts to restore the canal along the neighborhood’s edge. Progress includes canal cleanup, a stormwater management system, and a retaining wall to help prevent flooding.
    </div>
    <div id="text2017" style="display: none; position: absolute; top: 34%; left: 24%; color: black; font-size: 0.5rem; width: 30%; line-height: 1.1;">
      “La Vivera” — an organic garden and nursery — was created by 14 women who began selling native plants, vegetables, and aromatics outside the neighborhood.
    </div>
    <div id="text2016" style="display: none; position: absolute; top: 41%; left: 1%; color: black; font-size: 0.5rem; width: 8%; line-height: 1.1;">
      The Hilton Buenos Aires commits to purchasing 100% of its organic produce from La Vivera.
    </div>
  </div>
  
  <script>
    function showText(id) {
      const el = document.getElementById(id);
      if (el && el.style.display !== 'block') {
        el.style.display = 'block';
      }
    }
  
    function showMultipleTexts(ids) {
      ids.forEach(id => showText(id));
    }
  </script>
  
  `;
}
