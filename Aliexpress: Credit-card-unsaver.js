// ==UserScript==
// @name         Aliexpress: Credit card unsaver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Запрещает сохранять данные кредитных карт в кошелёк при оплате
// @author       SkyDancer
// @homepage     https://github.com/SiriusED/Aliexpress-Credit-card-unsaver
// @supportURL   https://github.com/SiriusED/Aliexpress-Credit-card-unsaver/issues
// @updateURL    https://github.com/SiriusED/Aliexpress-Credit-card-unsaver/blob/main/Aliexpress:%20Credit-card-unsaver.js
// @downloadURL  https://github.com/SiriusED/Aliexpress-Credit-card-unsaver/blob/main/Aliexpress:%20Credit-card-unsaver.js
// @match        *://shoppingcart.aliexpress.com/order/*
// @grant        none
// ==/UserScript==


(async function() {
	'use strict';

    /*
    * Page conditions
    */
    if (page() == 'orders' && !document.cardUnsaverDone) {
        let styles = `.next-overlay-wrapper { visibility: collapse !important; }`;
        let styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.append(styleSheet);
        let saveCardCheckbox = await waitForElement('.next-checkbox-input', 100, 30, false);
        if (!!saveCardCheckbox) {
            saveCardCheckbox.click();
            let saveCardConfirmContainer = await waitForElement('.save-card-info-confirm', 100, 30, false);
            if (!!saveCardConfirmContainer) {
                let saveCardSkipButton = saveCardConfirmContainer.querySelector('.next-btn-normal');
                saveCardSkipButton.click();
                document.cardUnsaverDone = true;

            }
        }
    }

    /*
     * Seconds: 0 - Wait until an element apears
     */
    async function waitForElement(selectors, interval = 250, seconds = 0, waitForDisappear = false) {
        return new Promise((resolve) => {
            if (!Array.isArray(selectors)) {
                selectors = [selectors];
            }

            seconds = seconds * 1000;

            const startTime = Date.now();
            let element = null;
            const check = () => {
                let found = selectors.some(s => {
                    const el = document.querySelector(s);
                    let result = !!(el && isVisible(el));
                    if (result) {
                        element = el;
                    }
                    return result;
                })

                if (!waitForDisappear && found || waitForDisappear && !found) {
                    return resolve(element);
                }

                if ((seconds > 0 && Date.now() - startTime > seconds) && !(seconds == 0)) {
                    return resolve(null);
                }

                setTimeout(check, interval);
            };

            check();
        });
    }

    async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function page() {
        if (window.location.href.startsWith('https://shoppingcart.aliexpress.com/order/') || window.location.href.startsWith('https://shoppingcart.aliexpress.ru/order/')) {
            return 'orders';
        }
    }

    function isVisible(e) {
        return !!e && (!!(e.offsetWidth || e.offsetHeight || e.getClientRects().length));
    };

})();
