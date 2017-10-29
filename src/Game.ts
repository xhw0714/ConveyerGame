// TypeScript file

class Game extends eui.Component {
    //传送带
    public gp_conveyor: eui.Group;
    //存放捡起的瓶子
    private pickupBottle: Bottle = null;
    //存放已经捡起的瓶子
    private setBottle:Bottle = null;

    public constructor() {
        super();

        //场景文件为gameskin.exml
        this.skinName = "resource/skins/gameskin.exml";
        //设置定时器
        egret.startTick(this.onUpdate, this);
        this.addChild(this.pickupBottle = new Bottle(1))
        this.pickupBottle.visible = false;
        //绑定瓶子拖拽事件
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.ontouch_begin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouch_move, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.ontouch_end, this);
    }


    //记录上一次时间
    private lasttime: number = 0;
    //瓶子出生时间
    private birthrime: number = 0;
    private onUpdate(timestamp: number): boolean {
        //计算时间差，除以1000换算秒

        var dt = (timestamp - this.lasttime) / 1000;
        //把上一次的时间变成现在的时间
        this.lasttime = timestamp;
        //出生时间加上时间差
        this.birthrime += dt;
        //如果时间超过一秒钟
        if (this.birthrime > 1) {
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
                console.log(1)
            }
        }
        return false;
    }
    //拖拽事件
    private ontouch_begin(e: egret.TouchEvent) {
        //设置一个位置。位置的X轴和Y轴都在传送带内。Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
        var pt1 = new egret.Point(e.stageX - this.gp_conveyor.x, e.stageY - this.gp_conveyor.y);
        //循环遍历每个瓶子
        for (var i = this.gp_conveyor.numChildren - 1; i >= 0; i--) {
            //获取每个瓶子
            var element = <Bottle>this.gp_conveyor.getChildAt(i);
            
            var rect = new egret.Rectangle(element.x,element.y,element.width,element.height);
            if(rect.containsPoint(pt1)){
                element.IsSelected = true;
                this.setBottle = element;
            }
        }
    }
    private ontouch_move(e: egret.TouchEvent) {
        if(this.setBottle ==null){return};
    }
    private ontouch_end(e: egret.TouchEvent) {
        if(this.setBottle !=null){
            this.setBottle.IsSelected = false;
        }

    }
}