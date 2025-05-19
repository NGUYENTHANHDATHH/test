// ==UserScript==
// @name         Always Visible + No Blur Detection
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 1. Ép trạng thái luôn "visible"
    Object.defineProperty(document, 'visibilityState', {
        get: function () {
            return 'visible';
        }
    });

    Object.defineProperty(document, 'hidden', {
        get: function () {
            return false;
        }
    });

    // 2. Vô hiệu hóa sự kiện visibilitychange
    const originalAddEventListener = document.addEventListener;
    document.addEventListener = function (type, listener, options) {
        if (['visibilitychange', 'blur', 'focus'].includes(type)) {
            console.log(`[Tampermonkey] Blocked event listener: ${type}`);
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // 3. Vô hiệu hóa onblur/onfocus trực tiếp trên window và document
    Object.defineProperty(window, 'onblur', {
        set: function () {
            console.log('[Tampermonkey] Blocked window.onblur');
        }
    });

    Object.defineProperty(window, 'onfocus', {
        set: function () {
            console.log('[Tampermonkey] Blocked window.onfocus');
        }
    });

    Object.defineProperty(document, 'onvisibilitychange', {
        set: function () {
            console.log('[Tampermonkey] Blocked document.onvisibilitychange');
        }
    });

    // 4. Gửi sự kiện giả định nếu trang cần
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));

    // (Tùy chọn) Giả vờ người dùng hoạt động để tránh bị tính idle
    setInterval(() => {
        window.dispatchEvent(new Event("mousemove"));
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }));
    }, 30000);
})();
