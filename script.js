// CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

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

// SCROLL REVEAL ANIMATION
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// CONTACT FORM
async function sendMessage() {

    const response = await fetch('https://my-portfolio-ifxh.onrender.com/contact', {
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


    if(response.ok){
   status.style.color = '#00ff99';
   status.textContent = 'Message sent successfully!';
} else {
   status.style.color = 'red';
   status.textContent = 'Failed to send message';
}

    document.getElementById('fname').value = '';
    document.getElementById('femail').value = '';
    document.getElementById('fsubject').value = '';
    document.getElementById('fmessage').value = '';

  } catch (error) {
    console.error(error);

    status.style.color = 'red';
    status.textContent = '❌ Server error.';
  }
}
