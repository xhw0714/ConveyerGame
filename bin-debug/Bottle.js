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
//枚举
var BottleType;
(function (BottleType) {
    BottleType[BottleType["None"] = 0] = "None";
    BottleType[BottleType["Bottle1"] = 1] = "Bottle1";
    BottleType[BottleType["Bottle2"] = 2] = "Bottle2";
    BottleType[BottleType["Bottle3"] = 3] = "Bottle3";
    BottleType[BottleType["Bottle4"] = 4] = "Bottle4";
    BottleType[BottleType["Bottle5"] = 5] = "Bottle5";
    BottleType[BottleType["Bottle6"] = 6] = "Bottle6";
})(BottleType || (BottleType = {}));
//创建瓶子类
var Bottle = (function (_super) {
    __extends(Bottle, _super);
    //设置参数为枚举的类型
    function Bottle(type) {
        var _this = _super.call(this) || this;
        //设置瓶子的类型
        _this.bottleType = type;
        //获取瓶子的资源素材
        var str = "bottle" + type + "_png";
        _this.source = RES.getRes(str);
        return _this;
    }
    Object.defineProperty(Bottle.prototype, "IsSelected", {
        get: function () {
            return this._IsSelected;
        },
        //如果选中改变透明度
        set: function (v) {
            this._IsSelected = v;
            if (v) {
                this.alpha = 0.5;
            }
            else {
                this.alpha = 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Bottle;
}(eui.Image));
__reflect(Bottle.prototype, "Bottle");
//# sourceMappingURL=Bottle.js.map