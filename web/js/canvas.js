var canvas = {
  canvas_width: 300,
  canvas_height: 300,
  width: 260,
  height: 260,
  start: 300 / 15,
};

var canvas_left;
var canvas_right;
var context_left;
var context_right;
var shape;

function init(shape) {
  canvas_left = document.getElementById("canvas-left");

  if (canvas_left.getContext) {
      context_left = canvas_left.getContext("2d");

      clear();

      if (shape != "default") {
        this.shape = shape;
      }

      switch (this.shape) {
        case "square":
          var canvas_right = document.getElementById("canvas-right");
          if (canvas_right != null) {
            canvas_right.parentNode.removeChild(canvas_right);
          }

          var position_li = document.getElementById("position-li");
          if (position_li == null) {
            position_li = document.createElement("li");
            position_li.setAttribute("id", "position-li");

            var position_li_p = document.createElement("p");
            position_li_p.appendChild(document.createTextNode("出発位置 (0 < x < 1)"));
            position_li.appendChild(position_li_p);

            var position_li_input = document.createElement("input");
            position_li_input.setAttribute("id", "position");
            position_li_input.setAttribute("type", "number");
            position_li.appendChild(position_li_input);

            var input_ul = document.getElementById("input-ul")
            input_ul.insertBefore(position_li, input_ul.firstElement);
          }

          canvas_right = null;
          context_right = null;
          context_left.strokeRect(canvas.start, canvas.start, canvas.width, canvas.height);
          break;
        case "ellipse":
          var canvas_right = document.getElementById("canvas-right");
          if (canvas_right == null) {
            canvas_right = document.createElement("canvas");
            canvas_right.setAttribute("id", "canvas-right");
            canvas_right.setAttribute("width", canvas.canvas_width);
            canvas_right.setAttribute("height", canvas.canvas_height);
            document.getElementById("canvas-wrapper").appendChild(canvas_right);
          }

          var position_li = document.getElementById("position-li");
          if (position_li != null) {
            position_li.parentNode.removeChild(position_li);
          }

          canvas_right = document.getElementById("canvas-right");
          context_right = canvas_right.getContext("2d");
          context_left.beginPath();
          context_left.arc(canvas.canvas_width/2, canvas.canvas_height/2, canvas.width/2, 0, Math.PI*2, false);
          context_left.stroke();

          context_right.beginPath();
          context_right.strokeStyle = 'rgb(0, 0, 0)';
          context_right.arc(canvas.canvas_width/2, canvas.canvas_height/2, canvas.width/2, 0, Math.PI*2, false);
          context_right.strkeStyle = 'rgb(0, 0, 0)';
          context_right.stroke();
          break;
        default:
          return;
      }
  }
}

function draw() {
  switch (shape) {
    case "square":
      drawRect();
      break;
    case "ellipse":
      drawEllipse();
      break;
    default:
      return;
  }
}

function drawRect() {
  var start_position = Number(document.getElementById("position").value);
  var reflection = Number(document.getElementById("reflection").value);
  var angle = Number(document.getElementById("angle").value);

  if (start_position <= 0 || start_position >= 1) {
    window.alert("出発位置を入力し直してください。");
    return false;
  }
  if (reflection <= 0) {
    window.alert("反射回数を入力し直してください。");
    return false;
  }
  if (angle <= 0 || angle >= 180) {
    window.alert("出発角度を入力し直してください。");
    return false;
  }

  var count = 0;
  var marginX = (canvas.canvas_width - canvas.width)/2;
  var marginY = (canvas.canvas_height - canvas.height)/2;
  var posX = marginX + start_position * canvas.width;
  var posY = canvas.canvas_height - marginY;

  var rad = angle/180 * Math.PI;
  var moveX = Math.cos(rad);
  var moveY = Math.sin(rad);
  while(true) {
    if (count > reflection) {
      break;
    }

    posX += moveX;
    posY -= moveY;
    context_left.fillRect(posX, posY, 1, 1);

    // X座標の壁判定
    if (posX < marginX || posX > marginX + canvas.width) {
      angle = 180 - angle;
      rad = angle/180 * Math.PI;
      moveX = Math.cos(rad);
      moveY = Math.sin(rad);
      count++;
    }

    // Y座標の壁判定
    if (posY < marginY || posY > marginY + canvas.height) {
      angle = 360 - angle;
      rad = angle/180 * Math.PI;
      moveX = Math.cos(rad);
      moveY = Math.sin(rad);
      count++;
    }
  }
}

function drawEllipse() {
  var reflection = Number(document.getElementById("reflection").value);
  var angle = Number(document.getElementById("angle").value);

  if (reflection <= 0) {
    window.alert("反射回数を入力し直してください。");
    return false;
  }
  if (angle <= 0 || angle >= 180) {
    window.alert("出発角度を入力し直してください。");
    return false;
  }

  var count = 0;
  var startAngle = angle;
  var marginX = (canvas.canvas_width - canvas.width)/2;
  var marginY = (canvas.canvas_height - canvas.height)/2;
  var posX = canvas.canvas_width/2;
  var posY = canvas.canvas_height - marginY;
  var rad = angle/180 * Math.PI;
  var moveX = Math.cos(rad);
  var moveY = Math.sin(rad);

  context_right.beginPath();
  context_right.strokeStyle = 'rgb(0, 0, 0)';
  context_right.moveTo(canvas.canvas_width/2, canvas.canvas_height/2);
  context_right.lineTo(posX, posY);
  context_right.stroke();

  while(true) {
    if (count > reflection) {
      break;
    }

    posX += moveX;
    posY -= moveY;
    context_left.fillRect(posX, posY, 1, 1);

    var dist = Math.sqrt(Math.pow(posX - canvas.canvas_width/2, 2) + Math.pow(posY - canvas.canvas_height/2, 2));
    if (dist >= canvas.width/2) {
      context_right.beginPath();
      context_right.strokeStyle = 'rgb(0, 0, 200)';
      context_right.moveTo(canvas.canvas_width/2, canvas.canvas_height/2);
      context_right.lineTo(posX, posY);
      context_right.stroke();

      angle = 2*startAngle + angle;
      if (angle > 360) {
        angle -= 360;
      }

      rad = angle/180 * Math.PI;
      moveX = Math.cos(rad);
      moveY = Math.sin(rad);
      count++;
    }
  }
}

function clear() {
  if (context_left != null) {
    context_left.clearRect(0, 0, canvas.canvas_width, canvas.canvas_height);
  }

  if (context_right != null) {
    context_right.clearRect(0, 0, canvas.canvas_width, canvas.canvas_height);
  }
}
