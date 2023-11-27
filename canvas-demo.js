let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

wh( )
//    canvas与屏幕宽高一致
function wh() {
    let pageWidth = document.documentElement.clientWidth;
    let pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
}

//特性检测
if (document.body.ontouchstart !== undefined) {
//触屏设备
}else{
//非触屏设备
}

// 非触屏设备
// 按下鼠标(mouse)
    //鼠标点击事件（onmousedown）
    canvas.onmousedown = function (e) {
      let x = e.offsetX;
      let y = e.offsetY;
      painting = true;
      if (EraserEnabled) {
          ctx.clearRect(x - 15, y - 15, 30, 30)
      }
      startPoint = {x: x, y: y};
  };

//    滑动鼠标
//    鼠标滑动事件（onmousemove）
  canvas.onmousemove = function (e) {
      let x = e.offsetX;
      let y = e.offsetY;
      let newPoint = {x: x, y: y};
      if (painting) {
          if (EraserEnabled) {
              ctx.clearRect(x - 15, y - 15, 30, 30)
          } else {
              drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y);
          }
          startPoint = newPoint;
      }
  };
//    松开鼠标
//    鼠标松开事件（onmouseup)
  canvas.onmouseup = function () {
      painting = false;
  };

  //触屏设备
  canvas.ontouchstart = function (e) {
    //[0]表示touch第一个触碰点
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    painting = true;
    if (EraserEnabled) {
        ctx.clearRect(x - 20, y - 20, 40, 40)
    }
    startPoint = {x: x, y: y};
};
canvas.ontouchmove = function (e) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let newPoint = {x: x, y: y};
    if (painting) {
        if (EraserEnabled) {
            ctx.clearRect(x - 15, y - 15, 30, 30)
        } else {
            drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y);
        }
        startPoint = newPoint;
    }
};
canvas.ontouchend = function () {
    painting = false;
};

