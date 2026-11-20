// ==========================================================================
// MARTINS DESIGN — SCRIPT COMPLETO (DARK MODE & RESPONSIVIDADE)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ——— GERENCIAMENTO DE TEMA (DARK / LIGHT MODE) ———
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const drawerThemeToggle = document.getElementById('drawerThemeToggle');
  const themeColorMeta = document.getElementById('theme-color-meta');
  
  // Verifica preferência anterior salva ou preferência do sistema operacional
  const savedTheme = localStorage.getItem('martins-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-theme');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#0C0C0E');
      localStorage.setItem('martins-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#ECEBE6');
      localStorage.setItem('martins-theme', 'light');
    }
  }

  // Inicializa o tema correto
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  // Alternar tema ao clicar
  function toggleTheme() {
    const isCurrentlyDark = document.body.classList.contains('dark-theme');
    applyTheme(!isCurrentlyDark);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  if (drawerThemeToggle) {
    drawerThemeToggle.addEventListener('click', toggleTheme);
  }

  // ——— CONTROLE DO MENU DRAWER MOBILE & TABLET ———
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Evita scroll de fundo
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Fecha o drawer ao clicar em qualquer link de navegação
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Fechar com a tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // ——— FORMULÁRIO COM DIRECIONAMENTO PARA O WHATSAPP DO VITOR ———
  window.handleSubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Coleta dos dados
    const nome = form.querySelector('input[type="text"]').value.trim();
    const tel = form.querySelector('input[type="tel"]').value.trim();
    const ramo = form.querySelector('select').value;
    const desc = form.querySelector('textarea').value.trim();

    btn.innerHTML = '<span>ENVIANDO...</span>';
    btn.disabled = true;

    // Mensagem formatada para o Vitor
    const msg = `Olá Vitor! Meu nome é ${nome}. Tenho interesse em criar um site para o ramo de "${ramo}". Mensagem: ${desc || 'Gostaria de combinar os detalhes durante o atendimento.'} (Contato: ${tel})`;
    const waUrl = `https://wa.me/5561986480461?text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
      btn.innerHTML = '<span>✓ ABRINDO WHATSAPP...</span>';
      btn.style.backgroundColor = '#25D366';
      btn.style.color = '#ffffff';

      setTimeout(() => {
        window.open(waUrl, '_blank');
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = '';
        btn.style.color = '';
        form.reset();
      }, 1000);
    }, 600);
  };

  // ——— EFEITO SUAVE DE REVEAL NOS CARDS COM INTERSECTION OBSERVER ———
  const animatedElements = document.querySelectorAll(
    '.service-col, .work-card, .step-card, .benefit-row, .faq-row'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.08}s, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.08}s`;
    observer.observe(el);
  });

  // ——— INDICADOR DE PASSOS NO SCROLL (01, 02, 03) ———
  const stepNums = document.querySelectorAll('.step-num');
  const sections = [
    document.getElementById('hero'),
    document.getElementById('servicos'),
    document.getElementById('portfolio')
  ];

  window.addEventListener('scroll', () => {
    const scrollMiddle = window.scrollY + window.innerHeight / 3;

    sections.forEach((sec, idx) => {
      if (!sec) return;
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;

      if (scrollMiddle >= top && scrollMiddle < bottom) {
        stepNums.forEach(s => s.classList.remove('active'));
        if (stepNums[idx]) stepNums[idx].classList.add('active');
      }
    });
  }, { passive: true });

  // ——— PARALLAX NO HERO (APENAS EM TELAS COM MOUSE/POINTER FINO) ———
  const heroCard = document.querySelector('.hero-card');
  const heroBg = document.querySelector('.hero-photo-bg');

  if (heroCard && heroBg && window.matchMedia('(pointer: fine)').matches) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroBg.style.transform = `scale(1.04) translate(${x * -10}px, ${y * -6}px)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroBg.style.transform = 'scale(1.02) translate(0px, 0px)';
    });
  }

  // ——— CLIQUE NOS CARDS DE TRABALHO ABRE WHATSAPP DO VITOR COM O NOME DO MODELO ———
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.card-title')?.textContent || '';
      const cat = card.querySelector('.card-category')?.textContent || '';
      const message = `Olá Vitor, gostei bastante do modelo de site estilo "${title} - ${cat}". Gostaria de saber mais para o meu negócio!`;
      window.open(`https://wa.me/5561986480461?text=${encodeURIComponent(message)}`, '_blank');
    });
  });

  console.log('%c MARTINS DESIGN ', 'background: #111; color: #fff; padding: 4px 12px; font-size: 13px; font-weight: bold; border-radius: 4px;');
  console.log('%c Sites modernos para microempresas | Falar com Vitor: (61) 98648-0461', 'color: #777; font-size: 12px;');

});
