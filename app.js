const clock = document.querySelector('#clock');
const output = document.querySelector('#terminal-output');
const form = document.querySelector('#terminal-form');
const input = document.querySelector('#command-input');
const body = document.body;
const navLinks = [...document.querySelectorAll('.topbar nav a')];

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(new Date());
}
setInterval(updateClock, 1000);
updateClock();

const commands = {
  help: 'Available after boot: about, projects, skills, contact, github, linkedin, leetcode, date, clear, help',
  about: 'Pranshu Thakkar | CSE student at MIT Bengaluru | Backend developer who likes clean systems.',
  projects: 'Loading /projects ... Campus Connect API · Visual Data Lab · Docker Deploy Kit',
  skills: 'Java · Spring Boot · Spring Security · React · Python · MySQL · MongoDB · Docker · Git',
  contact: 'Open a channel: hello@pranshuthakkar.dev | GitHub: https://github.com/pranshu1606 | LinkedIn: https://www.linkedin.com/in/pranshu-t-aba933325/ | LeetCode: https://leetcode.com/u/pranshu_thakkar/',
  github: 'https://github.com/pranshu1606',
  linkedin: 'https://www.linkedin.com/in/pranshu-t-aba933325/',
  leetcode: 'https://leetcode.com/u/pranshu_thakkar/',
  date: () => `Local system time: ${new Date().toString()}`
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const command = input.value.trim().toLowerCase();
  if (!command) return;
  const typed = document.createElement('p');
  typed.innerHTML = `<span class="muted">$ ${command.replace(/[&<>]/g, '')}</span>`;
  output.append(typed);
  if (body.classList.contains('booting')) {
    if (command === 'mvn spring-boot:run') {
      const result = document.createElement('p');
      result.innerHTML = '<span class="green">[ OK ]</span> Tomcat started on port 8080 · loading portfolio...';
      output.append(result);
      input.disabled = true;
      setTimeout(() => {
        body.classList.remove('booting');
        navigate();
      }, 650);
    } else {
      const result = document.createElement('p');
      result.textContent = 'Please run: mvn spring-boot:run';
      result.className = 'muted';
      output.append(result);
    }
  } else if (command === 'clear') {
    output.innerHTML = '<p class="muted">Terminal cleared. Type <span class="green">help</span> to continue.</p>';
  } else if (commands[command]) {
    const result = document.createElement('p');
    result.textContent = typeof commands[command] === 'function' ? commands[command]() : commands[command];
    result.className = 'green';
    output.append(result);
  } else {
    const result = document.createElement('p');
    result.textContent = `command not found: ${command}. Type help for available commands.`;
    result.className = 'muted';
    output.append(result);
  }
  input.value = '';
  output.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function navigate() {
  const page = (location.hash || '#top').slice(1);
  const pageName = page === 'stack' ? 'tech' : ['projects', 'resume', 'contact'].includes(page) ? page : 'home';
  document.querySelectorAll('.page-view').forEach((view) => {
    view.classList.toggle('current-page', view.dataset.page === pageName);
  });
  navLinks.forEach((link) => link.classList.toggle('active', link.hash.slice(1) === page || (pageName === 'home' && link.hash === '#top')));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

window.addEventListener('hashchange', navigate);
if (!body.classList.contains('booting')) navigate();

async function loadContributionCalendar() {
  const calendar = document.querySelector('#contribution-calendar');
  if (!calendar) return;

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364 - today.getDay());

  try {
    const response = await fetch('https://github-contributions-api.jogruber.de/v4/pranshu1606?y=last');
    if (!response.ok) throw new Error('Contribution request failed');
    const data = await response.json();
    const contributions = new Map((data.contributions || []).map((entry) => [entry.date, entry.count]));
    const total = [...contributions.values()].reduce((sum, count) => sum + count, 0);
    const summary = document.createElement('strong');
    summary.className = 'activity-total';
    summary.textContent = `${total} contributions in the last year`;
    calendar.append(summary);

    const monthLabels = document.createElement('div');
    monthLabels.className = 'calendar-months';
    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const month = document.createElement('span');
      const monthDate = new Date(today.getFullYear(), today.getMonth() - 11 + monthIndex, 1);
      month.textContent = monthDate.toLocaleDateString('en-US', { month: 'short' });
      monthLabels.append(month);
    }
    calendar.append(monthLabels);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    for (let weekIndex = 0; weekIndex < 53; weekIndex += 1) {
      const week = document.createElement('div');
      week.className = 'calendar-week';
      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);
        const dateKey = date.toISOString().slice(0, 10);
        const count = contributions.get(dateKey) || 0;
        const cell = document.createElement('span');
        cell.className = `contribution-cell level-${count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4}`;
        cell.title = `${count} contribution${count === 1 ? '' : 's'} on ${dateKey}`;
        week.append(cell);
      }
      grid.append(week);
    }
    calendar.append(grid);
  } catch (error) {
    calendar.textContent = 'Contribution data unavailable';
    calendar.classList.add('calendar-error');
  }
}

loadContributionCalendar();
