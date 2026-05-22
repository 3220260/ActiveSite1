/* =========================================
   ANALYTICS / TRACKING
   Μεταφέρθηκε από το main.js
========================================= */

/* =========================================
   1. CORE SETTINGS & TRACKING
   ========================================= */
const GA_MEASUREMENT_ID = 'G-LHQ9SHKY6J';
const IMAGE_PREVIEW_MIN_ZOOM = 1;
const IMAGE_PREVIEW_MAX_ZOOM = 4;
const MIN_CARD_VIEW_SECONDS = 2;
const SWIPE_BACK_MIN_DISTANCE = 90;
const SWIPE_BACK_MAX_VERTICAL_DISTANCE = 70;
const SWIPE_BACK_MAX_DURATION_MS = 900;
const SWIPE_BACK_EDGE_GUARD = 24;
const TRACKED_OFFERS = Object.freeze({
    mobileModal: 'Κινητή Τηλεφωνία',
    vodaModal: 'Vodafone CU',
    novaModal: 'NOVA Q',
    novaLinePhone: 'Σταθερό και Internet',
    novaEonModal: 'NOVA EON TV',
    healthModal: 'Προσφορά Υγείας',
    gprotasisModal: 'GProtasis',
});

let pageScrollY = 0;
let imagePreviewZoom = 1;
let imagePreviewPinchDistance = 0;
let imagePreviewPinchZoom = 1;
let imagePreviewDragging = false;
let imagePreviewDragStartX = 0;
let imagePreviewDragStartY = 0;
let imagePreviewDragScrollLeft = 0;
let imagePreviewDragScrollTop = 0;
let swipeBackStartX = 0;
let swipeBackStartY = 0;
let swipeBackStartTime = 0;
let swipeBackTracking = false;
const activeOfferViews = {};
const offerCardViewStarts = new Map();
const offerCardViewed = new Set();
let trackedOfferCards = [];

function loadAllTracking() {
    if (window.trackingLoaded) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { 'anonymize_ip': true });
    window.trackingLoaded = true;
}

function hasAnalyticsConsent() {
    return localStorage.getItem('cookieConsent') === 'accepted';
}

function trackEvent(category, action, label, params = {}) {
    if (hasAnalyticsConsent() && typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            ...params,
        });
    }
}

function getOfferName(modalId) {
    return TRACKED_OFFERS[modalId] || '';
}

function getOpenOfferContext() {
    const openOffer = Object.keys(TRACKED_OFFERS).find((modalId) => {
        const modal = document.getElementById(modalId);
        return modal && !modal.classList.contains('hidden');
    });

    return openOffer ? { offer_id: openOffer, offer_name: getOfferName(openOffer) } : {};
}


function getOpenTrackedModalId() {
    return Object.keys(TRACKED_OFFERS).find((modalId) => {
        const modal = document.getElementById(modalId);
        return modal && !modal.classList.contains('hidden');
    }) || '';
}
