class Test {
    $$el

    $dialog //会话框
    $cancel
    $ok
    $input
    $keyboard
    /**
     * @param {el} el 要挂载的表单
     * @param {function} f 设置OK键要执行的方法
     */
    constructor(el, f) {
        this.$el = el
        this.f = f;
        this.init();
    }
    init() {
        this.createDialog();
    }
    createDialog() {
        console.log('createDialog');
        this.$dialog = document.createElement('div');
        this.$dialog.style = `
        border-radius: 10px;
        border: 2px solid pink;
        font-family: 楷体;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        top: 30%;
        left: 10%;
        right: 10%;
        bottom: 50%;
        position: fixed;`
        this.$dialog.innerHTML = `
        <ul>
            <h3>请输入密码</h3>
        </ul>
        <ul>
            <input type="text">
        </ul>
        <ul>
            <button>cancel</button>
            <button>OK</button>
        </ul>`
        this.$el.parentNode.appendChild(this.$dialog);
        this.$input = this.$dialog.getElementsByTagName('input')[0];
        this.$cancel = this.$dialog.getElementsByTagName('button')[0];
        this.$ok = this.$dialog.getElementsByTagName('button')[1];
        this.$input.style = `
        height: 40px;
        width: 100%`

        this.$input.readOnly = true;
        this.$input.addEventListener('click', this.show.bind(this));
        this.$cancel.addEventListener('click', this.cancel.bind(this));
        this.$ok.addEventListener('click', this.ok.bind(this));
    }
    createKeyboard() {
        console.log('createKeyboard');
        this.$keyboard = document.createElement('div');
        this.$keyboard.addEventListener('mouseleave', this.hidden.bind(this));
        this.$keyboard.setAttribute('id', 'keyboard');
        this.$dialog.appendChild(this.$keyboard);
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
    }
    edit(e) {
        if (e.target.innerHTML === 'X') {
            this.$input.value = this.$input.value.substring(0, this.$input.value.length - 1);
        } else if (e.target.innerHTML === 'OK') {
            // this.f();   //safeKeyboard实例化时传入的方法;
            console.log(this.$input.value);
            this.hidden();
        } else if (this.$input.value.length <= 16) {
            this.$input.value = this.$input.value + e.target.innerHTML;
        } else {
            console.warn("最长只能输入16位字符");
        }
    }
    cancel() {
        console.log('cancel' + this.$input.value);
        this.$dialog.remove();
    }
    ok() {
        console.log('ok' + this.$input.value);
        this.$dialog.remove();
    }
    show() {
        // this.$keyboard.style.display = 'block';
        this.createKeyboard();
    }
    hidden() {
        // this.$keyboard.style.display = 'none';
        this.$keyboard.remove();
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