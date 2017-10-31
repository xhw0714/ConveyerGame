// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        //存放捡起的瓶子
        _this.pickupBottle = null;
        //存放已经捡起的瓶子
        _this.selBottle = null;
        _this.isPaused = true;
        //记录上一次时间
        _this.lasttime = 0;
        //瓶子出生时间
        _this.birthrime = 0;
        //监听游戏分数
        _this._score = 0;
        //场景文件为gameskin.exml
        _this.skinName = "resource/skins/GameSkin.exml";
        //设置定时器
        egret.startTick(_this.onUpdate, _this);
        //拖拽事件使用的瓶子，在页面上放一个隐藏的瓶子
        _this.addChild(_this.pickupBottle = new Bottle(1));
        _this.pickupBottle.visible = false;
        //设置捡起的瓶子样式
        _this.pickupBottle.anchorOffsetX = 25 / 2; //修改捡起瓶子的锚点，使其相对于设置的X轴Y轴左移上移一半的像素，即居中的位置
        _this.pickupBottle.anchorOffsetY = 90 / 2;
        _this.pickupBottle.scaleX = _this.pickupBottle.scaleY = 2; //放大瓶子为2倍
        //绑定瓶子拖拽事件
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.ontouch_begin, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.ontouch_move, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_END, _this.ontouch_end, _this);
        //重玩按钮
        _this.Restart.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onclickReStart, _this);
        //回到菜单按钮
        _this.BackMenu.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.MainMenu, _this);
        return _this;
    }
    Game.getInstance = function () {
        if (Game._instance == null) {
            Game._instance = new Game();
        }
        return Game._instance;
    };
    Game.prototype.onUpdate = function (timestamp) {
        //计算时间差，除以1000换算秒
        var dt = (timestamp - this.lasttime) / 1000;
        //把上一次的时间变成现在的时间
        this.lasttime = timestamp;
        //如果游戏结束界面显示了，就停止定时器
        if (this.isPaused) {
            return false;
        }
        //出生时间加上时间差
        this.birthrime += dt;
        //如果时间超过一秒钟
        if (this.birthrime > 1.5) {
            //把值变成0
            this.birthrime = 0;
            //产生一个瓶子，调用瓶子类，穿进去的值为枚举BottleType的随机数，即随机生成瓶子
            var bottle = new Bottle(Math.floor(Math.random() * 6 + 1));
            //改变瓶子的X轴，在传送带内随机位置生成
            bottle.x = Math.random() * this.gp_conveyor.width;
            //添加在传送带
            this.gp_conveyor.addChild(bottle);
        }
        //循环遍历传送带里面的瓶子
        for (var i = this.gp_conveyor.numChildren - 1; i >= 0; i--) {
            //获取每个瓶子
            var element = this.gp_conveyor.getChildAt(i);
            //瓶子移动，改变Y轴为时间差乘以速度。
            element.y += dt * 100;
            //如果瓶子超出了传送带的范围，就移除瓶子
            if (element.y > this.gp_conveyor.height) {
                this.gp_conveyor.removeChild(element);
                //游戏结束
                this.GameOver();
            }
        }
        //传送带动画处理
        this.ConveyorPlay.anchorOffsetY -= dt * 100;
        if (this.ConveyorPlay.anchorOffsetY <= -56) {
            this.ConveyorPlay.anchorOffsetY = 0;
        }
        return false;
    };
    //拖拽事件
    Game.prototype.ontouch_begin = function (e) {
        //获取点击时的X轴和Y轴，因为瓶子的坐标是相对于传送带的，所以要减去传送带的X轴Y轴。。Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
        var pt1 = new egret.Point(e.stageX - this.gp_conveyor.x, e.stageY - this.gp_conveyor.y);
        //循环遍历每个瓶子
        for (var i = this.gp_conveyor.numChildren - 1; i >= 0; i--) {
            //获取每个瓶子
            var element = this.gp_conveyor.getChildAt(i);
            //设置一个矩形点，点的大小坐标等于瓶子的坐标和大小。
            var rect = new egret.Rectangle(element.x, element.y, element.width, element.height);
            //判断矩形区域内是否包含指定的点，即判断点击的是否是上面设置的瓶子的坐标。即用pt1的坐标是否包含在rect的矩形内
            if (rect.containsPoint(pt1)) {
                //是选择属性触发
                element.IsSelected = true;
                //被选中的瓶子变为当前的瓶子
                this.selBottle = element;
                this.pickupBottle.BottleType = this.selBottle.BottleType;
                this.pickupBottle.x = e.stageX;
                this.pickupBottle.y = e.stageY;
                this.pickupBottle.visible = true;
            }
        }
    };
    //移动事件
    Game.prototype.ontouch_move = function (e) {
        //如果没有选中的瓶子就跳出
        if (this.selBottle == null) {
            return;
        }
        ;
        this.pickupBottle.x = e.stageX;
        this.pickupBottle.y = e.stageY;
    };
    //触碰结束事件
    Game.prototype.ontouch_end = function (e) {
        //如果有选中的瓶子，则将该瓶子的选中属性取消
        if (this.selBottle != null) {
            this.selBottle.IsSelected = false;
        }
        if (!this.pickupBottle.visible)
            return;
        //隐藏捡起的瓶子
        this.pickupBottle.visible = false;
        //取得鼠标抬起时的坐标点
        var checkpt = new egret.Point(e.stageX - this.Packages.x, e.stageY - this.Packages.y);
        //循环遍历所有的箱子
        for (var i = 0; i < this.Packages.numChildren; i++) {
            //获得当前箱子
            var Pack = this.Packages.getChildAt(i);
            if (Pack.isPacking) {
                continue;
            }
            //获取箱子的位置
            var rect = new egret.Rectangle(Pack.x, Pack.y, Pack.width, Pack.height);
            //判断鼠标抬起时的坐标在不在箱子的方位，并且判断箱子的类型等不等于瓶子的类型
            //特地说明，瓶子的BottleType用[1,2,3,4,5,6]存放，箱子也一样
            if (rect.containsPoint(checkpt)) {
                console.log(1);
                if (Pack.Pos == this.pickupBottle.BottleType) {
                    if (!Pack.addBottle(this.pickupBottle)) {
                        this.score += 5;
                    }
                    ; //如果类型相同则放入瓶子
                    this.score += 1;
                    this.gp_conveyor.removeChild(this.selBottle); //移除瓶子
                    break;
                }
                else {
                    this.GameOver();
                }
            }
        }
    };
    //游戏结束
    Game.prototype.GameOver = function () {
        this.GameOverGP.visible = true;
        //循环遍历界面的元素，添加动画
        for (var i = 0; i < this.GameOverGP.numChildren; i++) {
            var item = this.GameOverGP.getChildAt(i);
            item.alpha = 0;
            egret.Tween.get(item).wait(i * 200).to({ "alpha": 1 }, 500);
        }
        this.isPaused = true;
    };
    Object.defineProperty(Game.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (v) {
            this._score = v;
            this.OverScore.text = this.GameScore.text = v.toString();
        },
        enumerable: true,
        configurable: true
    });
    //游戏重玩
    Game.prototype.onclickReStart = function () {
        this.score = 0;
        this.GameOverGP.visible = false;
        this.isPaused = false;
        this.gp_conveyor.removeChildren();
        for (var i = 0; i < this.Packages.numChildren; i++) {
            //获得当前箱子
            var Pack = this.Packages.getChildAt(i);
            Pack.clearBottle();
        }
        //循环遍历界面的元素，添加动画
        for (var i = 0; i < this.Packages.numChildren; i++) {
            var item = this.Packages.getChildAt(i);
            item.anchorOffsetY = -800;
            egret.Tween.get(item).wait(i * 200).to({ "anchorOffsetY": 0 }, 500);
        }
    };
    //同开始页面切换原理
    Game.prototype.MainMenu = function () {
        this.parent.addChild(SrartGame.getInstance());
        this.parent.removeChild(this);
    };
    return Game;
}(eui.Component));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map