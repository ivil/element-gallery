/**
 * @class 创建class对象
 */
class Slideshow {
    /**
     * @description 默认配置文件
     */
    #config = {
        imageWidth: 700,    //图片宽度
        imageHeight: 400,    //图片高度
        margin: '100px auto',//轮播图外边距
        speedTime: 1,     //图片移动时间
        timeInterval: 2,    //图片切换间隔
        direction: 'left',  //移动方向,默认向右移动，只要输入的不是left，一律向右移动
        transitionFunction: 'linear',  //移动过渡动画
    }
    /**
     * @description 一些全局变量
     */
    #slideshow;         //轮播图大盒子
    #container;         //放图片的盒子
    #poiner;            //装指示器的盒子
    #pointers = [];     //左右指示器
    #dot;               //装底部小圆点的盒子
    #dots = [];         //底部的小圆点
    #currentImg = 0;    //number类型，用于标记当前的图片;
    #timer;             //定时器
    /**
     * 
     * @param {string} el       将要挂载的元素id或者class
     * @param {Array} images    将要轮播的图片列表
     * @param {object} config   配置文件
     */
    constructor(el, images, config) {
        this.el = el;
        this.images = images;
        this.#config = config ? config : this.#config;
        this.init();
    }

    /**
     * @description 初始化
     */
    init() {
        this.createEl();
        this.createStyle();
        this.setEvent();
        if(this.#config.direction === 'left'){
            this.#timer = setInterval(this.moveLeft.bind(this), `${this.#config.timeInterval * 1000}`);
        }else{
            this.#timer = setInterval(this.moveRight.bind(this), `${this.#config.timeInterval * 1000}`);
        }
    }
    /**
     * @description 创建元素，此乃开天辟地之术
     */
    createEl() {
        // 获取将要挂载的元素节点
        this.#slideshow = document.querySelector(`${this.el}`);
        // 承载图片的大盒子
        this.#container = document.createElement('div');
        this.#container.setAttribute('id', 'container');
        this.#slideshow.appendChild(this.#container);
        // 生成三个盒子，左右两侧的盒子因溢出被隐藏了，只有中间那个显现出来，瞒天过海之术罢了；
        for (let i = 0; i < 3; i++) {
            let temporary = document.createElement('span');
            this.#container.appendChild(temporary);
            let temStyle = document.createAttribute('style');
            temStyle.value = `
            transition: all ${this.#config.speedTime}s ${this.#config.transitionFunction};
            display: inline-block;
            background-size: 100% 100%;
            position: absolute;
            background-image: url(./images/${i + 1}.png);
            margin-left: ${this.#config.imageWidth * i}px;
            width: ${this.#config.imageWidth}px;
            height: ${this.#config.imageHeight}px;`
            temporary.setAttributeNode(temStyle);
        }

        // 创建指示器
        this.#poiner = document.createElement('div');
        this.#slideshow.appendChild(this.#poiner);
        for (let i = 0; i < 2; i++) {
            this.#pointers[i] = document.createElement('span');
            this.#poiner.appendChild(this.#pointers[i]);
        }

        // 创建底部小点点
        this.#dot = document.createElement('ul');
        this.#slideshow.appendChild(this.#dot);
        for (let i = 0; i < this.images.length; i++) {
            this.#dots[i] = document.createElement('li');
            this.#dots[i].setAttribute('id', i);
            this.#dot.appendChild(this.#dots[i]);
        }
    }
    /**
     * @description 创建样式
     */
    createStyle() {
        // 轮播图大盒子样式，即挂载的那个元素样式
        let slideshowStyle = document.createAttribute('style');
        slideshowStyle.value = `
        width: ${this.#config.imageWidth}px;
        height: ${this.#config.imageHeight}px;
        overflow: hidden;
        position: relative;
        border-radius: 20px;
        border: 2px solid pink;
        margin: ${this.#config.margin};
        padding: 0;`
        this.#slideshow.setAttributeNode(slideshowStyle);
        // 承载图片的大盒子样式
        let containerStyle = document.createAttribute('style');
        containerStyle.value = `
        width: ${this.#config.imageWidth * 3}px;
        height: ${this.#config.imageHeight}px;
        position: relative;
        margin-left: ${0 - this.#config.imageWidth}px;` //左移一个盒子距离以使中间盒子与轮播图盒子相吻合
        this.#container.setAttributeNode(containerStyle);

        // 创建指示器样式;
        let pointerStyle = document.createAttribute('style');
        pointerStyle.value = `
        width: 100%;
        height: 50px;
        margin-top: ${0 - this.#config.imageHeight / 2 - 25}px;
        visibility: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;`
        this.#poiner.setAttributeNode(pointerStyle);
        for (let i = 0; i < 2; i++) {
            let pointersStyle = document.createAttribute('style');
            pointersStyle.value = `
            height: 49px;
            width: 49px;
            visibility: visible;
            background-size: 100% 100%;
            border-radius: 50%;`
            this.#pointers[i].setAttributeNode(pointersStyle);
        }
        this.#pointers[0].style.backgroundImage = `url(./images/双箭头左.png)`;
        this.#pointers[1].style.backgroundImage = `url(./images/双箭头右.png)`;

        // 创建底部小点点样式
        let dotStyle = document.createAttribute('style');
        dotStyle.value = `
        height: 30px;
        width: 100%;
        margin: 0;
        padding: 0;
        margin-top: -30px;
        justify-content: center;
        align-items: center;
        position: absolute;
        display: flex;`
        this.#dot.setAttributeNode(dotStyle);
        for (let i = 0; i < this.images.length; i++) {
            let dotsStyle = document.createAttribute('style');
            dotsStyle.value = `
            transition: all ${this.#config.speedTime}s ${this.#config.transitionFunction};
            width: 30px;
            height: 30px;
            margin-right: 7px;
            list-style: none;
            border-radius: 50%;
            background-image: url(./images/刻晴.png);
            background-size: 100% 100%;`
            this.#dots[i].setAttributeNode(dotsStyle);
        }
        this.#dots[0].style.backgroundImage = `url(./images/刻晴s.png)`;
    }
    /**
     * 此函数用于改变当前图片序号,并改变与之对应的小点点
     * @param {boolean} handle 将要进行的操作，false表示向左切换，true表示向右切换,改变并返回当前的图片序号
     */
    currentImgNum(handle) {
        if (handle === true) {
            this.#currentImg++;
            if (this.#currentImg >= this.images.length) {
                this.#currentImg = 0;
            }
        } else {
            this.#currentImg--;
            if (this.#currentImg < 0) {
                this.#currentImg = this.images.length - 1;
            }
        }
        return this.#currentImg;
    }
    /**
     * @description 设置事件
     */
    setEvent() {
        // 指示器点击事件
        this.#pointers[0].addEventListener('click', this.moveLeft.bind(this));
        this.#pointers[1].addEventListener('click', this.moveRight.bind(this));
        // 底部小圆点点击事件;
        for (let i = 0; i < this.images.length; i++) {
            this.#dots[i].addEventListener('click', this.dotClick.bind(this));
        }
        // 鼠标移出自动停止轮播
        this.#slideshow.addEventListener('mouseenter', this.mouseEnter.bind(this));
        // 鼠标移出自动轮播
        this.#slideshow.addEventListener('mouseleave', this.mouseLeave.bind(this));
    }
    /**
     * @description 通过湮灭左边盒子，移动中间盒子，生成右边盒子，来实现无缝左滑效果
     */
    moveLeft() {
        //底部小圆点同步变化
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴.png)`;
        let tmpNum = this.currentImgNum(false);
        this.#dots[tmpNum].style.backgroundImage = `url(./images/刻晴s.png)`;

        let temporary0 = document.querySelectorAll('#container span')[0];
        let temporary1 = document.querySelectorAll('#container span')[1];
        let temporary2 = document.querySelectorAll('#container span')[2];
        temporary0.remove();
        temporary1.style.marginLeft = `0px`;
        temporary2.style.marginLeft = `${this.#config.imageWidth}px`;
        let tmp = document.createElement('span');
        this.#container.appendChild(tmp);
        let temStyle = document.createAttribute('style');
        temStyle.value = `
        transition: all ${this.#config.speedTime}s ${this.#config.transitionFunction};
        display: inline-block;
        background-size: 100% 100%;
        position: absolute;
        background-image: url(./images/${tmpNum + 1}.png);
        margin-left: ${this.#config.imageWidth * 2}px;
        width: ${this.#config.imageWidth}px;
        height: ${this.#config.imageHeight}px;`
        tmp.setAttributeNode(temStyle);
        this.toURL();
    }
    /**
     * @description 通过湮灭右边盒子，移动中间盒子，生成左边盒子，来实现无缝右滑效果
     */
    moveRight() {
        //底部小圆点同步变化
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴.png)`;
        let tmpNum = this.currentImgNum(true);
        this.#dots[tmpNum].style.backgroundImage = `url(./images/刻晴s.png)`;

        let temporary0 = document.querySelectorAll('#container span')[0];
        let temporary1 = document.querySelectorAll('#container span')[1];
        let temporary2 = document.querySelectorAll('#container span')[2];
        temporary2.remove();
        temporary1.style.marginLeft = `${this.#config.imageWidth * 2}px`;
        temporary0.style.marginLeft = `${this.#config.imageWidth}px`;
        let tmp = document.createElement('span');
        temporary0 = document.querySelectorAll('#container span')[0];
        this.#container.insertBefore(tmp, temporary0);
        let temStyle = document.createAttribute('style');
        temStyle.value = `
        transition: all ${this.#config.speedTime}s ${this.#config.transitionFunction};
        display: inline-block;
        background-size: 100% 100%;
        position: absolute;
        background-image: url(./images/${tmpNum + 1}.png);
        margin-left: 0px;
        width: ${this.#config.imageWidth}px;
        height: ${this.#config.imageHeight}px;`
        tmp.setAttributeNode(temStyle);
        this.toURL();
    }
    /**
     * @description 底部小圆点的点击事件
     */
    dotClick(e) {
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴.png)`;
        this.#currentImg = Number(e.target.id);
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴s.png)`;
        let tmpList = [];
        for (let i = 0; i < 3; i++) {
            tmpList[i] = document.querySelectorAll('#container span')[i];
        }
        let tmpNum = this.#currentImg;
        if (tmpNum === 0) {
            tmpList[0].style.backgroundImage = `url(./images/${this.images.length}.png)`;
            tmpList[1].style.backgroundImage = `url(./images/${this.#currentImg + 1}.png)`;
            tmpList[2].style.backgroundImage = `url(./images/${this.#currentImg + 2}.png)`;
        } else if (tmpNum === this.images.length - 1) {
            tmpList[0].style.backgroundImage = `url(./images/${this.#currentImg}.png)`;
            tmpList[1].style.backgroundImage = `url(./images/${this.#currentImg + 1}.png)`;
            tmpList[2].style.backgroundImage = `url(./images/${0 + 1}.png)`;
        } else {
            tmpList[0].style.backgroundImage = `url(./images/${this.#currentImg}.png)`;
            tmpList[1].style.backgroundImage = `url(./images/${this.#currentImg + 1}.png)`;
            tmpList[2].style.backgroundImage = `url(./images/${this.#currentImg + 2}.png)`;
        }
        this.toURL();
    }
    /**
     * @description 鼠标进入离开事件
     */
    mouseEnter() {
        clearInterval(this.#timer);
    }
    mouseLeave() {
        this.#timer = setInterval(this.moveRight.bind(this), `${this.#config.timeInterval * 1000}`);
    }
    /**
     * @description 跳转事件
     */
    toURL(){
        let tmpurl = document.querySelectorAll('#container span')[1];
        tmpurl.addEventListener('click',()=>{
            window.open(this.images[this.#currentImg].url);
        })
    }
}