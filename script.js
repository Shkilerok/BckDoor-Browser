
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Элементы ---
    const siteContentDiv = document.getElementById('siteContent');
    const authButtonsDiv = document.getElementById('authButtons');
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const authFormDiv = document.getElementById('authForm');
    const registerFormDiv = document.getElementById('registerForm');
    const loginFormDiv = document.getElementById('loginForm');
    const registerSubmitButton = document.getElementById('registerSubmit');
    const loginSubmitButton = document.getElementById('loginSubmit');
    const registerMessage = document.getElementById('registerMessage');
    const loginMessage = document.getElementById('loginMessage');
    const usernameRegisterInput = document.getElementById('usernameRegister');
    const passwordRegisterInput = document.getElementById('passwordRegister');
    const usernameLoginInput = document.getElementById('usernameLogin');
    const passwordLoginInput = document.getElementById('passwordLogin');
    const adminPanelDiv = document.getElementById('adminPanel');
    const createSiteButton = document.getElementById('createSiteButton');
    const grantSiteAccessButton = document.getElementById('grantSiteAccessButton');
    const editSiteButton = document.getElementById('editSiteButton');
    const createSiteFormDiv = document.getElementById('createSiteFormDiv');
    const grantAccessFormDiv = document.getElementById('grantAccessFormDiv');
    const editSiteFormDiv = document.getElementById('editSiteFormDiv');
    const submitNewSiteButton = document.getElementById('submitNewSite');
    const submitGrantAccessButton = document.getElementById('submitGrantAccess');
    const submitEditSiteButton = document.getElementById('submitEditSite');
    const siteNameInput = document.getElementById('siteName');
    const siteDescriptionInput = document.getElementById('siteDescription');
    const accessUsernameInput = document.getElementById('accessUsername');
    const grantAccessUsernameInput = document.getElementById('grantAccessUsername');
    const createSiteMessage = document.getElementById('createSiteMessage');
    const grantAccessMessage = document.getElementById('grantAccessMessage');
    const editSiteMessage = document.getElementById('editSiteMessage');
    const adminSiteManagementDiv = document.getElementById('adminSiteManagement');
    const siteSearchInput = document.getElementById('siteSearchInput');
    const siteListDiv = document.getElementById('siteList');
    const siteSearchBarInput = document.getElementById('siteSearchBar');
    const goButton = document.getElementById('goButton');
    const siteHtmlEditor = document.getElementById('siteHtml');
    const siteCssEditor = document.getElementById('siteCss');
    const siteJsEditor = document.getElementById('siteJs');
    const siteSuggestionsDatalist = document.getElementById('siteSuggestions');
    const backButton = document.getElementById('backButton');
    const container = document.querySelector('.container');

    const siteEditPanelDiv = document.getElementById('siteEditPanel');
    const siteHtmlEdit = document.getElementById('siteHtmlEdit');
    const siteCssEdit = document.getElementById('siteCssEdit');
    const siteJsEdit = document.getElementById('siteJsEdit');
    const saveSiteButton = document.getElementById('saveSiteButton');
    const cancelSiteButton = document.getElementById('cancelSiteButton');

    const editSiteNameInput = document.getElementById('editSiteName');
    const editSiteHtmlInput = document.getElementById('editSiteHtml');
    const editSiteCssInput = document.getElementById('editSiteCss');
    const editSiteJsInput = document.getElementById('editSiteJs');


    // --- Данные ---
    let currentUser = localStorage.getItem('currentUser');
    let users = {};
    let userSites = {};
    let currentSiteName = null;

    try {
        users = JSON.parse(localStorage.getItem('users')) || {};
        userSites = JSON.parse(localStorage.getItem('userSites')) || {};
    } catch (e) {
        console.error("Ошибка при чтении из localStorage:", e);
        alert("Ошибка при загрузке данных. Пожалуйста, обновите страницу.");
        localStorage.clear(); // Сброс localStorage в случае ошибки
        location.reload(); // Перезагрузка страницы для повторной инициализации
    }

    const adminUsername = 'DOROGO';
    const adminPassword = 'legaleongi';
    const regularDomains = ['.go', '.rus', '.lol', '.xxx'];
    const adminDomains = ['.dark-web', '.dark-net', '.tor'];

    // --- Функции ---

    function getSiteNamesList() {
        return Object.keys(userSites);
    }

    function updateSearchSuggestions(inputValue) {
        siteSuggestionsDatalist.innerHTML = '';

        if (!inputValue) {
            return;
        }

        const siteNames = getSiteNamesList();
        const suggestions = siteNames.filter(siteName =>
            siteName.toLowerCase().startsWith(inputValue.toLowerCase())
        );

        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            siteSuggestionsDatalist.appendChild(option);
        });
    }

    function displaySite(siteName) {
        siteContentDiv.innerHTML = '';
        currentSiteName = siteName;

        if (userSites[siteName]) {
            const site = userSites[siteName];

            // Сброс стилей и скриптов
            let styleElement = document.getElementById('site-style');
            if (styleElement) styleElement.textContent = '';
            let scriptElement = document.getElementById('site-script');
            if (scriptElement) scriptElement.textContent = '';

            // Обработка all-sites.xxx
            if (siteName === 'all-sites.xxx') {
                let allSitesHTML = '<h2>Список доступных сайтов:</h2><ul>';
                for (const siteName in userSites) {
                    if (userSites.hasOwnProperty(siteName) && siteName !== 'all-sites.xxx') {
                        const site = userSites[siteName];
                        allSitesHTML += `<li><a href="#" data-site="${siteName}">${siteName}</a> - ${site.description || 'Описание отсутствует'}</li>`;
                    }
                }
                allSitesHTML += '</ul>';
                siteContentDiv.innerHTML = allSitesHTML;

                // Обработчики кликов
                const siteLinks = siteContentDiv.querySelectorAll('a[data-site]');
                siteLinks.forEach(link => {
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        const targetSite = link.dataset.site;
                        displaySite(targetSite);
                    });
                });

                container.classList.add('site-view');
                backButton.style.display = 'block';
                backButton.onclick = showMainContent;
                siteEditPanelDiv.style.display = 'none';
                return;
            }

            // Отображение обычного сайта
            styleElement = document.getElementById('site-style');
            if (styleElement) {
                styleElement.textContent = site.css || '';
            } else {
                styleElement = document.createElement('style');
                styleElement.id = 'site-style';
                styleElement.textContent = site.css || '';
                document.head.appendChild(styleElement);
            }

            scriptElement = document.getElementById('site-script');
            if (scriptElement) {
                scriptElement.textContent = site.js || '';
            } else {
                scriptElement = document.createElement('script');
                scriptElement.id = 'site-script';
                scriptElement.textContent = site.js || '';
                document.body.appendChild(scriptElement);
            }

            siteContentDiv.innerHTML = site.html || '';

            // Добавляем код видео после основного контента
            if (site.video) {
                siteContentDiv.innerHTML += site.video;
            }

            const canEdit = site.access.includes(currentUser);

            if (canEdit) {
                siteEditPanelDiv.style.display = 'block';
                siteHtmlEdit.value = site.html || '';
                siteCssEdit.value = site.css || '';
                siteJsEdit.value = site.js || '';
            } else {
                siteEditPanelDiv.style.display = 'none';
            }

            container.classList.add('site-view');
            backButton.style.display = 'block';
            backButton.onclick = showMainContent;

        } else {
            siteContentDiv.innerHTML = `<p>Сайт "${siteName}" не найден.</p>`;
            let styleElement = document.getElementById('site-style');
            if (styleElement) styleElement.textContent = '';
            let scriptElement = document.getElementById('site-script');
            if (scriptElement) scriptElement.textContent = '';
        }
    }

    function checkAuth() {
        currentUser = localStorage.getItem('currentUser');
        updateAuthButtonsVisibility();
        updateAdminPanelVisibility();
    }

    function isAdmin() {
        return currentUser === adminUsername;
    }

    function updateAuthButtonsVisibility() {
        if (currentUser) {
            authButtonsDiv.style.display = 'none';
            logoutButton.style.display = 'inline-block';
            adminPanelDiv.style.display = isAdmin() ? 'block' : 'none';
        } else {
            authButtonsDiv.style.display = 'block';
            logoutButton.style.display = 'none';
            adminPanelDiv.style.display = 'none';
        }
    }

    function displaySiteList(searchTerm = '') {
        siteListDiv.innerHTML = '';
        const sites = userSites;
        const filteredSites = Object.keys(sites).filter(siteName =>
            siteName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredSites.length === 0) {
            siteListDiv.innerHTML = '<p>Сайты не найдены.</p>';
            return;
        }

        const siteListUl = document.createElement('ul');
        filteredSites.forEach(siteName => {
            const siteListItem = document.createElement('li');
            siteListItem.textContent = siteName;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.classList.add('delete-site-button');
            deleteButton.dataset.siteName = siteName;

            siteListItem.appendChild(deleteButton);
            siteListUl.appendChild(siteListItem);
        });
        siteListDiv.appendChild(siteListUl);
    }

    function updateAdminPanelVisibility() {
        adminSiteManagementDiv.style.display = isAdmin() ? 'block' : 'none';
        displaySiteList();
    }

    function showMainContent() {
        container.classList.remove('site-view');
        backButton.style.display = 'none';
        siteContentDiv.innerHTML = '<p>Добро пожаловать в анонимный браузер!</p>';

        // Очищаем стили и скрипты при возврате
        let styleElement = document.getElementById('site-style');
        if (styleElement) styleElement.textContent = '';
        let scriptElement = document.getElementById('site-script');
        if (scriptElement) scriptElement.textContent = '';

        backButton.onclick = null;
        siteEditPanelDiv.style.display = 'none';
    }

    function saveSiteChanges() {
        if (!currentSiteName) {
            editSiteMessage.textContent = "Ошибка: Не выбран сайт для редактирования.";
            return;
        }

        if (!userSites[currentSiteName]) {
            editSiteMessage.textContent = `Ошибка: Сайт "${currentSiteName}" не найден.`;
            return;
        }

        userSites[currentSiteName].html = siteHtmlEdit.value;
        userSites[currentSiteName].css = siteCssEdit.value;
        userSites[currentSiteName].js = siteJsEdit.value;
        userSites[currentSiteName].video = document.getElementById('siteVideoHtmlEdit').value; // Сохраняем код видео

        try {
            localStorage.setItem('userSites', JSON.stringify(userSites));
        } catch (e) {
            console.error("Ошибка при сохранении в localStorage:", e);
            editSiteMessage.textContent = "Ошибка: Не удалось сохранить изменения. Обновите страницу.";
            return;
        }

        editSiteMessage.textContent = "Изменения сохранены.";
        displaySite(currentSiteName);
    }

     // Функция для показа формы редактирования сайта
    function showEditSiteForm() {
        editSiteFormDiv.style.display = 'block';
        createSiteFormDiv.style.display = 'none';
        grantAccessFormDiv.style.display = 'none';
        createSiteMessage.textContent = '';
        grantAccessMessage.textContent = '';
        editSiteMessage.textContent = '';
    }

    // --- Инициализация ---
    checkAuth();

    // Создаем сайт "all-sites.xxx", если его еще нет
    if (!userSites['all-sites.xxx']) {
        userSites['all-sites.xxx'] = {
            description: 'Список всех сайтов',
            access: [adminUsername],
            html: '', // HTML генерируется динамически
            css: '',
            js: ''
        };

        try {
            localStorage.setItem('userSites', JSON.stringify(userSites));
        } catch (e) {
            console.error("Ошибка при создании all-sites.xxx:", e);
            alert("Ошибка при создании сайта all-sites.xxx. Обновите страницу.");
        }
    }

    // --- Обработчики событий ---

    saveSiteButton.addEventListener('click', (event) => {
        event.preventDefault();
        saveSiteChanges();
    });

    cancelSiteButton.addEventListener('click', (event) => {
        event.preventDefault();
        displaySite(currentSiteName);
    });

    siteSearchBarInput.addEventListener('input', () => {
        const currentInput = siteSearchBarInput.value.trim();
        updateSearchSuggestions(currentInput);
    });

    goButton.addEventListener('click', () => {
        const siteNameToGo = siteSearchBarInput.value.trim();
        displaySite(siteNameToGo);
    });

    siteSearchBarInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            goButton.click();
            event.preventDefault();
        }
    });

    registerButton.addEventListener('click', () => {
        authFormDiv.style.display = 'block';
        registerFormDiv.style.display = 'block';
        loginFormDiv.style.display = 'none';
        registerMessage.textContent = '';
        loginMessage.textContent = '';
    });

    loginButton.addEventListener('click', () => {
        authFormDiv.style.display = 'block';
        loginFormDiv.style.display = 'block';
        registerFormDiv.style.display = 'none';
        registerMessage.textContent = '';
        loginMessage.textContent = '';
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        checkAuth();
        siteContentDiv.innerHTML = '<p>Вы вышли из системы.</p>';
        // Очищаем стили и скрипты при выходе
        let styleElement = document.getElementById('site-style');
        if (styleElement) styleElement.textContent = '';
        let scriptElement = document.getElementById('site-script');
        if (scriptElement) scriptElement.textContent = '';
    });

    registerSubmitButton.addEventListener('click', (event) => {
        event.preventDefault();
        const username = usernameRegisterInput.value;
        const password = passwordRegisterInput.value;

        if (users[username]) {
            registerMessage.textContent = 'Пользователь с таким именем уже существует.';
            return;
        }

        users[username] = {
            password: password,
            sites: []
        };
        try {
            localStorage.setItem('users', JSON.stringify(users));
        } catch (e) {
            console.error("Ошибка при сохранении в localStorage:", e);
            registerMessage.textContent = "Ошибка: Не удалось сохранить данные. Обновите страницу.";
            return;
        }
        registerMessage.textContent = 'Регистрация успешна. Теперь войдите.';
        usernameRegisterInput.value = '';
        passwordRegisterInput.value = '';
    });

    loginSubmitButton.addEventListener('click', (event) => {
        event.preventDefault();
        const username = usernameLoginInput.value;
        const password = passwordLoginInput.value;

        if (users[username] && users[username].password === password) {
            localStorage.setItem('currentUser', username);
            currentUser = username;
            checkAuth();
            authFormDiv.style.display = 'none';
            loginMessage.textContent = 'Вход выполнен.';
            usernameLoginInput.value = '';
            passwordLoginInput.value = '';
            updateAdminPanelVisibility();
        } else {
            loginMessage.textContent = 'Неверное имя пользователя или пароль.';
        }
    });

    createSiteButton.addEventListener('click', () => {
        createSiteFormDiv.style.display = 'block';
        grantAccessFormDiv.style.display = 'none';
        editSiteFormDiv.style.display = 'none';
        createSiteMessage.textContent = '';
        grantAccessMessage.textContent = '';
        editSiteMessage.textContent = '';
    });

    grantSiteAccessButton.addEventListener('click', () => {
        grantAccessFormDiv.style.display = 'block';
        createSiteFormDiv.style.display = 'none';
        editSiteFormDiv.style.display = 'none';
        createSiteMessage.textContent = '';
        grantAccessMessage.textContent = '';
        editSiteMessage.textContent = '';
    });

    editSiteButton.addEventListener('click', showEditSiteForm);

    submitNewSiteButton.addEventListener('click', (event) => {
        event.preventDefault();
        const siteName = siteNameInput.value.trim();
        const siteDescription = siteDescriptionInput.value.trim();
        const siteHtmlCode = siteHtmlEditor.value;
        const siteCssCode = siteCssEditor.value;
        const siteJsCode = siteJsEditor.value;
        const siteVideoHtml = document.getElementById('siteVideoHtml').value; // Получаем код видео

        if (!siteName) {
            createSiteMessage.textContent = 'Введите имя сайта.';
            return;
        }

        let domain = '';
        let allowedDomains = regularDomains;
        if (isAdmin()) {
            allowedDomains = regularDomains.concat(adminDomains);
        }

        let isValidDomain = false;
        for (const dom of allowedDomains) {
            if (siteName.endsWith(dom)) {
                isValidDomain = true;
                domain = dom;
                break;
            }
        }

        if (!isValidDomain) {
            createSiteMessage.textContent = `Допустимые домены: ${allowedDomains.join(', ')}.`;
            return;
        }

        const siteNameWithoutDomain = siteName.substring(0, siteName.length - domain.length);
        const finalSiteName = siteNameWithoutDomain + domain;

        if (userSites[finalSiteName]) {
            createSiteMessage.textContent = `Сайт "${finalSiteName}" уже существует.`;
            return;
        }

        userSites[finalSiteName] = {
            description: siteDescription,
            access: [adminUsername],
            html: siteHtmlCode,
            css: siteCssCode,
            js: siteJsCode,
            video: siteVideoHtml // Сохраняем код видео
        };
        try {
            localStorage.setItem('userSites', JSON.stringify(userSites));
        } catch (e) {
            console.error("Ошибка при сохранении в localStorage:", e);
            createSiteMessage.textContent = "Ошибка: Не удалось сохранить сайт. Обновите страницу.";
            return;
        }
        createSiteMessage.textContent = `Сайт "${finalSiteName}" создан.`;
        siteNameInput.value = '';
        siteDescriptionInput.value = '';
        siteHtmlEditor.value = '';
        siteCssEditor.value = '';
        siteJsEditor.value = '';
        document.getElementById('siteVideoHtml').value = ''; // Очищаем поле видео
        displaySiteList();
    });

    submitGrantAccessButton.addEventListener('click', (event) => {
        event.preventDefault();
        const siteName = accessUsernameInput.value.trim();
        const usernameToGrantAccess = grantAccessUsernameInput.value.trim();

        if (!siteName || !usernameToGrantAccess) {
            grantAccessMessage.textContent = 'Введите имя сайта и имя пользователя.';
            return;
        }
        if (!userSites[siteName]) {
            grantAccessMessage.textContent = `Сайт "${siteName}" не найден.`;
            return;
        }
        if (!users[usernameToGrantAccess]) {
            grantAccessMessage.textContent = `Пользователь "${usernameToGrantAccess}" не найден.`;
            return;
        }

        if (!userSites[siteName].access.includes(usernameToGrantAccess)) {
            userSites[siteName].access.push(usernameToGrantAccess);
            try {
                localStorage.setItem('userSites', JSON.stringify(userSites));
            } catch (e) {
                console.error("Ошибка при сохранении в localStorage:", e);
                grantAccessMessage.textContent = "Ошибка: Не удалось выдать доступ. Обновите страницу.";
                return;
            }
            grantAccessMessage.textContent = `Доступ к сайту "${siteName}" выдан пользователю "${usernameToGrantAccess}".`;
        } else {
            grantAccessMessage.textContent = `У пользователя "${usernameToGrantAccess}" уже есть доступ к сайту "${siteName}".`;
        }
        accessUsernameInput.value = '';
        grantAccessUsernameInput.value = '';
    });

    submitEditSiteButton.addEventListener('click', (event) => {
        event.preventDefault();
        const siteNameToEdit = editSiteNameInput.value.trim();
        const newHtmlCode = editSiteHtmlInput.value;
        const newCssCode = editSiteCssInput.value;
        const newJsCode = editSiteJsInput.value;
        const newVideoCode = document.getElementById('editSiteVideoHtml').value; // Получаем код видео

        if (!siteNameToEdit) {
            editSiteMessage.textContent = 'Введите имя сайта для редактирования.';
            return;
        }

        if (!userSites[siteNameToEdit]) {
            editSiteMessage.textContent = `Сайт "${siteNameToEdit}" не найден.`;
            return;
        }

        userSites[siteNameToEdit].html = newHtmlCode;
        userSites[siteNameToEdit].css = newCssCode;
        userSites[siteNameToEdit].js = newJsCode;
        userSites[siteNameToEdit].video = newVideoCode; // Сохраняем код видео

        try {
            localStorage.setItem('userSites', JSON.stringify(userSites));
        } catch (e) {
            console.error("Ошибка при сохранении в localStorage:", e);
            editSiteMessage.textContent = "Ошибка: Не удалось сохранить изменения. Обновите страницу.";
            return;
        }

        editSiteMessage.textContent = `Сайт "${siteNameToEdit}" успешно отредактирован.`;

        // Очищаем поля формы после успешного сохранения
        editSiteNameInput.value = '';
        editSiteHtmlInput.value = '';
        editSiteCssInput.value = '';
        editSiteJsInput.value = '';
        document.getElementById('editSiteVideoHtml').value = ''; // Очищаем поле видео

        // Обновляем отображение сайта, если он открыт
        if (currentSiteName === siteNameToEdit) {
            displaySite(siteNameToEdit);
        }

        editSiteFormDiv.style.display = 'none'; //  Скрываем форму после сохранения
    });

    siteListDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-site-button')) {
            const siteNameToDelete = event.target.dataset.siteName;
            if (confirm(`Вы уверены, что хотите удалить сайт "${siteNameToDelete}"?`)) {
                delete userSites[siteNameToDelete];
                try {
                    localStorage.setItem('userSites', JSON.stringify(userSites));
                } catch (e) {
                    console.error("Ошибка при сохранении в localStorage:", e);
                    alert("Ошибка: Не удалось удалить сайт. Обновите страницу.");
                    return;
                }
                displaySiteList();
                siteContentDiv.innerHTML = '<p>Сайт удален.</p>';
                 // Очищаем стили и скрипты
                let styleElement = document.getElementById('site-style');
                if (styleElement) styleElement.textContent = '';
                let scriptElement = document.getElementById('site-script');
                if (scriptElement) scriptElement.textContent = '';
            }
        }
    });

    siteSearchInput.addEventListener('input', () => {
        displaySiteList(siteSearchInput.value.trim());
    });

    backButton.addEventListener('click', showMainContent);

    saveSiteButton.addEventListener('click', (event) => {
        event.preventDefault();
        saveSiteChanges();
    });

    cancelSiteButton.addEventListener('click', (event) => {
        event.preventDefault();
        displaySite(currentSiteName);
    });
});
