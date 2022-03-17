type config = {
    width: number,
    height: number,
    speedTime: number,
    timeInterval: number,
    direction: string,
}
interface img {
    path: string,
    url: string,
    title: string
}

interface imgs {
    [img: string]: img
}
class Slideshow {
    $el: HTMLElement         //要挂载的元素
    $config = {
        width: 700,    //图片宽度
        height: 400,    //图片高度
        speedTime: 1,     //图片移动时间
        timeInterval: 2,    //图片切换间隔
        direction: 'left',  //移动方向,默认向右移动，只要输入的不是left，一律向右移动
    }
    $imgs: imgs
    $avators = [
        {
            path: './imgs/恶猫.jpg',
        },
        {
            path: './imgs/栗花落香奈乎v.jpg',
        },
    ]
    $len: number
    $timer: any
    $limitClick = true;
    $currentImg = 0;
    constructor(el: HTMLElement, config: config, imgs: imgs) {
        if (typeof (el) === "object") {
            this.$el = el
        } else {
            throw new Error('找不到挂载点！！！')
        }
        if (!imgs) {
            throw new Error("未放置图片！！！")
        } else {
            this.$imgs = imgs || this.$imgs;
            this.$len = Number(this.$imgs.length) - 1;
        }
        this.$config = config || this.$config;
        this.init();
        console.log(this.$imgs.length);
    }
    init() {
        let elStyle = `
        background-color: whitesmoke;
        height:${this.$config.height}px;
        width:${this.$config.width}px;
        overflow: hidden;
        position: relative;`
        this.$el.setAttribute('style', elStyle);
        this.$el.addEventListener('mouseenter', () => {
            clearInterval(this.$timer);
        })
        this.$el.addEventListener('mouseleave', () => {
            this.changeAuto(this.$config.direction);
        })
        this.createSlideshow();
        this.changeAuto(this.$config.direction);
    }
    slideLeft() {
        if (this.$limitClick) {
            this.$limitClick = false;
            this.changeImg(false);
            setTimeout(() => {
                this.$limitClick = true;
            }, 1500)
        } else {
            console.warn('请不要重复点击！！！');
        }
    }
    slieRight() {
        if (this.$limitClick) {
            this.$limitClick = false;
            this.changeImg(true);
            setTimeout(() => {
                this.$limitClick = true;
            }, 1500)
        } else {
            console.warn('请不要重复点击！！！');
        }
    }
    dotClick(index) {
        console.log(index);
        let oldImg = this.$currentImg;
        let oldDot = document.querySelector('#dot').children[oldImg] as HTMLElement;
        oldDot.style.backgroundImage = `url(${this.$avators[0].path})`
        this.$currentImg = index;
        let vectors = document.querySelectorAll('#box div') as NodeListOf<HTMLElement>;
        vectors[1].style.backgroundImage = `url(${this.$imgs[this.$currentImg].path})`;
        if (this.$currentImg === 0) {
            vectors[0].style.backgroundImage = `url(${this.$imgs[this.$len].path})`;
            vectors[2].style.backgroundImage = `url(${this.$imgs[this.$currentImg + 1].path})`;
        } else if (this.$currentImg === this.$len) {
            vectors[0].style.backgroundImage = `url(${this.$imgs[this.$currentImg - 1].path})`;
            vectors[2].style.backgroundImage = `url(${this.$imgs[0].path})`;
        } else {
            vectors[0].style.backgroundImage = `url(${this.$imgs[this.$currentImg - 1].path})`;
            vectors[2].style.backgroundImage = `url(${this.$imgs[this.$currentImg + 1].path})`;
        }
        let newDot = document.querySelector('#dot').children[this.$currentImg] as HTMLElement;
        newDot.style.backgroundImage = `url(${this.$avators[1].path})`
    }
    createSlideshow() {
        let flex = `
        display: flex;
        justify-content: center;
        align-items: center;`
        this.$el.innerHTML = `
            <div id="box">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div id="title">
                <p>ixxl * 1001 times</p>
            </div>
            <div id="pointer">
                <span>《--</span>
                <span>--》</span>
            </div>
            <div id="dot"></div>`;
        let els = this.$el.children;
        let boxStyle = `
        width:300%;
        background-color:whitesmoke;
        left:${-this.$config.width}px;
        height:100%;
        position:relative;`
        // 图片载体
        els[0].setAttribute('style', boxStyle);
        let vectors = els[0].children;
        let vectorStyle = `
        height:100%;
        width:${this.$config.width}px;
        left:0px;
        background-image: url(${this.$imgs[this.$len].path});
        background-size: 100% 100%;
        transition: all ${this.$config.speedTime}s linear;
        background-color:whitesmoke;
        position:absolute;`
        vectors[0].setAttribute('style', vectorStyle);
        vectors[1].setAttribute('style', `
        ${vectorStyle}
        background-image: url(${this.$imgs[this.$currentImg].path});
        left:${this.$config.width}px;`);
        vectors[2].setAttribute('style', `
        ${vectorStyle}
        background-image: url(${this.$imgs[this.$currentImg + 1].path});
        left:${this.$config.width * 2}px;`);
        let titleStyle = `
        width:100%;
        height50px;
        top:0;
        ${flex}
        visibility: hidden;
        position:absolute;`
        // 标题
        els[1].setAttribute('style', titleStyle);
        let title = document.querySelector('#title p');
        title.setAttribute('style', 'visibility: visible;');
        // 指示器
        els[2].setAttribute('style', `
        height:50px;
        width:100%;
        top:40%;
        visibility: hidden;
        ${flex}
        justify-content: space-between;
        position:absolute;`)
        let pointerStyle = `
        border-radius: 50%;
        height:50px;
        width:50px;
        visibility: visible;
        border: 1px solid black;
        ${flex}`
        let pointers = document.querySelectorAll('#pointer span');
        pointers[0].setAttribute('style', pointerStyle);
        pointers[0].addEventListener('click', this.slideLeft.bind(this))
        pointers[1].setAttribute('style', pointerStyle);
        pointers[1].addEventListener('click', this.slieRight.bind(this))
        // 底部
        els[3].setAttribute('style', `
        height:50px;
        width:100%;
        ${flex}
        bottom:0px;
        visibility: hidden;
        position:absolute;`);
        for (let i = 0; i <= this.$len; i++) {
            let dot = document.createElement('span');
            dot.setAttribute('style', `
            width:30px;
            height:30px;
            margin-right:5px;
            border:1px solid black;
            visibility: visible;
            background-image: url(${this.$avators[0].path});
            background-size: 100% 100%;
            border-radius:50%;`);
            dot.addEventListener('click', this.dotClick.bind(this, i));
            els[3].appendChild(dot);
        }
        let dots = document.querySelector('#dot').children;
        let currentDot = dots[this.$currentImg] as HTMLElement;
        currentDot.style.backgroundImage = `url(${this.$avators[1].path})`
    }
    changeImg(direction: boolean) {
        let oldImg = this.$currentImg;
        let oldDot = document.querySelector('#dot').children[oldImg] as HTMLElement;
        oldDot.style.backgroundImage = `url(${this.$avators[0].path})`
        if (direction) {
            this.$currentImg--;
            if (this.$currentImg < 0) {
                this.$currentImg = this.$len;
            }
            let vectors = document.querySelectorAll('#box div') as NodeListOf<HTMLElement>;
            let newNode = vectors[2].cloneNode(true) as HTMLElement;
            newNode.style.left = '0px';
            if (this.$currentImg === 0) {
                newNode.style.backgroundImage = `url(${this.$imgs[this.$len].path})`
            } else {
                newNode.style.backgroundImage = `url(${this.$imgs[this.$currentImg - 1].path})`
            }
            vectors[2].remove();
            vectors[1].style.left = `${this.$config.width * 2}px`;
            vectors[0].style.left = `${this.$config.width}px`;
            document.querySelector('#box').insertBefore(newNode, vectors[0]);
        } else {
            this.$currentImg++;
            if (this.$currentImg === this.$len + 1) {
                this.$currentImg = 0;
            }
            let vectors = document.querySelectorAll('#box div') as NodeListOf<HTMLElement>;
            let newNode = vectors[2].cloneNode(true) as HTMLElement;
            if (this.$currentImg === this.$len) {
                newNode.style.backgroundImage = `url(${this.$imgs[0].path})`
            } else {
                newNode.style.backgroundImage = `url(${this.$imgs[this.$currentImg + 1].path})`
            }
            vectors[0].remove();
            vectors[1].style.left = `0px`;
            vectors[2].style.left = `${this.$config.width}px`;
            document.querySelector('#box').appendChild(newNode);
        }
        let newDot = document.querySelector('#dot').children[this.$currentImg] as HTMLElement;
        newDot.style.backgroundImage = `url(${this.$avators[1].path})`
    }
    changeAuto(direction: string) {
        let type: boolean = direction === 'left' ? false : true;
        this.$timer = setInterval(() => {
            this.changeImg(type);
        }, this.$config.timeInterval * 1000);
    }
}
