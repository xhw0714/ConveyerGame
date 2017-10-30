class Package extends eui.Component{
	public constructor() {
		super();
	}
	//获取ID为imgBody的exml文件里的图片
	private imgBody:eui.Image;
	//通过改变eui下createChildren的属性修改图片地址
	protected createChildren(){
		this.imgBody.source = RES.getRes("bottle"+this._Pos+"_0_png");
	}

	//根据exml素材属性Pos来改变图片路径
	private _Pos : number;
	public get Pos() : number {
		return this._Pos;
	}
	public set Pos(v : number) {
		this._Pos = v;
	}

	//添加瓶子
	public addBottle(bottle:Bottle):boolean{
		//改变sum值
		this.sum +=1;
		//当超过6个就打包处理
		if(this.sum >= 6){
			this.packing();
			return false;
		}
		return true;
	}
	//判断是否在打包中
	public isPacking:boolean = false;
	//打包处理
	private packing(){
		this.isPacking = true;
		//动画处理,100毫秒一帧
		var frametween = egret.Tween.get(this.imgBody);
		for(var i=7;i<24;i++){
			frametween.wait(50).set({"source":RES.getRes("bottle"+this._Pos+"_"+ i +"_png")});
		}
		frametween.call(this.packover,this);
	}
	private packover(){
		this.sum = 0;
		this.isPacking = false;
	}

	//监听自定义属性，即瓶子总数改变
	private _sum : number = 0;
	public get sum() : number {
		return this._sum;
	}
	public set sum(v : number) {
		this._sum = v;
		//瓶子数量改变时改变要显示的图片
		this.imgBody.source = RES.getRes("bottle"+this._Pos+"_"+v+"_png");
	} 
	
	public clearBottle(){
		this.sum = 0;
	}
	
}