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

// Burger Menu JS for Mobile Screen
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
  
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);
  
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
  
        });
      });
    }
  
  });