var Slideshow = /** @class */ (function () {
    function Slideshow(el, config, imgs) {
        this.$config = {
            width: 700,
            height: 400,
            speedTime: 1,
            timeInterval: 2,
            direction: 'left'
        };
        this.$avators = [
            {
                path: './imgs/恶猫.jpg'
            },
            {
                path: './imgs/栗花落香奈乎v.jpg'
            },
        ];
        this.$limitClick = true;
        this.$currentImg = 0;
        if (typeof (el) === "object") {
            this.$el = el;
        }
        else {
            throw new Error('找不到挂载点！！！');
        }
        if (!imgs) {
            throw new Error("未放置图片！！！");
        }
        else {
            this.$imgs = imgs || this.$imgs;
            this.$len = Number(this.$imgs.length) - 1;
        }
        this.$config = config || this.$config;
        this.init();
    }
    Slideshow.prototype.init = function () {
        var _this = this;
        var elStyle = "\n        background-color: whitesmoke;\n        height:".concat(this.$config.height, "px;\n        width:").concat(this.$config.width, "px;\n        overflow: hidden;\n        position: relative;");
        this.$el.setAttribute('style', elStyle);
        this.$el.addEventListener('mouseenter', function () {
            clearInterval(_this.$timer);
        });
        this.$el.addEventListener('mouseleave', function () {
            _this.changeAuto(_this.$config.direction);
        });
        this.createSlideshow();
        this.changeAuto(this.$config.direction);
    };
    Slideshow.prototype.pointerClick = function (option) {
        var _this = this;
        if (this.$limitClick) {
            this.$limitClick = false;
            this.changeImg(option);
            setTimeout(function () {
                _this.$limitClick = true;
            }, this.$config.speedTime * 1000);
        }
        else {
            console.warn('请不要重复点击！！！');
        }
    };
    Slideshow.prototype.dotClick = function (index) {
        var oldImg = this.$currentImg;
        var oldDot = document.querySelector('#dot').children[oldImg];
        oldDot.style.backgroundImage = "url(".concat(this.$avators[0].path, ")");
        this.$currentImg = index;
        var vectors = document.querySelectorAll('#box div');
        vectors[1].style.backgroundImage = "url(".concat(this.$imgs[this.$currentImg].path, ")");
        if (this.$currentImg === 0) {
            vectors[0].style.backgroundImage = "url(".concat(this.$imgs[this.$len].path, ")");
            vectors[2].style.backgroundImage = "url(".concat(this.$imgs[this.$currentImg + 1].path, ")");
        }
        else if (this.$currentImg === this.$len) {
            vectors[0].style.backgroundImage = "url(".concat(this.$imgs[this.$currentImg - 1].path, ")");
            vectors[2].style.backgroundImage = "url(".concat(this.$imgs[0].path, ")");
        }
        else {
            vectors[0].style.backgroundImage = "url(".concat(this.$imgs[this.$currentImg - 1].path, ")");
            vectors[2].style.backgroundImage = "url(".concat(this.$imgs[this.$currentImg + 1].path, ")");
        }
        var newDot = document.querySelector('#dot').children[this.$currentImg];
        newDot.style.backgroundImage = "url(".concat(this.$avators[1].path, ")");
    };
    Slideshow.prototype.changeImg = function (direction) {
        var _this = this;
        var oldImg = this.$currentImg;
        var oldDot = document.querySelector('#dot').children[oldImg];
        oldDot.style.backgroundImage = "url(".concat(this.$avators[0].path, ")");
        if (direction) {
            this.$currentImg--;
            if (this.$currentImg < 0) {
                this.$currentImg = this.$len;
            }
            var vectors_1 = document.querySelectorAll('#box div');
            var newNode = vectors_1[2].cloneNode(true);
            newNode.style.left = '0px';
            if (this.$currentImg === 0) {
                newNode.style.backgroundImage = "url(".concat(this.$imgs[this.$len].path, ")");
            }
            else {
                newNode.style.backgroundImage = "url(".concat(this.$imgs[this.$currentImg - 1].path, ")");
            }
            vectors_1[2].remove();
            vectors_1[1].style.left = "".concat(this.$config.width * 2, "px");
            vectors_1[0].style.left = "".concat(this.$config.width, "px");
            document.querySelector('#box').insertBefore(newNode, vectors_1[0]);
        }
        else {
            this.$currentImg++;
            if (this.$currentImg === this.$len + 1) {
                this.$currentImg = 0;
            }
            var vectors_2 = document.querySelectorAll('#box div');
            var newNode = vectors_2[2].cloneNode(true);
            if (this.$currentImg === this.$len) {
                newNode.style.backgroundImage = "url(".concat(this.$imgs[0].path, ")");
            }
            else {
                newNode.style.backgroundImage = "url(".concat(this.$imgs[this.$currentImg + 1].path, ")");
            }
            vectors_2[0].remove();
            vectors_2[1].style.left = "0px";
            vectors_2[2].style.left = "".concat(this.$config.width, "px");
            document.querySelector('#box').appendChild(newNode);
        }
        var newDot = document.querySelector('#dot').children[this.$currentImg];
        newDot.style.backgroundImage = "url(".concat(this.$avators[1].path, ")");
        // 同步更改当前图片标题和跳转URL；
        var currentTitle = document.querySelector('#title p');
        currentTitle.innerHTML = this.$imgs[this.$currentImg].title;
        var vectors = document.querySelectorAll('#box div');
        vectors[1].addEventListener('click', function () {
            window.open(_this.$imgs[_this.$currentImg].url);
        });
    };
    Slideshow.prototype.changeAuto = function (direction) {
        var _this = this;
        var type = direction === 'left' ? false : true;
        this.$timer = setInterval(function () {
            _this.changeImg(type);
        }, this.$config.timeInterval * 1000);
    };
    Slideshow.prototype.createSlideshow = function () {
        var flex = "\n        display: flex;\n        justify-content: center;\n        align-items: center;";
        this.$el.innerHTML = "\n            <div id=\"box\">\n                <div></div>\n                <div></div>\n                <div></div>\n            </div>\n            <div id=\"title\">\n                <p></p>\n            </div>\n            <div id=\"pointer\">\n                <span>\u300A--</span>\n                <span>--\u300B</span>\n            </div>\n            <div id=\"dot\"></div>";
        var els = this.$el.children;
        var boxStyle = "\n        width:300%;\n        background-color:whitesmoke;\n        left:".concat(-this.$config.width, "px;\n        height:100%;\n        position:relative;");
        // 图片载体
        els[0].setAttribute('style', boxStyle);
        var vectors = els[0].children;
        var vectorStyle = "\n        height:100%;\n        width:".concat(this.$config.width, "px;\n        left:0px;\n        background-image: url(").concat(this.$imgs[this.$len].path, ");\n        background-size: 100% 100%;\n        transition: all ").concat(this.$config.speedTime, "s linear;\n        background-color:whitesmoke;\n        position:absolute;");
        vectors[0].setAttribute('style', vectorStyle);
        vectors[1].setAttribute('style', "\n        ".concat(vectorStyle, "\n        background-image: url(").concat(this.$imgs[this.$currentImg].path, ");\n        left:").concat(this.$config.width, "px;"));
        vectors[2].setAttribute('style', "\n        ".concat(vectorStyle, "\n        background-image: url(").concat(this.$imgs[this.$currentImg + 1].path, ");\n        left:").concat(this.$config.width * 2, "px;"));
        var titleStyle = "\n        width:100%;\n        height50px;\n        top:0;\n        ".concat(flex, "\n        visibility: hidden;\n        position:absolute;");
        // 标题
        els[1].setAttribute('style', titleStyle);
        var title = document.querySelector('#title p');
        title.setAttribute('style', 'visibility: visible;');
        // 指示器
        els[2].setAttribute('style', "\n        height:50px;\n        width:100%;\n        top:40%;\n        visibility: hidden;\n        ".concat(flex, "\n        justify-content: space-between;\n        position:absolute;"));
        var pointerStyle = "\n        border-radius: 50%;\n        height:50px;\n        width:50px;\n        visibility: visible;\n        border: 1px solid black;\n        ".concat(flex);
        var pointers = document.querySelectorAll('#pointer span');
        pointers[0].setAttribute('style', pointerStyle);
        pointers[0].addEventListener('click', this.pointerClick.bind(this, false));
        pointers[1].setAttribute('style', pointerStyle);
        pointers[1].addEventListener('click', this.pointerClick.bind(this, true));
        // 底部
        els[3].setAttribute('style', "\n        height:50px;\n        width:100%;\n        ".concat(flex, "\n        bottom:0px;\n        visibility: hidden;\n        position:absolute;"));
        for (var i = 0; i <= this.$len; i++) {
            var dot = document.createElement('span');
            dot.setAttribute('style', "\n            width:30px;\n            height:30px;\n            margin-right:5px;\n            border:1px solid black;\n            visibility: visible;\n            background-image: url(".concat(this.$avators[0].path, ");\n            background-size: 100% 100%;\n            border-radius:50%;"));
            dot.addEventListener('click', this.dotClick.bind(this, i));
            els[3].appendChild(dot);
        }
        var dots = document.querySelector('#dot').children;
        var currentDot = dots[this.$currentImg];
        currentDot.style.backgroundImage = "url(".concat(this.$avators[1].path, ")");
    };
    return Slideshow;
}());
