// TypeScript file

class Game extends eui.Component {
    //设置暴露在外的接口
    private static _instance: Game;
    public static getInstance() {
        if (Game._instance == null) {
            Game._instance = new Game();
        }
        return Game._instance;
    }

    //传送带
    public gp_conveyor: eui.Group;

    //结束界面
    public GameOverGP: eui.Group;
    //结束分数控件
    public OverScore: eui.Label;
    //游戏分数
    public GameScore: eui.Label;
    //重新开始按钮
    public Restart: eui.Button;
    //回到菜单按钮
    public BackMenu: eui.Button;
    //传送带动画
    public ConveyorPlay: eui.Group;




    //存放捡起的瓶子
    private pickupBottle: Bottle = null;
    //存放已经捡起的瓶子
    private selBottle: Bottle = null;

    //获取箱子
    private Packages: eui.Group;

    public constructor() {
        super();

        //场景文件为gameskin.exml
        this.skinName = "resource/skins/GameSkin.exml";
        //设置定时器
        egret.startTick(this.onUpdate, this);
        //拖拽事件使用的瓶子，在页面上放一个隐藏的瓶子
        this.addChild(this.pickupBottle = new Bottle(1))
        this.pickupBottle.visible = false;
        //设置捡起的瓶子样式
        this.pickupBottle.anchorOffsetX = 25 / 2;//修改捡起瓶子的锚点，使其相对于设置的X轴Y轴左移上移一半的像素，即居中的位置
        this.pickupBottle.anchorOffsetY = 90 / 2;
        this.pickupBottle.scaleX = this.pickupBottle.scaleY = 2;//放大瓶子为2倍

        //绑定瓶子拖拽事件
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.ontouch_begin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouch_move, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.ontouch_end, this);
        //重玩按钮
        this.Restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclickReStart, this);
        //回到菜单按钮
        this.BackMenu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MainMenu, this);


    }
    private isPaused: boolean = true;

    //记录上一次时间
    private lasttime: number = 0;
    //瓶子出生时间
    private birthrime: number = 0;
    private onUpdate(timestamp: number): boolean {
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
            var bottle = new Bottle(<BottleType>Math.floor(Math.random() * 6 + 1));
            //改变瓶子的X轴，在传送带内随机位置生成
            bottle.x = Math.random() * this.gp_conveyor.width;
            //添加在传送带
            this.gp_conveyor.addChild(bottle);
        }
        //循环遍历传送带里面的瓶子
        for (var i = this.gp_conveyor.numChildren - 1; i >= 0; i--) {

            //获取每个瓶子
            var element = <Bottle>this.gp_conveyor.getChildAt(i);
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
    }
    //拖拽事件
    private ontouch_begin(e: egret.TouchEvent) {
        //获取点击时的X轴和Y轴，因为瓶子的坐标是相对于传送带的，所以要减去传送带的X轴Y轴。。Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
        var pt1 = new egret.Point(e.stageX - this.gp_conveyor.x, e.stageY - this.gp_conveyor.y);

        //循环遍历每个瓶子
        for (var i = this.gp_conveyor.numChildren - 1; i >= 0; i--) {
            //获取每个瓶子
            var element = <Bottle>this.gp_conveyor.getChildAt(i);
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
    }
    //移动事件
    private ontouch_move(e: egret.TouchEvent) {
        //如果没有选中的瓶子就跳出
        if (this.selBottle == null) { return };
        this.pickupBottle.x = e.stageX;
        this.pickupBottle.y = e.stageY;
    }
    //触碰结束事件
    private ontouch_end(e: egret.TouchEvent) {
        //如果有选中的瓶子，则将该瓶子的选中属性取消
        if (this.selBottle != null) {
            this.selBottle.IsSelected = false;
        }
        if(!this.pickupBottle.visible)return;
        //隐藏捡起的瓶子
        this.pickupBottle.visible = false;
        //取得鼠标抬起时的坐标点
        var checkpt = new egret.Point(e.stageX - this.Packages.x, e.stageY - this.Packages.y);
        //循环遍历所有的箱子
        for (var i = 0; i < this.Packages.numChildren; i++) {
            //获得当前箱子
            var Pack = <Package>this.Packages.getChildAt(i);
            if (Pack.isPacking) { continue; }
            //获取箱子的位置
            var rect = new egret.Rectangle(Pack.x, Pack.y, Pack.width, Pack.height);
            //判断鼠标抬起时的坐标在不在箱子的方位，并且判断箱子的类型等不等于瓶子的类型
            //特地说明，瓶子的BottleType用[1,2,3,4,5,6]存放，箱子也一样
            if (rect.containsPoint(checkpt)) {
                console.log(1)
                if (Pack.Pos == this.pickupBottle.BottleType) {
                    if (!Pack.addBottle(this.pickupBottle)) {
                        this.score += 5;
                    };//如果类型相同则放入瓶子
                    this.score += 1;
                    this.gp_conveyor.removeChild(this.selBottle);//移除瓶子
                    break;
                } else {
                    this.GameOver();
                }
            }
            
        }
    }
    //游戏结束
    private GameOver() {
        this.GameOverGP.visible = true;
        //循环遍历界面的元素，添加动画
        for (var i = 0; i < this.GameOverGP.numChildren; i++) {
            var item = this.GameOverGP.getChildAt(i);
            item.alpha = 0;
            egret.Tween.get(item).wait(i * 200).to({ "alpha": 1 }, 500);
        }
        this.isPaused = true;
    }

    //监听游戏分数
    private _score: number = 0;
    public get score(): number {
        return this._score;
    }
    public set score(v: number) {
        this._score = v;
        this.OverScore.text = this.GameScore.text = v.toString();
    }
    //游戏重玩
    public onclickReStart() {
        this.score = 0;
        this.GameOverGP.visible = false;
        this.isPaused = false;
        this.gp_conveyor.removeChildren();
        for (var i = 0; i < this.Packages.numChildren; i++) {
            //获得当前箱子
            var Pack = <Package>this.Packages.getChildAt(i);
            Pack.clearBottle();
        }
        //循环遍历界面的元素，添加动画
        for (var i = 0; i < this.Packages.numChildren; i++) {
            var item = this.Packages.getChildAt(i);
            item.anchorOffsetY = -800;
            egret.Tween.get(item).wait(i * 200).to({ "anchorOffsetY": 0 }, 500);
        }
    }
    //同开始页面切换原理
    private MainMenu() {
        this.parent.addChild(SrartGame.getInstance());
        this.parent.removeChild(this);
    }

}