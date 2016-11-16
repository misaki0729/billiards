var canvas = {
  canvas_width: 320,
  canvas_height: 320,
  ellipse_width: 300,
  width: 260,
  height: 260,
  start: 320 / 10,
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
        case "circle":
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
        case "ellipse":
          var canvas_right = document.getElementById("canvas-right");
          if (canvas_right != null) {
            canvas_right.parentNode.removeChild(canvas_right);
          }

          var position_li = document.getElementById("position-li");
          if (position_li == null) {
            position_li = document.createElement("li");
            position_li.setAttribute("id", "position-li");

            var position_li_p = document.createElement("p");
            position_li_p.appendChild(document.createTextNode("出発位置 (0 < x < 1, f = 0.2, 0.8)"));
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
          context_left.beginPath();
          context_left.save();
          context_left.translate(0, canvas.canvas_height*0.1);
          context_left.scale(1, 0.8);
          context_left.arc(canvas.canvas_width/2, canvas.canvas_height/2, canvas.ellipse_width/2, 0, Math.PI*2, false);
          context_left.stroke();
          context_left.restore();

          // 焦点
          var marginX = (canvas.canvas_width - canvas.ellipse_width)/2;
          context_left.beginPath();
          var f = Math.sqrt(Math.pow(canvas.ellipse_width/2, 2) - Math.pow(120, 2));
          context_left.arc(canvas.canvas_width/2 + f, canvas.canvas_height/2, 2, 0, Math.PI*2, false);
          context_left.arc(canvas.canvas_width/2 - f, canvas.canvas_height/2, 2, 0, Math.PI*2, false);
          context_left.fillStyle = 'rgb(200, 0, 0)';
          context_left.fill();
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
    case "circle":
      drawCircle();
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
    context_left.fillStyle = 'rgb(0, 0, 0)';
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

function drawCircle() {
  BigNumber.config({ ERRORS: false });

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
  var r = new BigNumber(canvas.width).div(2); // 半径
  var startX = new BigNumber(canvas.canvas_width).div(2);
  var startY = new BigNumber(canvas.canvas_height).div(2).plus(r);

  context_right.beginPath();
  context_right.strokeStyle = 'rgb(0, 0, 0)';
  context_right.moveTo(canvas.canvas_width/2, canvas.canvas_height/2);
  context_right.lineTo(posX, posY);
  context_right.stroke();

  while(true) {
    if (count > reflection) {
      break;
    }

    var angle = new BigNumber(rad).times(180).div(Math.PI);
    if (angle % 90 == 0) {
      // 角度が90度, 270度の場合にはtan()で計算できないため場合分け
      posX = new BigNumber(startX).minus(marginX).minus(r);

      // 方程式を解く
      var ans1 = new BigNumber(Math.abs(r, 2)).minus(Math.abs(posX, 2)).squareRoot();
      var ans2 = new BigNumber(ans1).times(-1);
      if (angle % 270 == 0) {
        if (ans1.gt(ans2)) {
          posY = ans2;
        } else {
          posY = ans1;
        }
      } else {
        if (ans1.gt(ans2)) {
          posY = ans1;
        } else {
          posY = ans2;
        }
      }

      if (count == 0) {
        posY = new BigNumber(r);
      }

      posX = new BigNumber(posX).plus(r).plus(marginX);
      posY = new BigNumber(r).minus(posY).plus(marginY);
    } else {
      // それ以外
      var x1 = new BigNumber(startX).minus(marginX).minus(r);
      var y1 = new BigNumber(r).minus(startY).plus(marginY);

      // 楕円の方程式と1点を通る直線の方程式からxを解く
      var m = new BigNumber(Math.tan(rad));
      var alpha = new BigNumber(1).plus(Math.pow(m, 2));
      var beta = new BigNumber(-2).times(new BigNumber(Math.pow(m, 2)).times(x1).minus(new BigNumber(m).times(y1)));
      var ganma = new BigNumber(Math.pow(m, 2)).times(Math.pow(x1, 2)).minus(new BigNumber(2).times(m).times(x1).times(y1)).plus(Math.pow(y1, 2)).minus(Math.pow(r, 2));

      var sqrt = new BigNumber(Math.pow(beta, 2)).minus(new BigNumber(4).times(alpha).times(ganma)).squareRoot();
      // 導き出したx座標(2次方程式なので答えは2つ), 解の公式を使ってるだけ
      var ans1 = new BigNumber(-1).times(beta).plus(sqrt).div(new BigNumber(2).times(alpha));
      var ans2 = new BigNumber(-1).times(beta).minus(sqrt).div(new BigNumber(2).times(alpha));

      // 傾きが右方向の場合
      if (Math.cos(rad) > 0) {
        if (ans1.gt(ans2)) {
          posX = ans1;
        } else {
          posX = ans2;
        }
      } else {
        if (ans2.gt(ans1)) {
          posX = ans1;
        } else {
          posX = ans2;
        }
      }
      posY = new BigNumber(m).times(new BigNumber(posX).minus(x1)).plus(y1);

      // posX, posYをcanvas内の座標に戻す
      posX = new BigNumber(posX).plus(r).plus(marginX);
      posY = new BigNumber(r).minus(posY).plus(marginY);
    }
    context_left.beginPath();
    context_left.moveTo(startX, startY);
    context_left.lineTo(posX, posY);
    context_left.stroke();
    context_right.beginPath();
    context_right.strokeStyle = 'rgb(0, 0, 200)';
    context_right.moveTo(canvas.canvas_width/2, canvas.canvas_height/2);
    context_right.lineTo(posX, posY);
    context_right.stroke();

    // ここから先は入射角, 反射角の計算
    var x0 = (posX - marginX) - r;
    var y0 = r - (posY - marginY);
    var x1 = 0; // 法線を引いたときのx座標(y座標の値は0)
    var x2 = (startX - marginX) - r;
    var y2 = r - (startY - marginY);

    // 3点から三角形のそれぞれの辺の長さを導く
    var dist_contact_to_x1 = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - 0, 2));
    var dist_start_to_contact = Math.sqrt(Math.pow(x2 - x0, 2) + Math.pow(y2 - y0, 2)); // 出発位置から接点への距離
    var dist_start_to_x1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - 0, 2));

    // 余弦定理を使って入射角の計算
    var incident_angle = Math.acos((Math.pow(dist_contact_to_x1, 2) + Math.pow(dist_start_to_contact, 2) - Math.pow(dist_start_to_x1, 2)) / (2 * dist_contact_to_x1 * dist_start_to_contact));
    // 入射線が水平線から何度かを計算
    var incident_rad = Math.atan2(startY - posY, startX - posX);

    // 反射する方向を導く
    angle1 = incident_rad*180/Math.PI;
    angle2 = Math.atan2(new BigNumber(canvas.canvas_height/2).minus(posY), new BigNumber(x1).plus(marginX).plus(r).minus(posX))*180/Math.PI;
    if ((angle1 < 0 && angle2 >= 0) || (angle1 >= 0 && angle2 < 0)) {
      if (Math.cos(rad) > 0) {
        if (angle2 < 0) {
          rad = (360 - incident_rad*180/Math.PI - incident_angle*180/Math.PI*2)/180*Math.PI;
        } else {
          rad = (360 - incident_rad*180/Math.PI + incident_angle*180/Math.PI*2)/180*Math.PI;
        }
      } else {
        if (angle2 < 0) {
          rad = (360 - incident_rad*180/Math.PI + incident_angle*180/Math.PI*2)/180*Math.PI;
        } else {
          rad = (360 - incident_rad*180/Math.PI - incident_angle*180/Math.PI*2)/180*Math.PI;
        }
      }
    } else {
      if (angle1 > angle2) {
        rad = (360 - incident_rad*180/Math.PI + incident_angle*180/Math.PI*2)/180*Math.PI;
      } else {
        rad = (360 - incident_rad*180/Math.PI - incident_angle*180/Math.PI*2)/180*Math.PI;
      }
    }
    rad = new BigNumber(rad).round(5);

    startX = new BigNumber(posX);
    startY = new BigNumber(posY);

    count++;
  }
}

function drawEllipse() {
  BigNumber.config({ ERRORS: false });

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
  var marginX = new BigNumber(canvas.canvas_width).minus(canvas.ellipse_width).div(2);
  var marginY = new BigNumber(canvas.canvas_height).div(2).minus(new BigNumber(120));
  var posX = new BigNumber(marginX).plus(new BigNumber(start_position).times(canvas.ellipse_width));
  var posY = new BigNumber(canvas.canvas_height).div(2);
  var rad = new BigNumber(angle).div(180).times(Math.PI);
  var moveX = Math.cos(rad);
  var moveY = Math.sin(rad);

  var a = new BigNumber(canvas.ellipse_width).div(2); // 長径
  var b = new BigNumber(120); // 短径
  var f = Math.sqrt(Math.pow(canvas.ellipse_width/2, 2) - Math.pow(120, 2)); // 焦点

  var startX = posX;
  var startY = posY;

  var reflect_flag = false;
  var flag = false;

  var x;
  // 出発位置が焦点かどうかを確認
  if (new BigNumber(posX).toFixed(10) == new BigNumber(canvas.canvas_width/2).plus(f).toFixed(10)) {
    flag = true;
    x = -1 * f;
  } else if (new BigNumber(posX).toFixed(10) == new BigNumber(canvas.canvas_width/2).minus(f).toFixed(10)) {
    flag = true;
    x = f;
  }

  while(true) {
    if (count > reflection) {
      break;
    }

    var angle = rad * 180 / Math.PI;
    if (angle % 90 == 0) {
      // 角度が90度, 270度の場合にはtan()で計算できないため場合分け
      posX = new BigNumber(startX).minus(marginX).minus(a);

      // 方程式を解く
      var ans1 = new BigNumber(Math.pow(b, 2)).minus(new BigNumber(Math.pow(b, 2)).times(Math.pow(posX, 2)).div(Math.pow(a, 2))).squareRoot();
      var ans2 = new BigNumber(ans1).times(-1);

      if (angle % 270 == 0) {
        if (ans1.gt(ans2)) {
          posY = ans2;
        } else {
          posY = ans1;
        }
      } else {
        if (ans1.gt(ans2)) {
          posY = ans1;
        } else {
          posY = ans2;
        }
      }
      posX = new BigNumber(posX).plus(a).plus(marginX);
      posY = new BigNumber(b).minus(posY).plus(marginY);
    } else {
      var x1;
      var y1;

      if (flag && count > 0) {
        // 最初の出発点が焦点の場合、通る一点を必ず他方の焦点に設定
        x1 = new BigNumber(x);
        y1 = new BigNumber(0);
        x *= -1;
      } else {
        // それ以外
        x1 = new BigNumber(startX).minus(marginX).minus(a);
        y1 = new BigNumber(b).minus(startY).plus(marginY);
      }

      // 楕円の方程式と1点を通る直線の方程式からxを解く
      var m = new BigNumber(Math.tan(rad));
      var alpha = new BigNumber(Math.pow(b, 2)).plus(new BigNumber(Math.pow(a, 2)).times(Math.pow(m, 2)));
      var beta = new BigNumber(-2).times(Math.pow(a, 2)).times(new BigNumber(Math.pow(m, 2)).times(x1).minus(new BigNumber(m).times(y1)));
      var ganma = new BigNumber(Math.pow(a, 2)).times(new BigNumber(Math.pow(m, 2)).times(Math.pow(x1, 2)).minus(new BigNumber(2).times(m).times(x1).times(y1)).plus(Math.pow(y1, 2)).minus(Math.pow(b, 2)));

      var sqrt = new BigNumber(Math.pow(beta, 2)).minus(new BigNumber(4).times(alpha).times(ganma)).squareRoot();
      // 導き出したx座標(2次方程式なので答えは2つ), 解の公式を使ってるだけ
      var ans1 = new BigNumber(-1).times(beta).plus(sqrt).div(new BigNumber(2).times(alpha));
      var ans2 = new BigNumber(-1).times(beta).minus(sqrt).div(new BigNumber(2).times(alpha));

      // 傾きが右方向の場合
      if (Math.cos(rad) > 0) {
        if (ans1.gt(ans2)) {
          posX = ans1;
        } else {
          posX = ans2;
        }
      } else {
        if (ans2.gt(ans1)) {
          posX = ans1;
        } else {
          posX = ans2;
        }
      }
      posY = new BigNumber(m).times(new BigNumber(posX).minus(x1)).plus(y1);

      // posX, posYをcanvas内の座標に戻す
      posX = new BigNumber(posX).plus(a).plus(marginX);
      posY = new BigNumber(b).minus(posY).plus(marginY);
    }
    context_left.beginPath();
    context_left.moveTo(startX, startY);
    context_left.lineTo(posX, posY);
    context_left.stroke();

    // ここから先は入射角, 反射角の計算
    var x0 = (posX - marginX) - a;
    var y0 = b - (posY - marginY);
    var x1 = x0 - x0 * (Math.pow(b, 2) / Math.pow(a, 2)); // 法線を引いたときのx座標(y座標の値は0)
    var x2 = (startX - marginX) - a;
    var y2 = b - (startY - marginY);

    // 3点から三角形のそれぞれの辺の長さを導く
    var dist_contact_to_x1 = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - 0, 2));
    var dist_start_to_contact = Math.sqrt(Math.pow(x2 - x0, 2) + Math.pow(y2 - y0, 2)); // 出発位置から接点への距離
    var dist_start_to_x1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - 0, 2));

    // 余弦定理を使って入射角の計算
    var incident_angle = Math.acos((Math.pow(dist_contact_to_x1, 2) + Math.pow(dist_start_to_contact, 2) - Math.pow(dist_start_to_x1, 2)) / (2 * dist_contact_to_x1 * dist_start_to_contact));
    // 入射線が水平線から何度かを計算
    var incident_rad = Math.atan2(startY - posY, startX - posX);

    if (count == 0 && Math.abs(x2) > f) {
      reflect_flag = true;
    }

    // 反射する方向を導く
    angle1 = incident_rad*180/Math.PI;
    angle2 = Math.atan2(new BigNumber(canvas.canvas_height/2).minus(posY), new BigNumber(x1).plus(marginX).plus(a).minus(posX))*180/Math.PI;
    if ((angle1 < 0 && angle2 >= 0) || (angle1 >= 0 && angle2 < 0)) {
      if (Math.cos(rad) > 0) {
        if (angle2 < 0) {
          rad = (360 - incident_rad*180/Math.PI - incident_angle*180/Math.PI*2)/180*Math.PI;
        } else {
          rad = (360 - incident_rad*180/Math.PI + incident_angle*180/Math.PI*2)/180*Math.PI;
        }
      } else {
        if (angle2 < 0) {
          rad = (360 - incident_rad*180/Math.PI + incident_angle*180/Math.PI*2)/180*Math.PI;
        } else {
          rad = (360 - incident_rad*180/Math.PI - incident_angle*180/Math.PI*2)/180*Math.PI;
        }
      }
    } else {
      if (angle1 > angle2) {
        rad = (360 - incident_rad*180/Math.PI + incident_angle*180/Math.PI*2)/180*Math.PI;
      } else {
        rad = (360 - incident_rad*180/Math.PI - incident_angle*180/Math.PI*2)/180*Math.PI;
      }
    }
    rad = new BigNumber(rad).round(5);

    startX = new BigNumber(posX);
    startY = new BigNumber(posY);

    count++;
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
