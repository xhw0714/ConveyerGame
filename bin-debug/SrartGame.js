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
var SrartGame = (function (_super) {
    __extends(SrartGame, _super);
    function SrartGame() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/skins/StartGame.exml";
        //给开始按钮添加事件
        _this.BtnPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnclickPlay, _this);
        return _this;
    }
    SrartGame.getInstance = function () {
        if (SrartGame._instance == null) {
            SrartGame._instance = new SrartGame();
        }
        return SrartGame._instance;
    };
    SrartGame.prototype.OnclickPlay = function () {
        //点击开始后舞台加入游戏界面
        this.parent.addChild(Game.getInstance());
        //移除开始界面
        this.parent.removeChild(this);
        Game.getInstance().onclickReStart();
    };
    //设置暴露在外的接口
    SrartGame._instance = null;
    return SrartGame;
}(eui.Component));
__reflect(SrartGame.prototype, "SrartGame");
//# sourceMappingURL=SrartGame.js.map