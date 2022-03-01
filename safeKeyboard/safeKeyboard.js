class SafeKeyboard {
    $input
    $keyboard
    /**
     * 
     * @param {String} inputTag 挂载的元素
     */
    constructor(inputTag) {
        this.$input = document.querySelector(inputTag);
        this.init();
    }
    init() {
        this.$input.readOnly = true;
        this.createKeyboard();
        this.$keyboard.style.display = 'none';
        this.$input.addEventListener('click',this.show.bind(this));
    }
    createKeyboard() {
        this.$keyboard = document.createElement('div');
        this.$keyboard.setAttribute('id', 'keyboard');
        this.$input.parentNode.appendChild(this.$keyboard);
        this.$keyboard.style = `
        left: 0;
        right: 0;
        bottom: 0;
        height: 260px;
        background-color: whitesmoke;
        position: fixed;`
        this.$keyboard.innerHTML = `
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>X</li>
        </ul>
        <ul>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>@</li>
        </ul>
        <ul>
            <li>7</li>
            <li>8</li>
            <li>9</li>
            <li>.</li>
        </ul>
        <ul>
            <li>+</li>
            <li>-</li>
            <li>*</li>
            <li>OK</li>
        </ul>`
        let uls = document.querySelectorAll('#keyboard ul')
        uls.forEach(el => {
            el.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;`
        })
        let lis = document.querySelectorAll('#keyboard ul li')
        let values = []
        lis.forEach(el => {
            el.style = `
            height: 100%;
            width: 25%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: x-large;
            font-weight: bold;`
            values.push(el.innerHTML)
            el.addEventListener('click', this.edit.bind(this))
        })
    }
    edit(e) {
        if (e.target.innerHTML === 'X') {
            this.$input.value = this.$input.value.substring(0, this.$input.value.length - 1);
        } else if (e.target.innerHTML === 'OK') {
            this.$keyboard.style.display = 'none';
        } else {
            this.$input.value = this.$input.value + e.target.innerHTML;
        }
    }
    show() {
        this.$keyboard.style.display = 'block';
    }
}
