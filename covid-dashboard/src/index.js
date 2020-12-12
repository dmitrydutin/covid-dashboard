import 'normalize.css';
import './index.scss';

import AppDOM from './plugins/app-dom';
import App from './app/app';

window.addEventListener('DOMContentLoaded', () => {
    AppDOM.render(App, document.body);
});
