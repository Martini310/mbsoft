import { initAnimations, typeWriterEffect } from './animations.js';
import { initUI, renderServices, renderPortfolio, populateContent, setUIText } from './ui.js';

let languages = {};
let currentLang = 'en';

// Expose translation function globally for Formspree script
window.getTranslation = function(path, defaultValue = '') {
    const langData = languages[currentLang];
    if (!langData) return defaultValue;
    const keys = path.split('.');
    let value = langData;
    for (const key of keys) {
        if (value === null || value === undefined) return defaultValue;
        value = value[key];
    }
    // Return the value even if it's an empty string, but return defaultValue if undefined/null
    if (value === undefined || value === null) return defaultValue;
    return value;
};

document.addEventListener('DOMContentLoaded', async () => {

    const loaderBar = document.getElementById('loader-bar');
    loaderBar.style.width = '30%';

    try {
        const response = await fetch('data.json');
        const data = await response.json();
        languages = data.languages || {};

        const savedLang = localStorage.getItem('preferredLang');
        const initialLang = savedLang && languages[savedLang] ? savedLang : (languages.en ? 'en' : Object.keys(languages)[0]);

        renderLanguage(initialLang);
        setupLanguageSwitchers();
        
        loaderBar.style.width = '70%';


        initUI();
        lucide.createIcons();


        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate minimum load time
        loaderBar.style.width = '100%';
        
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                
                initAnimations();
            }, 700);
        }, 500);

    } catch (error) {
        console.error('Initialization failed:', error);

        document.getElementById('loader').style.display = 'none';
    }
});

function renderLanguage(lang) {
    const langData = languages[lang];
    if (!langData) return;

    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLang', lang);

    populateContent(langData);
    renderServices(langData.services, langData.text.services);
    renderPortfolio(langData.portfolio);
    applyTranslations(langData.text);
    setUIText(langData.text.contact);
    typeWriterEffect(langData.company.subheadline);
    lucide.createIcons();
    syncLanguageSwitchers(lang);
    
    // Update form button text
    const formButton = document.getElementById('my-form-button');
    if (formButton && langData.text.contact?.buttons?.submit) {
        formButton.innerHTML = langData.text.contact.buttons.submit;
        if (window.updateButtonText) {
            window.updateButtonText();
        }
    }
}

function applyTranslations(texts) {
    if (!texts) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const value = resolveText(key, texts);
        if (value) {
            el.textContent = value;
        }
    });

    const placeholders = texts.contact?.form?.placeholders;
    if (placeholders) {
        const name = document.getElementById('input-name');
        const email = document.getElementById('input-email');
        const message = document.getElementById('input-message');
        if (name) name.placeholder = placeholders.name || name.placeholder;
        if (email) email.placeholder = placeholders.email || email.placeholder;
        if (message) message.placeholder = placeholders.message || message.placeholder;
    }

    const subjects = texts.contact?.form?.subjects;
    if (subjects && Array.isArray(subjects)) {
        const select = document.getElementById('subject-select');
        if (select) {
            select.innerHTML = subjects.map(sub => `<option>${sub}</option>`).join('');
        }
    }
}

function resolveText(path, obj) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

function setupLanguageSwitchers() {
    const desktop = document.getElementById('language-switcher');
    const mobile = document.getElementById('language-switcher-mobile');

    const handler = (event) => {
        const value = event.target.value;
        if (value !== currentLang) renderLanguage(value);
    };

    if (desktop) desktop.addEventListener('change', handler);
    if (mobile) mobile.addEventListener('change', handler);
}

function syncLanguageSwitchers(lang) {
    const desktop = document.getElementById('language-switcher');
    const mobile = document.getElementById('language-switcher-mobile');
    if (desktop) desktop.value = lang;
    if (mobile) mobile.value = lang;
}
