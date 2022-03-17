class Keyboard {
    $el

    $dialog //会话框
    $cancel
    $ok
    $input
    $visibility
    $keyboard
    /**
     * @param {el} el 要挂载的表单
     * @param {function} submit 设置OK键要执行的方法
     */
    constructor(el, submit) {
        this.$el = el
        this.submit = submit;
        this.init();
    }
    init() {
        this.createDialog();
        this.$visibility = this.$el.style.visibility;
        this.$el.style.visibility = 'hidden';
    }
    createDialog() {
        this.$dialog = document.createElement('div');
        this.$dialog.setAttribute('id', 'dialog');
        this.$dialog.addEventListener('mouseleave', this.destory.bind(this));
        this.$dialog.style = `
        background: #fff;
        border-radius: 10px;
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
        font-size: larger;
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
            <h3></h3>
            <h3 style='letter-spacing: 3px;'>请输入密码</h3>
            <h3></h3>
        </ul>
        <ul>
            <input type="text">
        </ul>
        <ul>
            <button>cancel</button>
            <button>&nbsp;o&nbsp;&nbsp;k&nbsp;</button>
        </ul>`
        this.$el.parentNode.appendChild(this.$dialog);
        this.$input = this.$dialog.getElementsByTagName('input')[0];
        this.$cancel = this.$dialog.getElementsByTagName('button')[0];
        this.$ok = this.$dialog.getElementsByTagName('button')[1];
        let dialogUls = this.$dialog.querySelectorAll('ul');
        dialogUls.forEach(el=>{
            el.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 30%;
            width: 90%;`
        })
        this.$input.style = `
        height: 40px;
        border: none;
        outline: medium;
        font-size: large;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: transparent;
        width: 100%`;
        this.$input.type = 'password';
        this.$input.placeholder = '请输入密码'

        this.$cancel.style = `
        border: none;
        border-radius: 10px;
        background-color: transparent;
        font-size: larger;`
        this.$ok.style = `
        border: none;
        border-radius: 10px;
        background-color: transparent;
        font-size: larger;`

        this.$input.readOnly = true;
        this.$input.addEventListener('click', this.show.bind(this));
        this.$cancel.addEventListener('click', this.cancel.bind(this));
        this.$ok.addEventListener('click', this.ok.bind(this));
    }
    createKeyboard() {
        this.$keyboard = document.createElement('div');
        this.$keyboard.addEventListener('mouseleave', this.hidden.bind(this));
        this.$keyboard.setAttribute('id', 'keyboard');
        this.$dialog.appendChild(this.$keyboard);
        this.$keyboard.style = `
        left: 0;
        right: 0;
        bottom: 0;
        height: 250px;
        width: 100%;
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
        position: fixed;
        borderRadius: 5px;`
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
            height: 60px;`
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
            font-size: 28px;`
            values.push(el.innerHTML)
            el.addEventListener('click', this.edit.bind(this))
        })
    }
    edit(e) {
        if (e.target.innerHTML === 'X') {
            this.$input.value = this.$input.value.substring(0, this.$input.value.length - 1);
        } else if (e.target.innerHTML === 'OK') {
            // this.submit();   //safeKeyboard实例化时传入的方法;
            // console.log(this.$input.value);
            this.hidden();
        } else if (this.$input.value.length <= 8) {
            this.$input.value = this.$input.value + e.target.innerHTML;
        } else {
            console.warn("最长只能输入8位字符");
        }
    }
    cancel() {
        // console.log('cancel' + this.$input.value);
        this.destory();
    }
    ok() {
        // console.log('ok' + this.$input.value);
        this.submit();
        this.destory();
    }
    destory() {
        // console.log(this.$input.value);
        this.$dialog.remove();
        this.$el.style.visibility = this.$visibility;
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

export default Keyboard