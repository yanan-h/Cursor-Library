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

    if (!isEditing &&!brushActive &&!isResizing) {
      textCursor.textContent = isMovable ? `${userName} moving` : userName;
  }

  textCursor.style.left = e.clientX + 'px';
  textCursor.style.top = e.clientY + 'px';
});

function updateTextCursor() {
  const textCursor = document.getElementById('text-cursor');
  if (textCursor) {
      if (isEditing) {
          textCursor.textContent = `${userName} typing`;
      } else if (isBucketSelected) {
          textCursor.textContent = `${userName} pouring`;
      } else if (isResizing) {
          textCursor.textContent = `${userName} resizing`;
      } else if (brushActive) {
          textCursor.textContent = `${userName} drawing`;
      } else {
          textCursor.textContent = userName;
      }
  }
}

//这是move的部分

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
      isBucketSelected = !isBucketSelected;
      const randomColor = isBucketSelected ? getRandomColor() : ''; // 如果取消 bucket 选择，重置颜色
      document.body.style.backgroundColor = randomColor;
      updateTextCursor(); // 更新文本光标
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

//输入部分

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

document.addEventListener('dblclick', function(event) {
  if (isEditing && event.target !== textElement) {
      isEditing = false;
      editableText.setAttribute('contenteditable', 'false');
      updateTextCursor();
  } else if (brushActive && event.target !== brush) {
      brushActive = false;
      painting = false;
      canvas.removeEventListener('mousedown', startPainting);
      canvas.removeEventListener('mouseup', stopPainting);
      canvas.removeEventListener('mousemove', draw);
      updateTextCursor();
  }
});



//这是resize部分
let isResizing = false;
let selectedBox = null;

const resizeHandles = ['resize1', 'resize2', 'resize3', 'resize4'].map(id => document.getElementById(id));
resizeHandles.forEach(handle => {
  handle.addEventListener('dblclick', function() {
      isResizing = !isResizing;
      updateTextCursor();
  });
});



let startX, startY, startWidth, startHeight;

document.addEventListener('mousedown', function(e) {
    if (!isResizing) return;

    startX = e.clientX;
    startY = e.clientY;
    startWidth = e.target.offsetWidth;
    startHeight = e.target.offsetHeight;

    function onMouseMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        selectedBox.style.width = startWidth + dx + 'px';
        selectedBox.style.height = startHeight + dy + 'px';
    
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});
document.addEventListener('dblclick', function(event) {
  if (!resizeHandles.includes(event.target)) {
      isResizing = false;
      updateTextCursor();
  }
});
