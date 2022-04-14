const loadHTML = (...funcs) => {
    $('#navbar-container').load('navbar.html');
    $('#footer-container').load('footer.html');
    $('#modal-container').load('modals.html');
    window.addEventListener('load', (event) => {
        event.preventDefault();
        for (let func of funcs) {
            func();
        }
    });
}

export { loadHTML }