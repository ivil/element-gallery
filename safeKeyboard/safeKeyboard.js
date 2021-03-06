class SafeKeyboard {
    $el
    $input
    $keyboard
    /**
     * @param {el} el 要挂载的表单,e.target
     * @param {function} f 设置OK键要执行的方法
     */
    constructor(el, f) {
        this.$el = el
        this.f = f;
        this.init();
    }
    init() {
        
        this.createKeyboard();
        // this.$keyboard.style.display = 'none';
        this.$input.addEventListener('click', this.show.bind(this));
        this.$keyboard.addEventListener('mouseleave', this.hidden.bind(this));
    }
    createKeyboard() {
        this.$input = document.createElement("input")
        this.$input.readOnly = true;
        this.$el.parentNode.appendChild(this.$input);
        
        this.$keyboard = document.createElement('div');
        this.$keyboard.setAttribute('id', 'keyboard');
        this.$el.parentNode.appendChild(this.$keyboard);
        this.$keyboard.style = `
        left: 0;
        right: 0;
        bottom: 0;
        height: 260px;
        width: 100%;
        background-color: #faf4f4;
        position: fixed;
        borderRadius: 5px
        `
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
            <li>0</li>
            <li>-</li>
            <li>OK</li>
        </ul>`
        let uls = document.querySelectorAll('#keyboard ul')
        uls.forEach(el => {
            // ul样式
            el.style = `
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 60px;
            `
        })
        let lis = document.querySelectorAll('#keyboard ul li')
        let values = []
        lis.forEach(el => {
            // 样式
            el.style = `
            width: 83px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            background: #fff
            `
            values.push(el.innerHTML)
            el.addEventListener('click', this.edit.bind(this))
        })
        // lis[3].style =``
        // lis[15].style.color = 'red'
    }
    edit(e) {
        if (e.target.innerHTML === 'X') {
            this.$input.value = this.$input.value.substring(0, this.$input.value.length - 1);
        } else if (e.target.innerHTML === 'OK') {
            // this.f();   //safeKeyboard实例化时传入的方法;
            this.hidden();
        } else if (this.$input.value.length <= 16) {
            this.$input.value = this.$input.value + e.target.innerHTML;
        } else {
            console.warn("最长只能输入16位字符");
        }
    }
    show() {
        this.$keyboard.style.display = 'block';
        // this.init()
    }
    hidden() {
        this.$keyboard.style.display = 'none';
    }
    checkPass(value) {
        let reg = /^\d{6}$/;
        if (reg.test(value)) {
            return true
        } else {
            console.warn("只能输入六位数字！！！");
            return false
        }
    }
}
// export default SafeKeyboard