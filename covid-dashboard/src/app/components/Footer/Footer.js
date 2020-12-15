import './Footer.scss';

export default class Footer {
    render() {
        const footer = document.createElement('footer');
        const container = document.createElement('div');
        const footerInner = document.createElement('div');
        const footerTop = this.#createFooterTop();
        const footerBottom = this.#createFooterBottom();

        footer.classList.add('footer');
        container.classList.add('container');
        footerInner.classList.add('footer__inner');

        footerInner.append(footerTop);
        footerInner.append(footerBottom);
        container.append(footerInner);
        footer.append(container);

        return footer;
    }

    #createFooterTop() {
        const footerTop = document.createElement('div');
        const footerTopCompany = this.#createFooterTopCompany();
        const footerTopContent = this.#createFooterTopContent();

        footerTop.classList.add('footer__top');

        footerTop.append(footerTopCompany);
        footerTop.append(footerTopContent);

        return footerTop;
    }

    #createFooterTopCompany() {
        const company = document.createElement('div');
        const companyName = this.#createCompanyName();

        company.classList.add('footer__top__company');

        company.append(companyName);
        return company;
    }

    #createCompanyName() {
        const companyName = document.createElement('h2');
        companyName.classList.add('footer__top__company__name');
        companyName.textContent = 'Covid dashboard';

        return companyName;
    }

    #createFooterTopContent() {
        const content = document.createElement('div');
        content.classList.add('footer__top__content');

        const authorsInfo = this.#createAuthorsInfo();
        const gratitudeInfo = this.#createGratitudeInfo();

        content.append(authorsInfo);
        content.append(gratitudeInfo);

        return content;
    }

    #createAuthorsInfo() {
        const authorsInfo = document.createElement('div');
        const authorsInfoTitle = document.createElement('h2');
        const firstAuthor = document.createElement('a');
        const secondAuthor = document.createElement('a');
        const thirdAuthor = document.createElement('a');

        authorsInfo.classList.add('footer__top__content__container');
        authorsInfoTitle.classList.add('footer__top__content__title');
        firstAuthor.classList.add('footer__top__content__link');
        secondAuthor.classList.add('footer__top__content__link');
        thirdAuthor.classList.add('footer__top__content__link');

        authorsInfoTitle.textContent = 'Team';
        firstAuthor.textContent = 'Dmitry Dutin';
        secondAuthor.textContent = 'Maxim Rynkov';
        thirdAuthor.textContent = 'Yaraslau Kabernik-Berazouski';

        firstAuthor.href = 'https://github.com/dmitrydutin';
        secondAuthor.href = 'https://github.com/maximzmei';
        thirdAuthor.href = 'https://github.com/asbarn';

        firstAuthor.target = '_blank';
        secondAuthor.target = '_blank';
        thirdAuthor.target = '_blank';

        authorsInfo.append(authorsInfoTitle);
        authorsInfo.append(firstAuthor);
        authorsInfo.append(secondAuthor);
        authorsInfo.append(thirdAuthor);

        return authorsInfo;
    }

    #createGratitudeInfo() {
        const gratitudeInfo = document.createElement('div');
        const gratitudeInfoTitle = document.createElement('h2');
        const gratitudeInfoMentor = document.createElement('a');
        const gratitudeInfoSchool = document.createElement('a');

        gratitudeInfo.classList.add('footer__top__content__container');
        gratitudeInfoTitle.classList.add('footer__top__content__title');
        gratitudeInfoMentor.classList.add('footer__top__content__link');
        gratitudeInfoSchool.classList.add('footer__top__content__link');

        gratitudeInfoTitle.textContent = 'Gratitude';
        gratitudeInfoMentor.textContent = 'Alexander';
        gratitudeInfoSchool.textContent = 'RSS';

        gratitudeInfoMentor.href = 'https://github.com/noway36';
        gratitudeInfoSchool.href = 'https://rs.school/';

        gratitudeInfoMentor.target = '_blank';
        gratitudeInfoSchool.target = '_blank';

        gratitudeInfo.append(gratitudeInfoTitle);
        gratitudeInfo.append(gratitudeInfoMentor);
        gratitudeInfo.append(gratitudeInfoSchool);

        return gratitudeInfo;
    }

    #createFooterBottom() {
        const footerBottom = document.createElement('div');
        const copyright = document.createElement('p');
        const courseInfo = document.createElement('a');

        footerBottom.classList.add('footer__bottom');
        copyright.classList.add('footer__bottom__copyright');
        courseInfo.classList.add('footer__bottom__course');

        copyright.textContent = 'Made with ️❤ in Belarus © 2020';

        courseInfo.href = 'https://rs.school/js/';
        courseInfo.target = '_blank';

        footerBottom.append(copyright);
        footerBottom.append(courseInfo);

        return footerBottom;
    }
}
