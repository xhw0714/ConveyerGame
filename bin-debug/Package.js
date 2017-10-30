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
var Package = (function (_super) {
    __extends(Package, _super);
    function Package() {
        var _this = _super.call(this) || this;
        //判断是否在打包中
        _this.isPacking = false;
        //监听自定义属性，即瓶子总数改变
        _this._sum = 0;
        return _this;
    }
    //通过改变eui下createChildren的属性修改图片地址
    Package.prototype.createChildren = function () {
        this.imgBody.source = RES.getRes("bottle" + this._Pos + "_0_png");
    };
    Object.defineProperty(Package.prototype, "Pos", {
        get: function () {
            return this._Pos;
        },
        set: function (v) {
            this._Pos = v;
        },
        enumerable: true,
        configurable: true
    });
    //添加瓶子
    Package.prototype.addBottle = function (bottle) {
        //改变sum值
        this.sum += 1;
        //当超过6个就打包处理
        if (this.sum >= 6) {
            this.packing();
            return false;
        }
        return true;
    };
    //打包处理
    Package.prototype.packing = function () {
        this.isPacking = true;
        //动画处理,100毫秒一帧
        var frametween = egret.Tween.get(this.imgBody);
        for (var i = 7; i < 24; i++) {
            frametween.wait(50).set({ "source": RES.getRes("bottle" + this._Pos + "_" + i + "_png") });
        }
        frametween.call(this.packover, this);
    };
    Package.prototype.packover = function () {
        this.sum = 0;
        this.isPacking = false;
    };
    Object.defineProperty(Package.prototype, "sum", {
        get: function () {
            return this._sum;
        },
        set: function (v) {
            this._sum = v;
            //瓶子数量改变时改变要显示的图片
            this.imgBody.source = RES.getRes("bottle" + this._Pos + "_" + v + "_png");
        },
        enumerable: true,
        configurable: true
    });
    Package.prototype.clearBottle = function () {
        this.sum = 0;
    };
    return Package;
}(eui.Component));
__reflect(Package.prototype, "Package");
//# sourceMappingURL=Package.js.map