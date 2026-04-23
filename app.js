const authButton = document.getElementById('authButton');
const profileLink = document.getElementById('profileLink');
const logoutButton = document.getElementById('logoutButton');
const exploreCourses = document.getElementById('exploreCourses');
const seePlans = document.getElementById('seePlans');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const currentPlanEl = document.getElementById('currentPlan');
const profileName = document.getElementById('profileName');
const progressList = document.getElementById('progressList');
const coursesGrid = document.getElementById('coursesGrid');
const searchInput = document.getElementById('searchInput');
const levelFilter = document.getElementById('levelFilter');
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');
const logoutLink = document.getElementById('logoutLink');

const STORAGE_KEY = 'manutencao-user';
const COURSE_PROGRESS_KEY = 'manutencao-progress';
let courses = [];

const user = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  name: 'Visitante',
  plan: 'free',
  email: '',
};

const progressData = JSON.parse(localStorage.getItem(COURSE_PROGRESS_KEY)) || {};

function openModal(title, content) {
  modalTitle.textContent = title;
  modalBody.innerHTML = '';
  if (typeof content === 'string') {
    modalBody.innerHTML = content;
  } else {
    modalBody.appendChild(content);
  }
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

function updateUserUI() {
  if (user.email) {
    authButton.style.display = 'none';
    profileButton.style.display = 'inline-block';
    profileDropdown.style.display = 'block';
  } else {
    authButton.style.display = 'inline-block';
    profileButton.style.display = 'none';
    profileDropdown.style.display = 'none';
  }
  profileName.textContent = user.name || 'Visitante';
  currentPlanEl.textContent = user.plan === 'free' ? 'Gratuito' : user.plan === 'basic' ? 'Básico' : 'Premium';
  const premiumContent = document.getElementById('premiumContent');
  premiumContent.style.display = user.plan === 'premium' ? 'block' : 'none';
}

function saveUser() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function saveProgress() {
  localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(progressData));
}

function createCourseCard(course) {
  const card = document.createElement('div');
  card.className = 'course-card';

  const thumb = document.createElement('img');
  thumb.src = course.thumbnail;
  thumb.alt = course.title;
  card.appendChild(thumb);

  const title = document.createElement('h3');
  title.textContent = course.title;
  card.appendChild(title);

  const desc = document.createElement('p');
  desc.textContent = course.description;
  card.appendChild(desc);

  const meta = document.createElement('div');
  meta.className = 'course-meta';
  meta.innerHTML = `<span>${course.instructor}</span><span>${course.level}</span><span>${course.duration} min</span>`;
  card.appendChild(meta);

  const button = document.createElement('button');
  button.className = 'button button-primary';
  button.textContent = (user.plan === 'free' && course.price > 0) ? 'Assinar Plano' : 'Assistir Curso';
  button.addEventListener('click', () => {
    if (user.plan === 'free' && course.price > 0) {
      showPlanMessage();
      return;
    }
    openCourse(course);
  });
  card.appendChild(button);

  const progress = progressData[course.id] || 0;
  const progressInfo = document.createElement('p');
  progressInfo.style.color = '#aaa';
  progressInfo.style.fontSize = '0.95rem';
  progressInfo.textContent = `Progresso: ${progress}%`;
  card.appendChild(progressInfo);

  return card;
}

function renderCourses() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedLevel = levelFilter.value;
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                          course.description.toLowerCase().includes(searchTerm) ||
                          course.instructor.toLowerCase().includes(searchTerm);
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });
  coursesGrid.innerHTML = '';
  filteredCourses.forEach((course) => coursesGrid.appendChild(createCourseCard(course)));
}

function renderProgressList() {
  progressList.innerHTML = '';
  courses.forEach((course) => {
    const progress = progressData[course.id] || 0;
    const item = document.createElement('li');
    const bar = document.createElement('span');
    bar.className = 'progress-bar';
    bar.innerHTML = `<span class="progress-fill" style="width: ${progress}%;"></span>`;
    item.textContent = `${course.title}`;
    item.appendChild(bar);

    const percent = document.createElement('span');
    percent.textContent = `${progress}%`;
    item.appendChild(percent);
    progressList.appendChild(item);
  });
}

function showLoginModal() {
  const form = document.createElement('div');
  form.className = 'modal-body';
  form.innerHTML = `
    <div class="form-group">
      <label for="emailInput">Email</label>
      <input id="emailInput" type="email" placeholder="seu@email.com" />
    </div>
    <div class="form-group">
      <label for="nameInput">Nome</label>
      <input id="nameInput" type="text" placeholder="Seu nome" />
    </div>
  `;

  const loginButton = document.createElement('button');
  loginButton.className = 'button button-primary';
  loginButton.textContent = 'Entrar';
  loginButton.addEventListener('click', () => {
    const emailInput = document.getElementById('emailInput');
    const nameInput = document.getElementById('nameInput');
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    if (!email || !name) {
      alert('Preencha nome e email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email inválido.');
      return;
    }
    user.email = email;
    user.name = name;
    saveUser();
    updateUserUI();
    renderCourses();
    renderProgressList();
    closeModal();
  });

  const wrapper = document.createElement('div');
  wrapper.appendChild(form);
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  actions.appendChild(loginButton);
  wrapper.appendChild(actions);

  openModal('Entrar na plataforma', wrapper);
}

function showPlanMessage() {
  const content = document.createElement('div');
  content.innerHTML = `<p>Este curso exige plano pago. Escolha o plano Básico ou Premium para continuar.</p>`;
  const button = document.createElement('button');
  button.className = 'button button-primary';
  button.textContent = 'Ver Planos';
  button.addEventListener('click', () => {
    closeModal();
    window.location.hash = 'planos';
  });
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  actions.appendChild(button);
  content.appendChild(actions);
  openModal('Assinatura necessária', content);
}

function openCourse(course) {
  const progress = progressData[course.id] || 0;
  const videoContent = document.createElement('div');
  videoContent.className = 'modal-body';
  if (progress < 100) {
    videoContent.innerHTML = `
      <div class="video-overlay">
        <iframe src="https://www.youtube.com/embed/${course.youtubeId}?autoplay=1" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </div>
      <p>${course.description}</p>
      <p><strong>Instrutor:</strong> ${course.instructor}</p>
      <p><strong>Nível:</strong> ${course.level}</p>
    `;
    const completeButton = document.createElement('button');
    completeButton.className = 'button button-primary';
    completeButton.textContent = 'Marcar como completo';
    completeButton.addEventListener('click', () => {
      progressData[course.id] = 100;
      saveProgress();
      renderCourses();
      renderProgressList();
      closeModal();
      alert('Curso completado! Certificado disponível no seu perfil.');
    });
    const actions = document.createElement('div');
    actions.className = 'modal-actions';
    actions.appendChild(completeButton);
    videoContent.appendChild(actions);
  } else {
    videoContent.innerHTML = `
      <div class="certificate">
        <h3>Certificado de Conclusão</h3>
        <p>Parabéns, ${user.name}!</p>
        <p>Você concluiu o curso:</p>
        <h4>${course.title}</h4>
        <p>Instrutor: ${course.instructor}</p>
        <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      <p>${course.description}</p>
    `;
    const watchAgainButton = document.createElement('button');
    watchAgainButton.className = 'button button-secondary';
    watchAgainButton.textContent = 'Assistir Novamente';
    watchAgainButton.addEventListener('click', () => {
      openCourse(course); // Reabre com vídeo
    });
    const actions = document.createElement('div');
    actions.className = 'modal-actions';
    actions.appendChild(watchAgainButton);
    videoContent.appendChild(actions);
  }
  openModal(course.title, videoContent);
}

function selectPlan(plan) {
  user.plan = plan;
  saveUser();
  updateUserUI();
  renderCourses();
  renderProgressList();
  closeModal();
  const planName = plan === 'free' ? 'Gratuito' : plan === 'basic' ? 'Básico' : 'Premium';
  alert(`Plano ${planName} ativado!`);
}

function init() {
  updateUserUI();
  renderProgressList();

  fetch('courses.json')
    .then((response) => response.json())
    .then((data) => {
      courses = data;
      renderCourses();
      renderProgressList();
    })
    .catch(() => {
      coursesGrid.innerHTML = '<p>Falha ao carregar os cursos.</p>';
    });

  authButton.addEventListener('click', () => {
    if (user.email) {
      localStorage.removeItem(STORAGE_KEY);
      user.email = '';
      user.name = 'Visitante';
      user.plan = 'free';
      updateUserUI();
      renderCourses();
      renderProgressList();
    } else {
      showLoginModal();
    }
  });

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    user.email = '';
    user.name = 'Visitante';
    user.plan = 'free';
    updateUserUI();
    renderCourses();
    renderProgressList();
  });

  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem(STORAGE_KEY);
    user.email = '';
    user.name = 'Visitante';
    user.plan = 'free';
    updateUserUI();
    renderCourses();
    renderProgressList();
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  exploreCourses.addEventListener('click', () => (window.location.hash = '#cursos'));
  seePlans.addEventListener('click', () => (window.location.hash = '#planos'));

  searchInput.addEventListener('input', renderCourses);
  levelFilter.addEventListener('change', renderCourses);

  document.querySelectorAll('[data-plan]').forEach((button) => {
    button.addEventListener('click', () => selectPlan(button.dataset.plan));
  });
}

init();
