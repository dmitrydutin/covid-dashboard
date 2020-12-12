import './Header.scss';

export default class Header {
    render() {
        const header = document.createElement('header');
        const container = document.createElement('div');
        const headerInner = document.createElement('div');

        header.classList.add('header');
        container.classList.add('container');
        headerInner.classList.add('header__inner');

        container.append(headerInner);
        header.append(container);

        return header;
    }
}
