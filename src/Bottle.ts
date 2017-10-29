
//枚举
enum BottleType {
	None, Bottle1, Bottle2, Bottle3, Bottle4, Bottle5, Bottle6
}

//创建瓶子类
class Bottle extends eui.Image {
	//设置参数为枚举的类型
	public constructor(type: BottleType) {
		super();
		//设置瓶子的类型
		this.bottleType = type;
		//获取瓶子的资源素材
		var str = "bottle" + <number>type + "_png";
		this.source = RES.getRes(str);
	}
	//给一个瓶子类型属性
	public bottleType: BottleType;

	//判断是否选中瓶子
	private _IsSelected: boolean;
	public get IsSelected(): boolean {
		return this._IsSelected;
	}
	//如果选中改变透明度
	public set IsSelected(v: boolean) {
		this._IsSelected = v;
		if (v) {
			this.alpha = 0.5;
		} else {
			this.alpha = 1;
		}
	}


}