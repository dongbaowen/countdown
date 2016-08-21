//控制画布样式
var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHeight;
var RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1;
var MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);
var MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);

//设置时间默认为提前一个小时
var ENDTIME = new Date();
ENDTIME.setTime(ENDTIME.getTime() + 3600000);

//定义距离当前时间的毫秒值
var curShowTimeSeconds = 0;

//定义所有活动的小球
var balls = [];
//定义活动小球的颜色
const colors = ['#33b5e5', '#0099cc', '#aa66cc', '#9933cc', '#669900', '#ffbb33', '#ff8800', '#ff4444', '#cc000c'];

window.onload = function(){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurShowTimeSeconds();

    //每隔30毫秒进行一次渲染
    setInterval(function(){
        //控制渲染,控制样式
        render(context);
        //更新状态,控制动作
        update();
    }, 30);
}


function update(){
    var nextShowTimeSecondes = getCurShowTimeSeconds();

    var curhours = parseInt(curShowTimeSeconds / 3600),
        curminutes = parseInt((curShowTimeSeconds - curhours * 3600) / 60),
        cursecondes = curShowTimeSeconds % 60;

    var nexthours = parseInt(nextShowTimeSecondes / 3600),
        nextminutes = parseInt((nextShowTimeSecondes - nexthours * 3600) / 60),
        nextsecondes = nextShowTimeSecondes % 60;

    //判断时间是否修改
    if(cursecondes != nextsecondes){
        //添加小时小球
        if(parseInt(curhours/10) != parseInt(nexthours/10)){
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(nexthours/10));
        }
        if(parseInt(curhours%10) != parseInt(nexthours%10)){
            addBalls(MARGIN_LEFT + 15*(RADIUS + 1), MARGIN_TOP, parseInt(nexthours%10));
        }

        //添加分钟小球
        if(parseInt(curminutes/10) != parseInt(nextminutes/10)){
            addBalls(MARGIN_LEFT + 39*(RADIUS + 1), MARGIN_TOP, parseInt(nextminutes/10));
        }
        if(parseInt(curminutes%10) != parseInt(nextminutes%10)){
            addBalls(MARGIN_LEFT + 54*(RADIUS + 1), MARGIN_TOP, parseInt(nextminutes%10));
        }

        //添加秒数小球
        if(parseInt(cursecondes/10) != parseInt(nextsecondes/10)){
            addBalls(MARGIN_LEFT + 78*(RADIUS + 1), MARGIN_TOP, parseInt(nextsecondes/10));
        }
        if(parseInt(cursecondes%10) != parseInt(nextsecondes%10)){
            addBalls(MARGIN_LEFT + 93*(RADIUS + 1), MARGIN_TOP, parseInt(nextsecondes%10));
        }

        //更新时间
        curShowTimeSeconds = nextShowTimeSecondes;
    }

    //更新小球动作
    updateBalls();
}
//使小球动起来
function updateBalls(){
    for(var i = 0; i < balls.length; i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.75;
        }
    }

    //优化：将不再画布中的小球从数组中删除
    var cnt = 0;
    for(var i = 0; i < balls.length; i++){
        if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
            balls[cnt++] = balls[i];
        }   
    }

    while(balls.length > Math.min(300, cnt)){
        balls.pop();
    }

}
//生成小球
function addBalls(x, y, num){
    for(var i = 0; i < digit[num].length; i++){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){
                var ball = {
                    x: x + j*2*(RADIUS + 1) + (RADIUS + 1),
                    y: y + i*2*(RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };

                balls.push(ball);
            }
        }
    }
}

//获取两个时间的毫秒值
function getCurShowTimeSeconds(){
    var curTime = new Date(),
        ret = ENDTIME.getTime() - curTime.getTime();

    ret = Math.round(ret / 1000);

    return ret >= 0 ? ret : 0;
}

//渲染
function render(ctx){
    var hours = parseInt(curShowTimeSeconds / 3600),
        minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60),
        secondes = curShowTimeSeconds % 60;

    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    //渲染小时
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), ctx);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours%10), ctx);
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, ctx);

    //渲染分钟
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes/10), ctx);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes%10), ctx);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, ctx);

    //渲染秒
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(secondes/10), ctx);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(secondes%10), ctx);

    //遍历活动小球的数组，对每个小球进行渲染
    for(var i = 0; i < balls.length; i++){
       
       ctx.fillStyle = balls[i].color;
       ctx.beginPath();
       ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true); 
       ctx.closePath();

       ctx.fill();
    }
}

function renderDigit(x, y, num, ctx){
    ctx.fillStyle = 'rgb(0, 102, 153)';

    for(var i = 0; i < digit[num].length; i++){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){
                ctx.beginPath();

                ctx.arc(x + j*2*(RADIUS+1) + (RADIUS+1), y + i*2*(RADIUS+1) + (RADIUS+1), RADIUS, 0, 2*Math.PI);

                ctx.closePath();
                ctx.fill();
            }
        }
    }
}