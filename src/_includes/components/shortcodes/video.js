export default (data) => {
    const { videoId } = data;
    return `<div class="video-player" style="padding:56.25% 0 0 0;position:relative;">
            <iframe src="https://player.vimeo.com/video/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>   
    `
 }