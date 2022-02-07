/**
 * @class 创建slideshow对象
 */
class Slideshow {
    // 默认配置文件
    #config = {
        imageWidth: 700,                    //图片宽度
        imageHeight: 400,                   //图片高度
        speedTime: 2000,                     //图片移动速度
        margin: '100px auto',
        timeInterval: 2,                    //图片切换间隔
        direction: 'left',                  //移动方向
        transitionFunction: 'ease-in-out',  //移动过渡动画
    }

    #container;       //轮播图大盒子
    #pointer;         //装指示器的盒子
    #pointers = [];   //两侧的指示器
    #dot;             //装小圆点的盒子
    #dots = [];       //底部的小圆点
    #currentImg = 0;       //number类型，用于标记当前的图片；
    #timer                  //定时器
    
    /**
     * @param {string} el       要挂载的元素id
     * @param {Array} images    轮播图片列表
     * @param {object} config   配置文件
     */
    constructor(el, images, config) {
        this.el = el;
        this.images = images;
        this.#config = config ? config : this.#config;
        this.init();
    }
    /**
     * @description 初始化。函数声明和类声明之间的一个重要区别在于, 函数声明会提升，类声明不会。
     *              函数和变量相比，会被优先提升。这意味着函数会被提升到更靠前的位置。
     */
    init() {
        this.createEl();
        this.createStyle();
        this.setImgs();
        this.setEvent();
        this.#timer = setInterval(this.autoChange.bind(this),this.#config.speedTime);
    }
    /**
     * @description 创建元素节点
     */
    createEl() {
        // 获取将要挂载的元素（#slideshow）
        this.#container = document.querySelector(this.el);

        // 创建两侧指示器节点
        this.#pointer = document.createElement('div');
        this.#container.appendChild(this.#pointer);
        for (let i = 0; i < 2; i++) {
            this.#pointers[i] = document.createElement('span');
            this.#pointer.appendChild(this.#pointers[i]);
        }

        // 创建底部小点点
        this.#dot = document.createElement('div');
        this.#container.appendChild(this.#dot);
        for (let j = 0; j < this.images.length; j++) {
            this.#dots[j] = document.createElement('span');
            this.#dots[j].setAttribute('id',j);
            this.#dot.appendChild(this.#dots[j]);
        }
    }
    /**
     * @description 创建属性节点
     */
    createStyle() {
        // 轮播图大盒子样式
        let containerStyle = document.createAttribute('style');
        containerStyle.value = `
        width: ${this.#config.imageWidth}px;
        max-width: ${this.#config.imageWidth}px;
        height: ${this.#config.imageHeight}px;
        max-height: ${this.#config.imageHeight}px;
        border-radius: 20px;
        border: 2px solid pink;
        background-size: 100% 100%;
        margin: ${this.#config.margin};
        transition: 1s linear;
        position: relative;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: end;`
        this.#container.setAttributeNode(containerStyle);

        // 指示器盒子样式
        let pointerStyle = document.createAttribute('style');
        pointerStyle.value = `
        border: 2px solid pink;
        width: -moz-calc(100% - 4px);
        width: -webkit-calc(100% - 4px);
        width: calc(100% - 4px);
        height: 50px;
        visibility: hidden;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;`
        this.#pointer.setAttributeNode(pointerStyle);
        // 指示器内部样式
        let indicatorStyle = document.createAttribute('style');
        indicatorStyle.value = `
        border-radius: 50%;
        visibility: visible;
        background-size: 100% 100%;
        background-color: transition;
        width: 49px;
        height: 49px;`
        this.#pointers[0].setAttributeNode(indicatorStyle);
        this.#pointers[0].style.backgroundImage = `url(./images/双箭头左.png)`;
        // 属性节点好像不能共用，报错说要克隆，于是又重新创建了个属性节点，值拷贝了过去；哭唧唧（T_T）
        let indicatorStyle2 = document.createAttribute('style');
        indicatorStyle2.value = indicatorStyle.value;
        this.#pointers[1].setAttributeNode(indicatorStyle2);
        this.#pointers[1].style.backgroundImage = `url(./images/双箭头右.png)`;

        // 底部小点点盒子样式
        let dotStyle = document.createAttribute('style');
        dotStyle.value = `
        border: 2px solid pink;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        visibility: hidden;
        width: -moz-calc(100% - 4px);
        width: -web-kit-calc(100% - 4px);
        width: calc(100% - 4px);
        height: 30px;`
        this.#dot.setAttributeNode(dotStyle);
        // 小点点的样式
        for (let i = 0; i < this.images.length; i++) {
            let dotsStyle = document.createAttribute('style');
            dotsStyle.value = `
            border: 1px solid pink;
            border-radius: 50%;
            visibility: visible;
            background-size: 100% 100%;
            background-image: url(./images/刻晴.png);
            width: 25px;
            height: 25px;
            margin-right: 5px;`
            this.#dots[i].setAttributeNode(dotsStyle);
        }

    }
    /**
     * @description 载入图片
     */
    setImgs() {
        this.#container.style.backgroundImage = `url(${this.images[this.#currentImg].path})`;
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴s.png)`;
    }
    /**
     * 此函数用于改变当前图片序号,并改变与之对应的小点点
     * @param {boolean} handle 将要进行的操作，false表示向左切换，true表示向右切换
     */
    currentImgNum(handle) {
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴.png)`;
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
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴s.png)`;
    }
    /**
     * @description 给各个节点设置事件
     */
    setEvent() {
        // 左指示器点击事件
        this.#pointers[0].addEventListener('click', this.pointerLclick.bind(this));
        // 右指示器点击事件
        this.#pointers[1].addEventListener('click', this.pointerRclick.bind(this));
        //底部的小圆点点击事件
        for (let i = 0; i < this.images.length; i++) {
            // 底部的小圆点点击事件
            this.#dots[i].addEventListener('click', this.dotClick.bind(this));
        }
        // 鼠标移入事件
        this.#container.addEventListener('mouseenter',this.mouseEnter.bind(this));
        // 鼠标移出事件
        this.#container.addEventListener('mouseleave',this.mouseLeave.bind(this));
    }
    /**
     * @description 一系列事件
     */
    // 指示器点击事件
    pointerLclick() {
        this.currentImgNum(false);
        this.#container.style.backgroundImage = `url(${this.images[this.#currentImg].path})`;
    }
    pointerRclick() {
        this.currentImgNum(true);
        this.#container.style.backgroundImage = `url(${this.images[this.#currentImg].path})`;
    }
    // 底部的小圆点点击事件,点击事件可以传递一个event对象
    dotClick(e){
        // 切换底部图标；
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴.png)`;
        this.#currentImg = e.target.id;
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴s.png)`;
        // 切换与之对应的图片；
        this.#container.style.backgroundImage = `url(${this.images[this.#currentImg].path})`;
    }
    // 用移入移出事件好像有泡泡，会被触发多次，所以换成enter和leave事件了 (T_T)
    // 鼠标进入事件
    mouseEnter(){
        this.#pointers[0].style.visibility = 'visible';
        this.#pointers[1].style.visibility = 'visible';
        clearInterval(this.#timer);
    }
    // 鼠标离开事件
    mouseLeave(){
        this.#pointers[0].style.visibility = 'hidden';
        this.#pointers[1].style.visibility = 'hidden';
        this.#timer = setInterval(this.autoChange.bind(this),this.#config.speedTime);
    }
    // 定时器
    autoChange(){
        // 复位底部图片
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴.png)`;
        this.currentImgNum(true);
        // 切换底部图标
        this.#dots[this.#currentImg].style.backgroundImage = `url(./images/刻晴s.png)`;
        // 切换与之对应的图片
        this.#container.style.backgroundImage = `url(${this.images[this.#currentImg].path})`;
    }
}
