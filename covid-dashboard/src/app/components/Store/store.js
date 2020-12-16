class Store {
    #country = null;
    #subscribers = [];

    get country() {
        return this.#country;
    }

    set country(country) {
        this.#country = country;
    }

    subscribe(listener) {
        this.#subscribers.push(listener);
    }

    notify() {
        this.#subscribers.forEach((listener) => {
            listener(this.#country);
        });
    }
}

export default new Store();
