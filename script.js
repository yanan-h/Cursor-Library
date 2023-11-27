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

    if (!isEditing &&!brushActive) {
      textCursor.textContent = isMovable ? `${userName} moving` : userName;
  }

  textCursor.style.left = e.clientX + 'px';
  textCursor.style.top = e.clientY + 'px';
});


/*这是move的部分*/

// 获取所有拥有 'box' 类的元素
let boxes = document.querySelectorAll(".box");

let isMovable = false; 

let move = document.getElementById("move");

move.ondblclick = function() {
  isMovable = !isMovable;
  move.textContent = isMovable ? "doubleClickNoMove" : "doubleClickToMove";

  // 添加 "moving" 到鼠标文本
  if (isMovable) {
    
    move.textContent += " moving";
  }
};

document.ondblclick = function(event) {
  if (event.target !== move) {
    isMovable = false;
    move.textContent = "doubleClickToMove";
  }
};

boxes.forEach(function(box) {
  box.onmousedown = function(event) {
    if (!isMovable) return; 
 
    let disx = event.clientX - box.offsetLeft;
    let disy = event.clientY - box.offsetTop;

    document.onmousemove = function(event) {
      box.style.left = event.clientX - disx + 'px';
      box.style.top = event.clientY - disy + 'px';
    };
   
    document.onmouseup = function() {
      document.onmousemove = null;
      document.onmouseup = null;
      return false;
    };

    return false;
  };

  box.ondragstart = function() {
    return false;
  };
});


/*这是改色的部分*/



let isBucketSelected = false; // 用于跟踪是否选中了"bucket"元素

// 获取所有具有 "bucket" 类的元素
const buckets = document.querySelectorAll(".bucket");

// 为每个 bucket 元素添加双击事件监听器
buckets.forEach(bucket => {
  bucket.addEventListener("dblclick", () => {
    if (isBucketSelected) {
      // 如果已经选中了"bucket"元素，取消选中
      isBucketSelected = false;
    } else {
      // 如果未选中"bucket"元素，执行选中操作
      // 生成随机背景颜色，例如 "#RRGGBB" 格式
      const randomColor = getRandomColor();

      // 将随机背景颜色应用到整个网页的背景
      document.body.style.backgroundColor = randomColor;
      const textCursor = document.getElementById('text-cursor');
      if (textCursor) {
        textCursor.textContent = `${userName} pouring`;
      }
  
    }
  });
});

// 生成随机颜色的函数
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


// ...[您现有的代码]...

// 在此处添加画布绘画相关的代码
let painting = false;
let brushActive = false;

function startPainting(e) {
    painting = true;
    draw(e);
}

function stopPainting() {
    painting = false;
    ctx.beginPath(); // 重置绘图路径
}

function draw(e) {
    if (!painting) return;
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 5;
ctx.lineCap = 'round';


const brush = document.getElementById('brush');
brush.addEventListener('dblclick', function() {
    painting = !painting;
    const textCursor = document.getElementById('text-cursor');
    if (textCursor) {
        textCursor.textContent = painting ? `${userName} drawing` : userName;
    }
    if (painting) {
        canvas.addEventListener('mousedown', startPainting);
        canvas.addEventListener('mouseup', stopPainting);
        canvas.addEventListener('mousemove', draw);
    } else {
        canvas.removeEventListener('mousedown', startPainting);
        canvas.removeEventListener('mouseup', stopPainting);
        canvas.removeEventListener('mousemove', draw);
    }
});
brush.addEventListener('dblclick', function() {
    brushActive = !brushActive; // 切换画笔激活状态
    painting = brushActive; // 同步 painting 状态

    if (brushActive) {
        // 激活画图功能
        canvas.addEventListener('mousedown', startPainting);
        canvas.addEventListener('mouseup', stopPainting);
        canvas.addEventListener('mousemove', draw);
    } else {
        // 停用画图功能
        canvas.removeEventListener('mousedown', startPainting);
        canvas.removeEventListener('mouseup', stopPainting);
        canvas.removeEventListener('mousemove', draw);
    }
});

document.addEventListener('dblclick', function(event) {
  if (brushActive && event.target !== brush) {
      brushActive = false; // 取消画笔激活状态

      const textCursor = document.getElementById('text-cursor');
        if (textCursor) {
            textCursor.textContent = userName;
        }

      // 停用画图功能
      canvas.removeEventListener('mousedown', startPainting);
      canvas.removeEventListener('mouseup', stopPainting);
      canvas.removeEventListener('mousemove', draw);
  }
});



let isEditing = false;

const textElement = document.getElementById('text');
const editableText = document.getElementById('editableText');

textElement.addEventListener('dblclick', function() {
    isEditing = !isEditing;
    updateTextCursor();

    if (isEditing) {
        // 激活编辑模式
        editableText.setAttribute('contenteditable', 'true');
        editableText.focus();
    } else {
        // 停用编辑模式
        editableText.setAttribute('contenteditable', 'false');
    }
});

function updateTextCursor() {
    const textCursor = document.getElementById('text-cursor');
    if (textCursor) {
        textCursor.textContent = isEditing ? `${userName} typing` : userName;
    }
}
