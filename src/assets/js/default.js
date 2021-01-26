/**
 *
 *     MOBILE MENU
 *
 * */
const body = document.querySelector('body')
const burger = document.querySelector('.js-burger');
const menuItems = document.querySelectorAll('.mob-menu__list .mob-menu__point');


burger.addEventListener('click', e => {
    if (!body.classList.contains('menuMobActive')) {
        body.classList.add('menuMobActive')
    } else {
        body.classList.remove('menuMobActive')
    }
});

menuItems.forEach(el => {
    el.addEventListener('click', e => {
        body.classList.remove('menuMobActive')
    });
});

const removeAllActiveClasses = (event) => {
    window.addEventListener(event, event => {
        body.classList.remove('menuMobActive')
    });
};

removeAllActiveClasses('resize');

console.log('tere')

/**
 *
 * SMOOTH SCROLLING ON ANCHORS
 *
 **/


function throttle(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    let later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        let now = Date.now();
        if (!previous && options.leading === false) previous = now;
        let remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

let scroll = new SmoothScroll('a[href*="#"]', {
    header: '[data-scroll-header]',
    speed: 500,
    speedAsDuration: true,
});

const btt = document.querySelector('.js-btt'); //Back to top


function elemDistance(className) {
    const btn = document.querySelector(className);
    if (!btn) {
        return;
    }
    const btnDistance = btn.getBoundingClientRect().height + btn.getBoundingClientRect().top + pageYOffset;
    return btnDistance;
}

const availabilityBtnHeight = elemDistance('.productDesc__infoRightColl');
const offerBtnHeight = elemDistance('.offer__btn');

// Добавялем throttle
window.addEventListener('scroll', throttle(scrollFunctionFirst, 200));

function scrollFunctionFirst() {
    scrollFunctionInner(btt, 'js-active-btt');
    if (availabilityBtnHeight) {
        scrollFunctionInner(body, 'js-availability-btn', availabilityBtnHeight);
    }
}

function scrollFunctionInner(classFound, classAdd, px = 0) {


    if (classFound) {
        if (document.body.scrollTop > px || document.documentElement.scrollTop > px) {
            classFound.classList.add(classAdd);
        } else {
            classFound.classList.remove(classAdd);
        }
    }
}

scrollFunctionFirst();