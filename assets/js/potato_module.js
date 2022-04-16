import { init_modals } from './modals.js';
import { quickFix, getUser } from './user.js';
import { init_search } from './search.js';

// load HTML before performing doing functions
const loadHTML = (...funcs) => {
    $('#navbar-container').load('navbar.html', () => {
        $('#footer-container').load('footer.html', () => {
            $('#modal-container').load('modals.html', () => {
                for (let func of funcs) {
                    func();
                }
            })
        })
    })
}

loadHTML(init_modals, quickFix, init_search);

