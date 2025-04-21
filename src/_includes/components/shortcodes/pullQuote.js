export default function(data) {
  const { quote, attribution = '', role = '' } = data;

  return `
    <div class="pull-quote">
      <blockquote>
        <p>"${quote}"</p>
        ${attribution || role ? `
          <footer>
            ${attribution ? `<span class="attribution">${attribution}</span>` : ''}
            ${role ? `<span class="role">${role}</span>` : ''}
          </footer>
        ` : ''}
      </blockquote>
    </div>
  `;
}