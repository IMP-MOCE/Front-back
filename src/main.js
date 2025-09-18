// Функции для работы с темой
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('theme-dark');
    }
}

function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'button theme-toggle';
    themeToggle.type = 'button';
    themeToggle.setAttribute('aria-pressed', document.body.classList.contains('theme-dark'));
    themeToggle.innerHTML = `
        <span class="theme-toggle__icon">🌓</span>
        <span class="theme-toggle__text">Тема</span>
    `;
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme-dark');
        themeToggle.setAttribute('aria-pressed', String(isDark));
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    return themeToggle;
}

// Инициализация темы при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Добавляем переключатель темы в хедер
    const headerContainer = document.querySelector('.site-header__container');
    if (headerContainer) {
        const themeToggle = createThemeToggle();
        headerContainer.appendChild(themeToggle);
    }
});

// Код для модального окна (только если элементы существуют)
const initModal = () => {
    const dlg = document.getElementById('contactDialog');
    const openBtn = document.getElementById('openDialog');
    const closeBtn = document.getElementById('closeDialog');
    const form = document.getElementById('contactForm');
    
    if (!dlg || !openBtn) return; // Если элементов нет, выходим
    
    let lastActive = null;

    // Открытие модального окна
    openBtn.addEventListener('click', () => {
        lastActive = document.activeElement;
        dlg.showModal();
        dlg.querySelector('input, select, textarea, button')?.focus();
    });

    // Закрытие модального окна
    closeBtn?.addEventListener('click', () => dlg.close('cancel'));

    // Обработка отправки формы
    form?.addEventListener('submit', (e) => {
        // Сброс кастомных сообщений
        [...form.elements].forEach(el => el.setCustomValidity?.(''));
        
        // Проверка встроенных ограничений
        if (!form.checkValidity()) {
            e.preventDefault();
            
            // Таргетированные сообщения об ошибках
            const email = form.elements.email;
            if (email?.validity.typeMismatch) {
                email.setCustomValidity('Введите корректный e-mail, например name@example.com');
            }
            
            const phone = form.elements.phone;
            if (phone?.validity.patternMismatch) {
                phone.setCustomValidity('Введите телефон в формате +7 (900) 000-00-00');
            }
            
            form.reportValidity();
            
            // Подсветка проблемных полей для доступности
            [...form.elements].forEach(el => {
                if (el.willValidate) {
                    el.toggleAttribute('aria-invalid', !el.checkValidity());
                }
            });
            return;
        }
        
        e.preventDefault();
        alert("Форма успешно отправлена!");
        dlg.close('success');
        form.reset();
        
        // Сброс состояния доступности
        [...form.elements].forEach(el => {
            el.removeAttribute('aria-invalid');
        });
    });

    // Маска для телефона
    const phone = document.getElementById('phone');
    phone?.addEventListener('input', () => {
        const digits = phone.value.replace(/\D/g,'').slice(0, 11);
        const d = digits.replace(/^8/, '7');
        
        const parts = [];
        if (d.length > 0) parts.push('+7');
        if (d.length > 1) parts.push(' (' + d.slice(1, 4));
        if (d.length >= 4) parts[parts.length - 1] += ')';
        if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
        if (d.length >= 8) parts.push('-' + d.slice(7, 9));
        if (d.length >= 10) parts.push('-' + d.slice(9, 11));
        
        phone.value = parts.join('');
    });

    // Возврат фокуса после закрытия модального окна
    dlg.addEventListener('close', () => {
        lastActive?.focus();
    });
};

// Инициализация модального окна при загрузке
document.addEventListener('DOMContentLoaded', initModal);