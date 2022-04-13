const html = $('html');
const modals = $('.modal');
const modalTriggers = $('.js-modal-trigger')
const closeTriggers = $('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button')

const openModal = (el) => {
    el.addClass('is-active');
    html.addClass('is-clipped');
}

const closeModal = (el) => {
    el.removeClass('is-active');
    html.removeClass('is-clipped');
}

const closeAllModals = () => {
    (modals || []).each((i) => {
        closeModal($(modals[i]));
    });
}

(modalTriggers || []).each((i) => {
    const modal = $(modalTriggers[i]).data('target');
    const target = $(`#${modal}`);
    
    $(modalTriggers[i]).on('click', () => {
        openModal(target);
    })
});

(closeTriggers || []).each((i) => {
    const target = closeTriggers[i].closest('.modal');
    
    $(closeTriggers[i]).on('click', () => {
        closeModal($(target));
    });
});

$(document).on('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
        closeAllModals();
    }
});