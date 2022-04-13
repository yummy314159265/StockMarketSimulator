const loginButtonEl = $('#login-button');
const loginModalEl = $('#login-container')
const modalCloseEl = $('.modal-close')

const showLoginModal = (event) => {
    event.preventDefault();
    loginModalEl.addClass('is-active');
}

const closeModal = (event) => {
    event.preventDefault();
    loginModalEl.removeClass('is-active');
}

loginButtonEl.on('click', showLoginModal);
modalCloseEl.on('click', closeModal);