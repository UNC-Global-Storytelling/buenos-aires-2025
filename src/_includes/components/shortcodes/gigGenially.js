export default function () {
    return `
    <div class="container-wrapper-genially" style="position: relative; min-height: 400px; max-width: 100%; padding-top: 4%; padding-bottom: 4%">
    <video class="loader-genially" autoplay="autoplay" loop="loop" playsinline="playsInline" muted="muted" style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);width: 80px;height: 80px;margin-bottom: 10%">
      <source src="https://static.genially.com/resources/loader-default-rebranding.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div id="67fd4d045ba77fcd15519359" class="genially-embed" style="margin: 0px auto; position: relative; height: auto; width: 80%;"></div>
  </div>
  <script>
    (function (d) {
      var js, id = "genially-embed-js", ref = d.getElementsByTagName("script")[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement("script");
      js.id = id;
      js.async = true;
      js.src = "https://view.genially.com/static/embed/embed.js";
      ref.parentNode.insertBefore(js, ref);
    }(document));
  </script>  
    `;
  }
  
  //this is the genially component for gig economy