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
let isMovable = false; 


let move = document.getElementById("move");


move.ondblclick = function() {
  isMovable = !isMovable;
  move.textContent = isMovable ? "doubleClickNoMove" : "doubleClickToMove";
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





