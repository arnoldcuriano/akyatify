
const WAITLIST_URL = 'https://script.google.com/macros/s/AKfycbwdlRRZwVrsXcZNFc0dmchJFBWXdr0xYF5Ea8Yx-n3XxoEslU930XUB7f5gPenkLikHZA/exec';
const SURVEY_URL   = 'YOUR_SURVEY_APPS_SCRIPT_URL_HERE';
// ─────────────────────────────────────────────────────────────────────────────

let selectedRole = '';

function selectRole(btn, role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedRole = role;
}

function updateRangeFill(input) {
  const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.background = `linear-gradient(to right, #2d9a57 ${pct}%, #d1e8d9 ${pct}%)`;
}

async function submitWaitlist() {
  const name  = document.getElementById('wl-name').value.trim();
  const email = document.getElementById('wl-email').value.trim();
  if (!name || !email) { alert('Please enter your name and email.'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { alert('Please enter a valid email address.'); return; }

  const btn = document.querySelector('.submit-btn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const payload = {
    name,
    email,
    role: selectedRole || 'Not selected',
    timestamp: new Date().toISOString()
  };

  try {
    if (WAITLIST_URL !== 'YOUR_WAITLIST_APPS_SCRIPT_URL_HERE') {
      await fetch(WAITLIST_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    document.getElementById('form-area').style.display = 'none';
    document.getElementById('wl-success').style.display = 'block';
  } catch (err) {
    console.error('Waitlist error:', err);
    document.getElementById('form-area').style.display = 'none';
    document.getElementById('wl-success').style.display = 'block';
  }
}

async function submitSurvey() {
  const sq1 = document.getElementById('sq1').value;
  const sq2 = document.getElementById('sq2').value;
  const sq4 = document.getElementById('sq4').value;
  const sq5 = document.getElementById('sq5').value;
  const sq6 = document.getElementById('sq6').value;
  const features = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
                        .map(cb => cb.value).join(', ');

  if (!sq1 || !sq2) { alert('Please answer at least the first two questions.'); return; }

  const surveyBtn = document.querySelector('.survey-submit');
  surveyBtn.textContent = 'Sending...';
  surveyBtn.disabled = true;

  const payload = {
    frequency: sq1,
    region: sq2,
    features,
    guide_experience: sq4,
    price_willing: '₱' + sq5 + '/mo',
    open_feedback: sq6,
    timestamp: new Date().toISOString()
  };

  try {
    if (SURVEY_URL !== 'YOUR_SURVEY_APPS_SCRIPT_URL_HERE') {
      await fetch(SURVEY_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    document.getElementById('survey-success').style.display = 'block';
    surveyBtn.textContent = 'Submitted!';
    surveyBtn.style.background = '#aaa';
  } catch (err) {
    console.error('Survey error:', err);
    document.getElementById('survey-success').style.display = 'block';
    surveyBtn.textContent = 'Submitted!';
    surveyBtn.style.background = '#aaa';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const r = document.getElementById('sq5');
  if (r) updateRangeFill(r);
});
