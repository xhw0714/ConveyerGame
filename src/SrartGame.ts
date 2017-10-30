class SrartGame extends eui.Component {
	//设置暴露在外的接口
	private static _instance: SrartGame = null;
	public static getInstance() {
		if (SrartGame._instance == null) {
			SrartGame._instance = new SrartGame();
		}
		return SrartGame._instance;
	}
	//找到开始按钮
	private BtnPlay:eui.Button;
	public constructor() {
		super();
		this.skinName = "resource/skins/StartGame.exml";
		//给开始按钮添加事件
		this.BtnPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnclickPlay, this);
	}
	public OnclickPlay() {
		//点击开始后舞台加入游戏界面
		this.parent.addChild(Game.getInstance());
		//移除开始界面
		this.parent.removeChild(this);
		Game.getInstance().onclickReStart();
	}
}