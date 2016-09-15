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
          context_left.strokeRect(canvas.start, canvas.start, canvas.width, canvas.height);
          break;
        case "ellipse":
          // TODO: 後で追加
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
}

function drawEllipse() {
  // TODO: 後で記入
}

function clear() {
  if (context_left != null) {
    context_left.clearRect(0, 0, canvas.canvas_width, canvas.canvas_height);
  }

  if (context_right != null) {
    context_right.clearRect(0, 0, canvas.canvas_width, canvas.canvas_height);
  }
}
