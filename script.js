const userName = localStorage.getItem('userName');
        document.getElementById('userName').innerText = userName;

        document.addEventListener('mousemove', function (e) {
            var textCursor = document.getElementById('text-cursor');
            if (!textCursor) {
                textCursor = document.createElement('div');
                textCursor.id = 'text-cursor';
                textCursor.style.position = 'absolute';
                textCursor.style.pointerEvents = 'none'; 
                textCursor.style.fontSize = '24px';
                textCursor.textContent = userName;
                document.body.appendChild(textCursor);
            }
            textCursor.style.left = e.clientX + 'px';
            textCursor.style.top = e.clientY + 'px';
        });


// 获取所有拥有 'box' 类的元素
let boxes = document.querySelectorAll(".box");
let isMovable = false; // 控制所有元素是否可以移动的标志

// 获取控制开关元素
let move = document.getElementById("move");

// 设置双击事件处理器来切换移动状态
move.ondblclick = function() {
  isMovable = !isMovable;
  move.textContent = isMovable ? "双击以禁用移动" : "双击以启用移动";
};

// 为整个文档添加双击事件处理器
document.ondblclick = function(event) {
  // 检查双击的是否是控制开关本身
  if (event.target !== move) {
    isMovable = false;
    move.textContent = "双击以启用移动";
  }
};

boxes.forEach(function(box) {
  box.onmousedown = function(event) {
    if (!isMovable) return; // 如果不在可移动状态，不执行任何操作

    // 计算鼠标相对于元素的初始位置
    let disx = event.clientX - box.offsetLeft;
    let disy = event.clientY - box.offsetTop;

    // 添加mousemove事件到document
    document.onmousemove = function(event) {
      box.style.left = event.clientX - disx + 'px';
      box.style.top = event.clientY - disy + 'px';
    };

    // 添加mouseup事件到document
    document.onmouseup = function() {
      document.onmousemove = null;
      document.onmouseup = null;
      return false;
    };

    // 防止默认事件
    return false;
  };

  // 防止 Firefox 上的默认拖动行为
  box.ondragstart = function() {
    return false;
  };
});





