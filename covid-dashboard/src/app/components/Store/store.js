class Store {
    #country = null;
    #criterion = {
        name: 'Total number of cases',
        value: 'cases',
        color: '#BC0000',
    };

    #subscribers = [];
    #subscribersCriterion = [];
    #theme = 'dark';

    get country() {
        return this.#country;
    }

    set country(country) {
        this.#country = country;
    }

    get criterion() {
        return this.#criterion;
    }

    set criterion(criterion) {
        this.#criterion = criterion;
    }

    get theme() {
        return this.#theme;
    }

    set theme(theme) {
        this.#theme = theme;
    }

    subscribe(listener) {
        this.#subscribers.push(listener);
    }

    notify() {
        this.#subscribers.forEach((listener) => {
            listener(this.#country);
        });
    }

    subscribeCriterion(listener) {
        this.#subscribersCriterion.push(listener);
    }

    notifyCriterion() {
        this.#subscribersCriterion.forEach((listener) => {
            listener(this.#criterion);
        });
    }
}

export default new Store();
