/*
1.动态生成dom元素，初始化
	生成几个气球
	创建节点对象
	初始化变量属性
	放入body中
	初始化场景属性 
		top= 浏览器高度
		left = 随机分布 
2. 气球向上移做动画
	改变气球的 top值 
3.点击气球，气球爆炸
4.完善气球动画，代码优化
 */
var num = 10;
var bx = 100 //气球尺寸
var wH = window.innerHeight; //获取浏览器高度
var wW = window.innerWidth;
var timer;
init(num);
document.addEventListener('click',function(e){
	if(e.target.tagName.toLowerCase() === 'button'){
		if(e.target.value === 'begin'){
			timer = setInterval(move,1000/30);
		}else if(e.target.value === 'stop'){
			clearInterval(timer);
		}else if(e.target.value === 'reset'){
			var ballon_wrap = document.querySelector('#ballon_wrap');
			while(ballon_wrap.childNodes[0]){
				ballon_wrap.removeChild(ballon_wrap.firstChild);
			}
			init(num);
		}
	}
	if(e.target.className.toLowerCase() === 'ballon') {
		var ele = e.target;
		bang(ele);
		init(1);
	}
},false);
function init(num){
	var fragment = document.createDocumentFragment();
	var ballon_wrap = document.querySelector('#ballon_wrap');
	for(var i =0; i<num; i++){
		var randomX = ~~(Math.random()*wW) - bx; //Math.floor很慢，消耗性能 用位运算符~~取整
			randomX = Math.abs(randomX); //为了气球边框不被浏览器遮挡
		var ballon = document.createElement('div');
			ballon.className = 'ballon';
			ballon.style.top = wH - (bx + 20) + 'px' ;  //为了让气球全部显示在界面上
			ballon.style.left = randomX + 'px';
			ballon.speed = ~~(Math.random() * 10) + 1; //ballon的type是什么？
			fragment.appendChild(ballon);
	}
	ballon_wrap.appendChild(fragment);
}
//气球移动模块
function move(){
	var ballons = document.getElementsByClassName('ballon');
	for (var i = 0,len = ballons.length; i < len; i++) {
		ballons[i].style.top = ballons[i].offsetTop - ballons[i].speed + 'px';
		if (ballons[i].offsetTop < -bx) {
			ballons[i].style.top = wH + 'px';   //实现触顶从下往上的效果
		};
	};
}
function bang(ele){ //消失的动画:气球加速上升，高度宽度减少，左右摇摆
	var rotate = [30,80];
	var index = 0;
	var timer = setInterval(function(){
		if (ele.offsetWidth < 10) {
			clearInterval(timer);
			ele.parentNode.removeChild(ele);
			return false;
		};
		index++;
		index %= 2; // 代替循环
		ele.style.transform = `rotate(${rotate[index]})`;
		ele.speed++; //加速运动
		ele.style.width = ele.offsetWidth - 10 + 'px';
		ele.style.height = ele.offsetHeight - 10 + 'px';
		ele.style.top = ele.offsetTop - ele.speed + 'px';
	},1000/60); 
}

/**
 * settimeout  延时定时器
 * setInterval 循环定时器 
 * 		问题：浏览器帧速率锁定 60次/s
 * 		同步队列阻塞： 失真
 * 		仅仅把要执行的函数加入队列，但函数执行需要时间，因此不准时
 *   	条用主体是window 其他节点没有权限调用
 * 懒加载
 */
	