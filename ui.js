let uiText = {
    buttons: {
        submit: '[ TRANSMIT DATA ]',
        sending: '[ TRANSMITTING... ]',
        success: '[ DATA RECEIVED ]'
    }
};

export function setUIText(text) {
    if (text && text.buttons) {
        uiText = { ...uiText, ...text };
        uiText.buttons = { ...uiText.buttons, ...text.buttons };
    }

    const submitButton = document.getElementById('my-form-button');
    if (submitButton && uiText.buttons.submit) {
        submitButton.innerHTML = uiText.buttons.submit;
    }
}

export function populateContent(data) {
    document.getElementById('nav-logo').src = data.company.logo_url;
    document.getElementById('hero-bg').style.backgroundImage = `url('${data.hero.background_image}')`;
    document.getElementById('about').style.backgroundImage = `url('${data.about.background}')`;
    document.getElementById('about-mission').textContent = data.about.mission;
    document.getElementById('about-approach').textContent = data.about.approach;
    document.getElementById('contact-map').src = data.contact.map_image;
    
    document.getElementById('contact-address').textContent = data.company.address;
    document.getElementById('contact-email').textContent = data.company.email;
    // document.getElementById('contact-phone').textContent = data.company.phone;
}

export function renderServices(services, textOverrides = {}) {
    const grid = document.getElementById('services-grid');
    const accessLabel = textOverrides.accessDetails || '[ ACCESS_DETAILS ]';
    grid.innerHTML = services.map((service, index) => `
        <div class="service-card glass-panel p-8 rounded-xl border border-white/5 relative group cursor-pointer overflow-hidden" data-index="${index}">
            <div class="absolute top-0 right-0 w-20 h-20 bg-azure/10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
            
            <div class="relative z-10">
                <div class="w-14 h-14 bg-deepspace rounded-lg border border-azure/30 flex items-center justify-center shadow-[0_0_15px_rgba(46,92,255,0.3)] mb-8 group-hover:scale-110 transition-transform duration-300">
                    <img src="${service.icon_url}" class="w-8 h-8 object-contain" alt="${service.title}" loading="lazy">
                </div>
                <h3 class="font-heading font-bold text-xl text-white mb-3 group-hover:text-cyanpulse transition-colors">${service.title}</h3>
                <p class="text-slatemist text-sm leading-relaxed mb-6">${service.blurb}</p>
                <div class="flex items-center text-xs font-mono text-azure opacity-80 group-hover:opacity-100 transition-opacity">
                    ${accessLabel} <i data-lucide="chevron-right" class="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"></i>
                </div>
            </div>
        </div>
    `).join('');


    grid.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => openModal(services[card.dataset.index], 'service'));
    });
}

export function renderPortfolio(items) {
    const container = document.getElementById('portfolio-container');
    container.innerHTML = items.map((item, index) => `
        <div class="portfolio-item min-w-[300px] md:min-w-[450px] snap-center rounded-xl overflow-hidden relative group aspect-video cursor-pointer border border-white/5" data-index="${index}">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-90 transition-opacity"></div>
            
            <div class="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div class="flex justify-between items-end">
                    <div>
                        <span class="text-xs font-mono text-cyanpulse mb-1 block px-2 py-0.5 bg-cyanpulse/10 rounded w-fit">${item.category}</span>
                        <h3 class="font-heading font-bold text-2xl text-white mb-2">${item.title}</h3>
                        <p class="text-slatemist text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">${item.desc}</p>
                    </div>
                    <div class="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:bg-azure group-hover:border-azure transition-colors">
                        <i data-lucide="arrow-up-right" class="w-5 h-5 text-white"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');


    container.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => openModal(items[item.dataset.index], 'portfolio'));
    });
}


const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalImageContainer = document.getElementById('modal-image-container');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');
const modalCTA = document.getElementById('modal-cta');

function openModal(data, type) {
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.details || data.blurb;
    

    modalTags.innerHTML = '';
    

    const tags = data.stack || (data.category ? [data.category] : []);
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = "text-xs font-mono text-cyanpulse border border-cyanpulse/30 px-2 py-1 rounded bg-cyanpulse/5";
        span.textContent = tag;
        modalTags.appendChild(span);
    });


    if (type === 'portfolio' && data.image) {
        modalImage.src = data.image;
        modalImageContainer.classList.remove('hidden');
    } else {
        modalImageContainer.classList.add('hidden');
    }

    modalOverlay.classList.remove('hidden');

    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }, 400);
}

export function initUI() {

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) closeModal();
    });
    if (modalCTA) {
        modalCTA.addEventListener('click', () => {
            closeModal();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    const nameInput = document.getElementById('input-name');
                    if (nameInput) nameInput.focus();
                }, 400);
            }
        });
    }


    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            menu.classList.remove('translate-x-full');
            menuBtn.innerHTML = '<i data-lucide="x" class="w-8 h-8"></i>';
        } else {
            menu.classList.add('translate-x-full');
            menuBtn.innerHTML = '<i data-lucide="menu" class="w-8 h-8"></i>';
        }
        lucide.createIcons();
    }

    menuBtn.addEventListener('click', toggleMenu);
    links.forEach(link => link.addEventListener('click', toggleMenu));


    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-obsidian/80', 'backdrop-blur-md', 'shadow-lg', 'border-white/10');
            navbar.classList.remove('border-transparent');
        } else {
            navbar.classList.remove('bg-obsidian/80', 'backdrop-blur-md', 'shadow-lg', 'border-white/10');
            navbar.classList.add('border-transparent');
        }
    });


}
