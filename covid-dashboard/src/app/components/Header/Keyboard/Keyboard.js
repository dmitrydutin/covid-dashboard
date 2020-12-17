import './Keyboard.scss';
import config from './keyboard.json';

export default class Keyboard {
    elements = {
        keyboard: null,
        keysConfig: null,
        textBlock: null,
        searchDatalist: null,
        activeKeys: [],
    };

    properties = {
        value: '',
        lang: 'en',
        shift: false,
        capsLock: false,
        cursorPosition: 0,
        audio: false,
        micro: false,
    };

    constructor(textBlock, searchDatalist) {
        this.elements.textBlock = textBlock;
        this.elements.searchDatalist = searchDatalist;
        this.elements.keysConfig = config;

        this.elements.textBlock?.addEventListener('focus', () => {
            this.elements.keyboard.classList.remove('keyboard--hidden');
        });

        this.elements.textBlock.addEventListener('click', () => {
            this.properties.cursorPosition = this.elements.textBlock.selectionStart;
        });
    }

    render() {
        this.#generateKeyboard();
        this.#controlRealKeyboard();

        return this.elements.keyboard;
    }

    #generateKeyboard() {
        this.elements.keyboard = document.createElement('div');
        this.elements.keyboard.classList.add('keyboard', 'keyboard--hidden');
        this.#fillKeyboard();
    }

    #fillKeyboard() {
        const keyboardKeys = document.createDocumentFragment();

        this.elements.keysConfig.forEach((rowConfig) => {
            const row = this.#createRow(rowConfig);
            keyboardKeys.append(row);
        });

        this.elements.keyboard.innerHTML = '';
        this.elements.keyboard.append(keyboardKeys);
    }

    #createRow(rowConfig) {
        const row = document.createElement('div');
        row.classList.add('row');

        rowConfig.forEach((keyConfig) => {
            const key = this.#createKey(keyConfig);
            row.append(key);
        });

        return row;
    }

    #createKey(keyConfig) {
        if (keyConfig.event === 'touch-bar') {
            return this.#createTouchBar();
        }

        const key = document.createElement('div');
        key.classList.add(...this.#getKeyClasses(keyConfig));
        key.textContent = keyConfig[this.properties.lang][this.#getType()];

        key.addEventListener('click', () => {
            this.#setKeyEvent(keyConfig);
            this.#setKeyAudio(keyConfig);
        });

        return key;
    }

    #createTouchBar() {
        const voiceKeyConfig = {
            code: null,
            event: 'voice',
        };

        const microKeyConfig = {
            code: null,
            event: 'micro',
        };

        const touchBar = document.createElement('div');
        touchBar.classList.add('touch-bar');

        const voiceKey = document.createElement('div');
        const microKey = document.createElement('div');

        voiceKey.classList.add('keyboard__key', 'voice');
        microKey.classList.add('keyboard__key', 'micro');

        if (this.properties.audio === false) voiceKey.classList.add('active');
        if (this.properties.micro === false) microKey.classList.add('active');

        voiceKey.addEventListener('click', () => {
            this.#setKeyEvent(voiceKeyConfig);
            this.#setKeyAudio(voiceKeyConfig);
        });

        microKey.addEventListener('click', () => {
            this.#setKeyEvent(microKeyConfig);
            this.#setKeyAudio(microKeyConfig);
            this.#setSpeechRecognition();
        });

        touchBar.append(voiceKey);
        touchBar.append(microKey);
        return touchBar;
    }

    #getKeyClasses(keyConfig) {
        const classes = ['keyboard__key'];

        keyConfig.classes?.forEach((keyClass) => {
            classes.push(keyClass);
        });

        if (
            (keyConfig.code === '20' && this.properties.capsLock)
            || (keyConfig.code === '16' && this.properties.shift)
        ) {
            classes.push('active');
        }

        this.elements.activeKeys.forEach((activeKey) => {
            if (activeKey.code === keyConfig.code) {
                if (
                    activeKey.eventLocation === undefined
                    || activeKey.eventLocation === keyConfig.eventLocation
                ) {
                    classes.push('pressed');
                }
            }
        });

        return classes;
    }

    #getType() {
        if (this.properties.capsLock === true && this.properties.shift === true) return 'caps&shift';
        if (this.properties.capsLock === true) return 'caps';
        if (this.properties.shift === true) return 'shift';
        return 'default';
    }

    #setKeyEvent(keyConfig) {
        switch (keyConfig.event) {
            case 'delete':
                if (this.#isTextRange()) {
                    this.#setText('');
                } else if (this.properties.cursorPosition > 0) {
                    this.properties.value = this.properties.value.slice(
                        0,
                        this.properties.cursorPosition - 1,
                    )
                        + this.properties.value.slice(
                            this.properties.cursorPosition,
                        );

                    this.elements.textBlock.value = this.properties.value;
                    this.#setCursorPosition(-1);
                }
                break;
            case 'tab':
                this.#setText('    ');
                break;
            case 'caps':
                this.properties.capsLock = !this.properties.capsLock;
                this.#fillKeyboard();
                break;
            case 'enter':
                this.#setText('\n');
                break;
            case 'shift':
                this.properties.shift = !this.properties.shift;
                this.#fillKeyboard();
                break;
            case 'control':
                break;
            case 'alt':
                break;
            case 'close':
                this.elements.textBlock.blur();
                this.elements.keyboard.classList.add('keyboard--hidden');
                break;
            case 'lang':
                this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en';
                this.#fillKeyboard();
                break;
            case 'space':
                this.#setText(' ');
                break;
            case 'arrow-left':
                this.#setCursorPosition(-1);
                break;
            case 'arrow-right':
                this.#setCursorPosition(1);
                break;
            case 'voice':
                this.properties.audio = !this.properties.audio;
                this.#fillKeyboard();
                break;
            case 'micro':
                this.properties.micro = !this.properties.micro;
                this.#fillKeyboard();
                break;
            default:
                this.#setText(keyConfig[this.properties.lang][this.#getType()]);
        }

        if (keyConfig.event !== 'close') {
            this.elements.textBlock.focus();

            // const inputEvent = new Event('beforeinput');
            // this.elements.textBlock.dispatchEvent(inputEvent);

            // const focusEvent = new Event('focus');
            // this.elements.textBlock.dispatchEvent(focusEvent);

            // this.elements.textBlock.input();
            // console.log(this.elements.searchDatalist);
        }
    }

    #setText(text) {
        this.elements.textBlock.setRangeText(
            text,
            this.elements.textBlock.selectionStart,
            this.elements.textBlock.selectionEnd,
            'end',
        );
        this.properties.value = this.elements.textBlock.value;
        this.properties.cursorPosition = this.elements.textBlock.selectionStart;
    }

    #isTextRange() {
        return (
            this.elements.textBlock.selectionStart
            !== this.elements.textBlock.selectionEnd
        );
    }

    #setCursorPosition(mixing) {
        if (mixing === 1) {
            if (
                this.properties.cursorPosition
                < this.elements.textBlock.value.length
            ) {
                this.properties.cursorPosition += 1;
            }
        } else if (this.properties.cursorPosition > 0) {
            this.properties.cursorPosition -= 1;
        }

        this.elements.textBlock.selectionStart = this.properties.cursorPosition;
        this.elements.textBlock.selectionEnd = this.properties.cursorPosition;
    }

    #controlRealKeyboard() {
        this.elements.textBlock.addEventListener('keydown', (event) => {
            event.preventDefault();

            this.elements.keysConfig.forEach((rowConfig) => {
                if (event.which === undefined) return;

                rowConfig.forEach((keyConfig) => {
                    if (keyConfig.code === event.which.toString()) {
                        if (
                            keyConfig.eventLocation === undefined
                            || event.location.toString() === keyConfig.eventLocation
                        ) {
                            this.#setKeyEvent(keyConfig);
                            this.#toggleActiveKeys(keyConfig);
                            this.#setKeyAudio(keyConfig);
                        }
                    }
                });
            });
        });
    }

    #toggleActiveKeys(keyConfig) {
        this.elements.activeKeys.push(keyConfig);
        this.#fillKeyboard();

        setTimeout(() => {
            this.elements.activeKeys.shift();
            this.#fillKeyboard();
        }, 90);
    }

    #setKeyAudio(keyConfig) {
        if (this.properties.audio === false) return;

        switch (keyConfig.code) {
            case '8':
                new Audio('sounds/hihat.wav').play();
                break;
            case '20':
                new Audio('sounds/ride.wav').play();
                break;
            case '13':
                new Audio('sounds/tom.wav').play();
                break;
            case '16':
                new Audio('sounds/openhat.wav').play();
                break;
            default:
                if (this.properties.lang === 'en') {
                    new Audio('sounds/boom.wav').play();
                } else {
                    new Audio('sounds/kick.wav').play();
                }
        }
    }

    #setSpeechRecognition() {
        if (this.properties.micro === false) return;

        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new window.SpeechRecognition();
        recognition.interimResults = true;
        recognition.lang = this.properties.lang === 'en' ? 'en-US' : 'ru-RU';

        recognition.addEventListener('result', (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('');

            if (this.properties.micro === false) {
                recognition.stop();
            }

            if (event.results[0].isFinal) {
                this.properties.value += transcript;
                this.elements.textBlock.value = this.properties.value;
                this.properties.cursorPosition = this.elements.textBlock.selectionStart;
            }
        });

        recognition.addEventListener('end', () => {
            recognition.lang = this.properties.lang === 'en' ? 'en-US' : 'ru-RU';
            if (this.properties.micro) recognition.start();
        });

        recognition.start();
    }
}
