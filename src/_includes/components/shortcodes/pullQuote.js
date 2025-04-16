export default function(data) {
  const { quote, attribution, role } = data;
  
  // Remove extra whitespace by using a single line
  return `<div class="pull-quote"><blockquote><p>"${quote}"</p><footer><span class="attribution">${attribution}</span>${role ? `<span class="role">${role}</span>` : ''}</footer></blockquote></div>`;
}