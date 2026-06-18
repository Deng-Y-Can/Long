const utils = {
    debounce(func, delay = 300, immediate = false) {
        let timer = null;
        return function(...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            if (immediate && !timer) {
                func.apply(context, args);
            }
            timer = setTimeout(() => {
                func.apply(context, args);
                timer = null;
            }, delay);
        };
    },

    throttle(func, limit = 300) {
        let inThrottle = false;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    parseTimeString(timeStr) {
        if (!timeStr) return 0;
        
        const patterns = [
            { regex: /(\d+)万年前/, multiplier: 10000 },
            { regex: /(\d+)千年前/, multiplier: 1000 },
            { regex: /(\d+)年前/, multiplier: 1 },
            { regex: /约?公元前(\d+)年/, multiplier: -1 },
            { regex: /约?(\d+)年/, multiplier: 1 },
            { regex: /(\d+)-(\d+)万年前/, multiplier: 10000 },
            { regex: /(\d+)-(\d+)年前/, multiplier: 1 },
        ];

        for (const pattern of patterns) {
            const match = timeStr.match(pattern.regex);
            if (match) {
                const num1 = parseInt(match[1]);
                const num2 = match[2] ? parseInt(match[2]) : num1;
                const avgYear = (num1 + num2) / 2;
                return avgYear * pattern.multiplier;
            }
        }
        return 0;
    },

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    formatNumber(num, decimals = 2) {
        return Number(num).toFixed(decimals);
    },

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    setQueryParam(name, value) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(name, value);
        window.history.pushState({}, '', `${window.location.pathname}?${urlParams}`);
    },

    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                if (item === null) return defaultValue;
                try {
                    return JSON.parse(item);
                } catch {
                    return item;
                }
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage clear error:', e);
                return false;
            }
        }
    },

    async fetchJSON(url, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch JSON error:', error);
            throw error;
        }
    },

    toast: {
        show(message, type = 'info', duration = 2500) {
            const container = document.getElementById('toast-container');
            if (!container) {
                const toastContainer = document.createElement('div');
                toastContainer.id = 'toast-container';
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
            }

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <i class="fa ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-warning' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            `;
            document.getElementById('toast-container').appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        },

        success(message) { this.show(message, 'success'); },
        warning(message) { this.show(message, 'warning'); },
        error(message) { this.show(message, 'error'); },
        info(message) { this.show(message, 'info'); }
    },

    loading: {
        show(text = '加载中...') {
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">${text}</div>
                    <div class="loading-progress">
                        <div class="loading-bar"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        },

        hide() {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => overlay.remove(), 300);
            }
        }
    },

    pagination: {
        create(totalItems, currentPage, pageSize, callback) {
            const totalPages = Math.ceil(totalItems / pageSize);
            const maxVisible = 5;
            const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            const end = Math.min(totalPages, start + maxVisible - 1);
            
            let html = '<div class="pagination">';
            
            if (currentPage > 1) {
                html += `<button class="page-btn" data-page="${currentPage - 1}">上一页</button>`;
            }
            
            if (start > 1) {
                html += `<button class="page-btn" data-page="1">1</button>`;
                if (start > 2) html += '<span class="page-dots">...</span>';
            }
            
            for (let i = start; i <= end; i++) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            
            if (end < totalPages) {
                if (end < totalPages - 1) html += '<span class="page-dots">...</span>';
                html += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
            }
            
            if (currentPage < totalPages) {
                html += `<button class="page-btn" data-page="${currentPage + 1}">下一页</button>`;
            }
            
            html += '</div>';
            
            const container = document.createElement('div');
            container.innerHTML = html;
            
            container.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const page = parseInt(btn.dataset.page);
                    if (page !== currentPage) callback(page);
                });
            });
            
            return container;
        }
    },

    searchHighlight(text, keyword) {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    },

    debounceInput(input, callback, delay = 300) {
        let timer = null;
        input.addEventListener('input', () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                callback(input.value);
            }, delay);
        });
    },

    animateScrollTo(element, duration = 500) {
        const targetPosition = element.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            window.scrollTo(0, startPosition + targetPosition * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    debounceScroll(callback, delay = 150) {
        let timer = null;
        window.addEventListener('scroll', () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(callback, delay);
        }, { passive: true });
    },

    throttleScroll(callback, limit = 150) {
        let inThrottle = false;
        window.addEventListener('scroll', () => {
            if (!inThrottle) {
                callback();
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }, { passive: true });
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone(phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    },

    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
        else if (userAgent.includes('Edg')) browser = 'Edge';
        else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
        
        return browser;
    },

    getOSInfo() {
        const userAgent = navigator.userAgent;
        let os = 'Unknown';
        
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac OS')) os = 'MacOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
        
        return os;
    },

    getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    },

    setScrollPosition(x, y) {
        window.scrollTo(x, y);
    },

    addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    },

    removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    },

    toggleClass(element, className) {
        if (element && className) {
            element.classList.toggle(className);
        }
    },

    hasClass(element, className) {
        return element && className && element.classList.contains(className);
    },

    css(element, properties) {
        if (element && typeof properties === 'object') {
            Object.assign(element.style, properties);
        }
    },

    getStyle(element, property) {
        if (element && property) {
            return window.getComputedStyle(element)[property];
        }
        return null;
    },

    onKeyDown(key, callback) {
        window.addEventListener('keydown', (e) => {
            if (e.key === key) {
                e.preventDefault();
                callback(e);
            }
        });
    },

    onEscape(callback) {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                callback(e);
            }
        });
    },

    onEnter(callback) {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                callback(e);
            }
        });
    },

    once(event, callback) {
        const handler = (...args) => {
            callback(...args);
            event.target.removeEventListener(event.type, handler);
        };
        event.target.addEventListener(event.type, handler);
    },

    xss: {
        escape(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        sanitizeHTML(html) {
            if (!html) return '';
            
            const allowedTags = [
                'b', 'strong', 'i', 'em', 'u', 's', 'sub', 'sup',
                'p', 'br', 'hr',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li', 'dl', 'dt', 'dd',
                'a', 'img',
                'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
                'span', 'div'
            ];
            
            const allowedAttributes = ['href', 'src', 'alt', 'title', 'class', 'id'];
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            const sanitizeElement = (element) => {
                if (element.nodeType === Node.TEXT_NODE) {
                    return;
                }
                
                const tagName = element.tagName.toLowerCase();
                
                if (!allowedTags.includes(tagName)) {
                    const textContent = element.textContent;
                    element.parentNode.replaceChild(document.createTextNode(textContent), element);
                    return;
                }
                
                Array.from(element.attributes).forEach(attr => {
                    if (!allowedAttributes.includes(attr.name.toLowerCase())) {
                        element.removeAttribute(attr.name);
                    } else if (attr.name.toLowerCase() === 'href' || attr.name.toLowerCase() === 'src') {
                        const value = attr.value.toLowerCase();
                        if (!value.startsWith('http://') && !value.startsWith('https://') && 
                            !value.startsWith('/') && !value.startsWith('./') && !value.startsWith('../')) {
                            element.removeAttribute(attr.name);
                        }
                    }
                });
                
                Array.from(element.childNodes).forEach(child => {
                    sanitizeElement(child);
                });
            };
            
            sanitizeElement(tempDiv);
            return tempDiv.innerHTML;
        },

        stripHTML(html) {
            if (!html) return '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return tempDiv.textContent || tempDiv.innerText || '';
        },

        isSafeURL(url) {
            if (!url) return false;
            try {
                const parsed = new URL(url);
                const allowedProtocols = ['http:', 'https:', 'data:'];
                return allowedProtocols.includes(parsed.protocol);
            } catch {
                return false;
            }
        }
    },

    validation: {
        required(value) {
            return value !== undefined && value !== null && value !== '';
        },

        minLength(value, min) {
            return String(value).length >= min;
        },

        maxLength(value, max) {
            return String(value).length <= max;
        },

        rangeLength(value, min, max) {
            const len = String(value).length;
            return len >= min && len <= max;
        },

        min(value, min) {
            const num = parseFloat(value);
            return !isNaN(num) && num >= min;
        },

        max(value, max) {
            const num = parseFloat(value);
            return !isNaN(num) && num <= max;
        },

        range(value, min, max) {
            const num = parseFloat(value);
            return !isNaN(num) && num >= min && num <= max;
        },

        pattern(value, pattern) {
            if (typeof pattern === 'string') {
                pattern = new RegExp(pattern);
            }
            return pattern.test(value);
        },

        email(value) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(value);
        },

        phone(value) {
            const re = /^1[3-9]\d{9}$/;
            return re.test(value);
        },

        url(value) {
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        },

        date(value) {
            const date = new Date(value);
            return date instanceof Date && !isNaN(date.getTime());
        },

        time(value) {
            const re = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
            return re.test(value);
        },

        datetime(value) {
            try {
                const date = new Date(value);
                return date instanceof Date && !isNaN(date.getTime());
            } catch {
                return false;
            }
        },

        number(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        integer(value) {
            const num = parseInt(value, 10);
            return !isNaN(num) && num.toString() === String(value);
        },

        float(value) {
            const num = parseFloat(value);
            return !isNaN(num) && isFinite(value);
        },

        alphanumeric(value) {
            const re = /^[a-zA-Z0-9]+$/;
            return re.test(value);
        },

        alpha(value) {
            const re = /^[a-zA-Z]+$/;
            return re.test(value);
        },

        chinese(value) {
            const re = /^[\u4e00-\u9fa5]+$/;
            return re.test(value);
        },

        passwordStrength(value) {
            let score = 0;
            
            if (value.length >= 8) score++;
            if (value.length >= 12) score++;
            if (/\d/.test(value)) score++;
            if (/[a-z]/.test(value)) score++;
            if (/[A-Z]/.test(value)) score++;
            if (/[^a-zA-Z0-9]/.test(value)) score++;
            
            if (score <= 2) return 'weak';
            if (score <= 4) return 'medium';
            return 'strong';
        },

        validateField(value, rules) {
            const errors = [];
            
            if (rules.required && !this.required(value)) {
                errors.push('此字段为必填项');
            }
            
            if (rules.minLength && !this.minLength(value, rules.minLength)) {
                errors.push(`最少需要${rules.minLength}个字符`);
            }
            
            if (rules.maxLength && !this.maxLength(value, rules.maxLength)) {
                errors.push(`最多允许${rules.maxLength}个字符`);
            }
            
            if (rules.min !== undefined && !this.min(value, rules.min)) {
                errors.push(`最小值为${rules.min}`);
            }
            
            if (rules.max !== undefined && !this.max(value, rules.max)) {
                errors.push(`最大值为${rules.max}`);
            }
            
            if (rules.pattern && !this.pattern(value, rules.pattern)) {
                errors.push(rules.patternMessage || '格式不正确');
            }
            
            if (rules.email && !this.email(value)) {
                errors.push('请输入有效的邮箱地址');
            }
            
            if (rules.phone && !this.phone(value)) {
                errors.push('请输入有效的手机号码');
            }
            
            if (rules.url && !this.url(value)) {
                errors.push('请输入有效的网址');
            }
            
            if (rules.number && !this.number(value)) {
                errors.push('请输入有效的数字');
            }
            
            if (rules.integer && !this.integer(value)) {
                errors.push('请输入有效的整数');
            }
            
            return errors;
        },

        validateForm(formData, fields) {
            const errors = {};
            let isValid = true;
            
            for (const [fieldName, rules] of Object.entries(fields)) {
                const value = formData[fieldName];
                const fieldErrors = this.validateField(value, rules);
                
                if (fieldErrors.length > 0) {
                    errors[fieldName] = fieldErrors;
                    isValid = false;
                }
            }
            
            return { isValid, errors };
        }
    },

    errorHandler: {
        init(options = {}) {
            const defaults = {
                enabled: true,
                showToast: true,
                logToConsole: true,
                reportError: false,
                reportUrl: '/api/error-report',
                maxErrorCount: 10,
                onError: null
            };
            
            this.options = { ...defaults, ...options };
            this.errorCount = 0;
            this.errors = [];
            
            this.setupGlobalHandlers();
        },

        setupGlobalHandlers() {
            window.addEventListener('error', (event) => {
                this.handleError(event.error || event.message, {
                    type: 'global',
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    event: event
                });
            });

            window.addEventListener('unhandledrejection', (event) => {
                this.handleError(event.reason, {
                    type: 'promise',
                    promise: event.promise,
                    event: event
                });
            });

            document.addEventListener('DOMContentLoaded', () => {
                this.setupResourceErrorHandlers();
            });
        },

        setupResourceErrorHandlers() {
            const resources = document.querySelectorAll('img, script, link');
            resources.forEach(resource => {
                resource.addEventListener('error', (event) => {
                    this.handleError(`Resource load failed: ${event.target.src || event.target.href}`, {
                        type: 'resource',
                        tagName: event.target.tagName,
                        src: event.target.src || event.target.href,
                        event: event
                    });
                });
            });
        },

        handleError(error, context = {}) {
            if (!this.options.enabled) return;
            if (this.errorCount >= this.options.maxErrorCount) return;

            const errorInfo = {
                id: this.generateErrorId(),
                timestamp: new Date().toISOString(),
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : null,
                type: context.type || 'unknown',
                url: window.location.href,
                userAgent: navigator.userAgent,
                ...context
            };

            this.errors.push(errorInfo);
            this.errorCount++;

            if (this.options.logToConsole) {
                console.error('[Global Error]', errorInfo);
            }

            if (this.options.showToast) {
                this.showErrorToast(errorInfo);
            }

            if (this.options.onError) {
                this.options.onError(errorInfo);
            }

            if (this.options.reportError) {
                this.reportError(errorInfo);
            }
        },

        generateErrorId() {
            return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },

        showErrorToast(errorInfo) {
            if (typeof utils !== 'undefined' && utils.toast) {
                utils.toast.error(`发生错误: ${errorInfo.message}`);
            } else {
                console.error('Toast module not available');
            }
        },

        async reportError(errorInfo) {
            try {
                await fetch(this.options.reportUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(errorInfo),
                    keepalive: true
                });
            } catch (reportError) {
                console.error('Failed to report error:', reportError);
            }
        },

        getErrors() {
            return [...this.errors];
        },

        clearErrors() {
            this.errors = [];
            this.errorCount = 0;
        },

        getErrorCount() {
            return this.errorCount;
        },

        enable() {
            this.options.enabled = true;
        },

        disable() {
            this.options.enabled = false;
        }
    },

    gracefulDegradation: {
        features: {},

        register(featureName, checkFn, fallbackFn) {
            this.features[featureName] = {
                check: checkFn,
                fallback: fallbackFn,
                supported: null
            };
        },

        async check(featureName) {
            const feature = this.features[featureName];
            if (!feature) return false;

            if (feature.supported !== null) {
                return feature.supported;
            }

            try {
                feature.supported = await feature.check();
                return feature.supported;
            } catch {
                feature.supported = false;
                return false;
            }
        },

        async run(featureName, ...args) {
            const supported = await this.check(featureName);
            
            if (supported) {
                try {
                    return { supported: true, result: args };
                } catch (error) {
                    console.warn(`Feature ${featureName} failed, falling back`);
                    return this.executeFallback(featureName, ...args);
                }
            } else {
                return this.executeFallback(featureName, ...args);
            }
        },

        async executeFallback(featureName, ...args) {
            const feature = this.features[featureName];
            if (!feature || !feature.fallback) {
                return { supported: false, result: null, error: 'No fallback available' };
            }

            try {
                const result = await feature.fallback(...args);
                return { supported: false, result, fallbackUsed: true };
            } catch (error) {
                return { supported: false, result: null, error: error.message };
            }
        },

        checkBrowserFeatures() {
            const checks = {
                localStorage: () => {
                    try {
                        const key = '__storage_test__';
                        localStorage.setItem(key, key);
                        localStorage.removeItem(key);
                        return true;
                    } catch {
                        return false;
                    }
                },
                sessionStorage: () => {
                    try {
                        const key = '__session_test__';
                        sessionStorage.setItem(key, key);
                        sessionStorage.removeItem(key);
                        return true;
                    } catch {
                        return false;
                    }
                },
                indexedDB: () => !!window.indexedDB,
                webWorker: () => !!window.Worker,
                fetch: () => !!window.fetch,
                Promise: () => !!window.Promise,
                IntersectionObserver: () => !!window.IntersectionObserver,
                requestAnimationFrame: () => !!window.requestAnimationFrame,
                matchMedia: () => !!window.matchMedia,
                clipboard: () => !!navigator.clipboard,
                geolocation: () => !!navigator.geolocation,
                deviceOrientation: () => !!window.DeviceOrientationEvent,
                deviceMotion: () => !!window.DeviceMotionEvent,
                battery: () => !!navigator.getBattery,
                vibration: () => 'vibrate' in navigator,
                webShare: () => 'share' in navigator,
                fullscreen: () => !!document.fullscreenEnabled,
                serviceWorker: () => 'serviceWorker' in navigator,
                crypto: () => !!window.crypto,
                WebAssembly: () => !!window.WebAssembly
            };

            const results = {};
            for (const [name, check] of Object.entries(checks)) {
                try {
                    results[name] = check();
                } catch {
                    results[name] = false;
                }
            }
            return results;
        },

        detectUnsupportedFeatures() {
            const features = this.checkBrowserFeatures();
            return Object.entries(features)
                .filter(([, supported]) => !supported)
                .map(([name]) => name);
        }
    }
};