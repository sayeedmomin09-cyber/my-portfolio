// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top = my - 6 + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx - 18 + 'px';
  ring.style.top = ry - 18 + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scroll reveal animation
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), index * 80);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(reveal => observer.observe(reveal));

// Contact form
async function sendMessage() {
  const status = document.getElementById('form-status');
  const submitButton = document.querySelector('#contact button');

  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email || !message) {
    status.style.color = '#ff6b6b';
    status.textContent = 'Please fill all required fields.';
    return;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    status.style.color = '#00d4ff';
    status.textContent = 'Sending your message...';

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message
      })
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      status.style.color = '#00ff99';
      status.textContent = result.message || 'Message sent successfully!';
      document.getElementById('fname').value = '';
      document.getElementById('femail').value = '';
      document.getElementById('fsubject').value = '';
      document.getElementById('fmessage').value = '';
    } else {
      status.style.color = '#ff6b6b';
      status.textContent = result.error || 'Failed to send message.';
    }
  } catch (error) {
    console.error(error);
    status.style.color = '#ff6b6b';
    status.textContent = 'Server error. Please try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message ->';
  }
}
