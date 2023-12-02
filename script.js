const userName = localStorage.getItem('userName');
document.getElementById('userName').innerText = userName;

document.addEventListener('mousemove', function (e) {
    var textCursor = document.getElementById('text-cursor');
    if (!textCursor) {
        textCursor = document.createElement('div');
        textCursor.id = 'text-cursor';
        textCursor.style.position = 'absolute';
        textCursor.style.pointerEvents = 'none'; 
        textCursor.style.fontSize = '20px';
        textCursor.textContent = userName;
        document.body.appendChild(textCursor);
    }

    if (!isHelpModeActive) {
      if (isEditing) {
          textCursor.textContent = `${userName} typing`;
      } else if (brushActive) {
          textCursor.textContent = `${userName} drawing`;
      } else if (isResizing) {
          textCursor.textContent = `${userName} resizing`;
      } else if (isRotating) {
          textCursor.textContent = `${userName} rotating`;
      } else if (isMovable) {
          textCursor.textContent = `${userName} moving`;
      } else {
          textCursor.textContent = userName;
      }
  }

  textCursor.style.left = e.clientX + 'px';
  textCursor.style.top = e.clientY + 'px';
});


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

buckets.forEach(bucket => {
  bucket.addEventListener("dblclick", () => {
    // 改变背景颜色
    document.body.style.backgroundColor = getRandomColor();
    
    // 立即更新文本光标为倾倒状态
    updateTextCursor(`${userName} pouring`);

    // 设置延时，几秒后重置光标文字
    setTimeout(() => {
      updateTextCursor(); // 重置文本光标
    }, 3000); // 3秒后执行
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

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.lineCap = 'round';

function draw(e) {
  ctx.lineWidth = 2;
    if (!painting) return;
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}


function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

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

const resizeHandles = document.querySelectorAll('.resize');
resizeHandles.forEach(handle => {
    handle.addEventListener('dblclick', function() {
        isResizing = !isResizing;
        updateTextCursor(isResizing ? `${userName} resizing` : '');
    });
});

document.addEventListener('mousedown', function(e) {
    if (!isResizing) return;

    // 检查点击的是否是一个 box
    if (e.target.classList.contains('box')) {
        selectedBox = e.target;
        let startX = e.clientX;
        let startY = e.clientY;
        let startWidth = selectedBox.offsetWidth;
        let startHeight = selectedBox.offsetHeight;

        function onMouseMove(e) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            selectedBox.style.width = Math.max(20, startWidth + dx) + 'px';
            selectedBox.style.height = Math.max(20, startHeight + dy) + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
});

// 双击任何位置取消重置
document.addEventListener('dblclick', function(event) {
  // 检查是否处于重置模式并且点击的不是 resize 控件
  if (isResizing && !event.target.classList.contains('resize')) {
      isResizing = false;
      selectedBox = null;
      updateTextCursor();
  }
});

/*
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
      } else if (isRotating) {
          textCursor.textContent = `${userName} rotating`;
      } else {
          textCursor.textContent = userName;
      }
  }
}
*/


//这是rorate的部分


let isRotating = false;
let rotateBox = null;

const rotateHandle = document.getElementById('rotate');
rotateHandle.addEventListener('dblclick', function() {
    isRotating = !isRotating;
    updateTextCursor(isRotating ? `${userName} rotating` : '');
});

document.addEventListener('mousedown', function(e) {
    if (!isRotating) return;

    if (e.target.classList.contains('box')) {
        rotateBox = e.target;

        document.addEventListener('mousemove', onRotateMove);
        document.addEventListener('mouseup', function() {
        document.removeEventListener('mousemove', onRotateMove);
        });
    }
});

function onRotateMove(e) {
    if (!rotateBox) return;

    // 计算旋转角度（示例，可能需要根据实际情况调整）
    let rect = rotateBox.getBoundingClientRect();
    let center_x = rect.left + rect.width / 2;
    let center_y = rect.top + rect.height / 2;
    let angle = Math.atan2(e.clientY - center_y, e.clientX - center_x) * 180 / Math.PI;
    
    rotateBox.style.transform = `rotate(${angle}deg)`;
}

// 双击任何位置取消旋转
document.addEventListener('dblclick', function(event) {
  if (isRotating && event.target.id !== 'rotate') {
      isRotating = false;
      rotateBox = null;
      updateTextCursor();

      // 取消mousemove事件监听，以停止旋转
      document.removeEventListener('mousemove', onRotateMove);
  }
});

//这是介绍的部分

let isHelpModeActive = false; // 标志变量，追踪 help 功能是否激活
let helpText = "Try one click the cursor"; // 默认 help 文本


// 为 'help' 添加双击事件监听器
document.getElementById("help").addEventListener('dblclick', function() {
  isHelpModeActive = !isHelpModeActive; // 切换 help 功能的状态
  if (isHelpModeActive) {
      // 如果激活了 help 功能，则显示默认 help 文本
      updateTextCursor(helpText);
  } else {
      // 如果取消了 help 功能，则重置文本光标
      updateTextCursor();
  }
});


// 为每个 'box' 添加单击事件监听器
boxes.forEach(function(box) {
  box.addEventListener('click', function() {
      // 当 help 功能激活且单击任何 'box' 时，显示其 alt 文本
      if (isHelpModeActive && box.getAttribute('alt')) {
          updateTextCursor(box.getAttribute('alt').replace(/\|/g, '<br>')); // 替换段落分隔符并显示
      }
  });
});

// 添加全局双击事件监听器以取消 help 功能
document.addEventListener('dblclick', function(event) {
    // 检查双击的是否是 'help' 本身，如果不是，则取消 help 功能
    if (event.target.id !== 'help' && isHelpModeActive) {
        isHelpModeActive = false;
        updateTextCursor(userName); // 恢复到默认文本
    }
});

// 更新文本光标函数
function updateTextCursor(text) {
    if (textCursor) {
        textCursor.textContent = text;
    }
}




//update textcursor
function updateTextCursor(text = '') {
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
      } else if (isRotating) {
          textCursor.textContent = `${userName} rotating`;
      } else if (isHelpModeActive) {
          textCursor.innerHTML = text || helpText; // 显示 help 文本或当前指定的文本
      } else {
          textCursor.textContent = userName;
      }
  }
}

// 获取ID为 'screenshot' 的元素
const screenshotBox = document.getElementById('screenshot');

// 为该元素添加双击事件监听器
screenshotBox.addEventListener('dblclick', function() {
    // 调用浏览器的打印功能
    window.print();
});


// 更新 userNameDisplay 中的内容
function updateUserNameDisplay() {
  const userName = localStorage.getItem('userName'); // 获取 userName
  const userNamePrintSpan = document.getElementById('userNameprint'); // 获取 userNameprint 的 span 元素

  if (userNamePrintSpan) {
      userNamePrintSpan.textContent = userName; // 更新 userNameprint 的内容
  }
}
// 调用这个函数来初始化 userNameDisplay 的内容
updateUserNameDisplay();
