var file1, file2, file3;
//あらかじめ音声ファイルを読み込んでおく
function preload() {
  file1 = loadSound('data/HDG.wav');
  file2 = loadSound('data/symbal.wav');
  file3 = loadSound('data/tam.wav');
}
class Ball {

  constructor() {
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
    this.ySpeed = 1;
    this.radius = random(20) + 10;
    this.col = random(135, 210);
    this.alph = random(30, 80);
    this.mode = int(random(1, 3));
    this.modeRec = this.mode
    this.rate = 0;
    console.log("mode" + this.mode);
  }

  drawBall() {
    fill(this.col, 100, briAve, this.alph);
    circle(this.x, this.y, this.radius);
  }

  updateBall() {
    if (mouseY > 0 && mouseY < height) {
      this.rate = map(mouseY, 0, height, 7, 1);
    } else {
      this.ySpeed = 3;
      this.rate = 1;
    }
    this.y += this.ySpeed * this.rate;


    if (this.y > height - this.radius || this.y < 0 + this.radius) {
      this.ySpeed = this.ySpeed * (-1);
      this.mode = this.modeRec;
      print("return" + this.mode);

    }

    if (this.mode == 1) {
      file1.play();
      this.mode = 0;
      print("file1 played!");
    }

    if (this.mode == 2) {
      file2.play();
      this.mode = 0;
      print("file2 played!");
    }

    if (this.mode == 3) {
      file3.play();
      this.mode = 0;
      print("file3 played!");
    }
    this.drawBall();
  }
}

class Wave {

  constructor(_height, varerval) {
    this._height = _height;
    this.varerval = varerval;
    this.x = x; //x軸方向の進行
    this.col = int(random(140, 250));
    fill(this.col, 100, 100, 30);
  }

  run() {
    this.x += 0.008 + 0.3 * amp;
    this.display();
  }

  display() {
    noStroke();
    beginShape();
    vertex(-50, height - height / 3);
    for (var i = 0; i < width; i++) {
      vertex(i, sin(i / varerval + x) * this._height + height - height / 3);
    }
    vertex(width + 50, height - height / 3);
    vertex(width + 50, height);
    vertex(-50, height);
    endShape(CLOSE);
  }
}
//文字列の描画を制御するための変数
var inputText; //入力されたテキスト
var strArray = [];
var strCounter; //strArrayの要素番号を、ドラッグを受け取るたび一定間隔で指定していくための変数
var old_strCounter;
var dragCount; //ドラッグを受け取ったらカウント
var varerval; //ドラッグに応じた文字描画の時間感覚　でかいほどゆったり
var canvas;
//import java.util.ArrayList;

var cam; //カメラの定義
var micIn; // マイク
var amp; // 音量を取得してくれるもの


var wave, wave2;
var font = "sofia-pro";
var LENGTH = 16;
var num = 0;
var mode = 0;
var x, y; //カメラキャプチャ用
var briSum;
var briAve;
var briLev;
var size;
var count;
var startCount = 0;
var ascent;
var descent;
var textHeight;
var textPosY;

//p5.jsではArrayListを使うまでもなく配列が最強なので使わない
var ballArr = []/*new Array(num)*/;
var ball;

function setup() {
  canvas = createCanvas(360, 360);
  canvas.parent("P5canvas");
  capture = createCapture(VIDEO);
  capture.hide();
  capture.size(width, height);

  size = width * height;
  noStroke();
  textAlign(CENTER, TOP);
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(30);
  textFont(font);
  ascent = textAscent();
  descent = textDescent();
  textHeight = ascent + descent;
  textPosY = int(height - textHeight) / 2;


  mic = new p5.AudioIn();
  mic.start();
  amp = mic.getLevel();

  wave = new Wave(height / 20, 500);
  wave2 = new Wave(height / 40, 360);
}



function draw() {
  amp = mic.getLevel();
  if (startCount < 1) {
    refresh();
    if (mouseIsPressed) {
      help_prePlay();
    }
  } else {
    refresh2();

    if (capture.width > 0) {
      let img = capture.get(0, 0, capture.width, capture.height);
      img.loadPixels();
      //カメラで取り込んだ情報から明るさの平均値を取ってくる loadPixcelで対応
      for (var y = 0; y < img.height; y++) {
        for (var x = 0; x < img.width; x++) {
          let i = (y * img.width + x);
          const brightness = img.pixels[i * 4] / 255;

          let posX = x * width / img.width;
          let posY = y * height / img.height;
          briSum += brightness;
        }
      }
    }

    briAve = int(briSum * 100 / size); //明るさの平均値 processingの100倍
    print("brightness average" + briAve);
    briLev = map(briAve, 0, 100, 0, 3);
    //print(briLev*50);
    file1.rate(briLev);
    file2.rate(briLev);
    file3.rate(briLev);


    for (var i = 0; i < ballArr.length; i++) {
      ballArr[i].updateBall();
    }

    if (ballArr.length > LENGTH) {
      ballArr.shift();
      print("removed");
    }

    wave.run();
    wave2.run();

    briSum = 0; //大きくなりすぎないように

    if (mouseIsPressed) {
      help_playing();
    }

    if (ballArr.length < 1) {
      refresh();
    }
  }

  //console.log("amp"+amp); // 音量の数値をコンソールに出力
  if (amp * 5 > 0.4) {//processingの5倍
    generateBall();
    startCount++;
  }
}


//手を叩くとか大きめの音を検知したらボールを追加する
function generateBall() {
  ball = new Ball();
  ballArr.push(ball);
  print(ballArr.length);

}


function keyPressed() {
  if (ballArr.length > 0) {
    ///p5.js ではkeyではなくkeyCode
    if (keyCode === DELETE || keyCode === BACKSPACE) {
      ballArr.shift();
      print("key pressed and removed");
    }
  }
}



function refresh() { //blendModeを変えた時なぜかbackgroundの方を使わないと描画が後に残る
  noStroke();
  //fill(0, 0, briAve);
  fill(0, 0, 100, 100);
  rect(0, 0, width, height);
  fill(170, 90, 70, 100);
  textSize(60);
  text("Clap!", width / 2, textPosY - 50);
  textSize(20);
  text("- with brightness -", width / 2, textPosY + 20);
  textSize(16);
  text("Let's clap & move cursor on this window!", width / 2, textPosY + 80);
  textSize(16);
  text("Need help? Press your mouse!", width / 2, textPosY + 110);
}

function refresh2() {
  noStroke();
  fill(0, 0, 100, 100);
  rect(0, 0, width, height);
}


function help_prePlay() {
  noStroke();
  fill(0, 0, 0, 60);
  rect(0, 0, width, height);
  fill(0, 0, 100, 100);
  textSize(18);
  text("Instruction", width / 2, 220);
  textSize(12);
  text("If you clap, you can generate ball!", width / 2, 250);
  text("To reduce ball - Press DELETE or BACKSPACE key.", width / 2, 270);
  text("If your cursor positions high,", width / 2, 295);
  text("ball's bounce cycle be fast, and vice versa.", width / 2, 310);
  text("The more capture is brighter, the more sounds are higer!", width / 2, 330);
}

function help_playing() {
  noStroke();
  fill(0, 0, 0, 20);
  rect(0, 0, width, height);
  fill(0, 0, 100, 100);
  textSize(18);
  text("Instruction", width / 2, 220);
  textSize(12);
  text("If you clap, you can generate ball!", width / 2, 250);
  text("To reduce ball - Press DELETE or BACKSPACE key.", width / 2, 270);
  text("If your cursor positions high,", width / 2, 295);
  text("ball's bounce cycle be fast, and vice versa.", width / 2, 310);
  text("The more capture is brighter, the more sounds are higer!", width / 2, 330);
}






/*reference
Text Allign
https://qiita.com/akspect/items/14962dbe0b7d45627b4e
ArrayList to Array
https://java-reference.com/java_collection_arraylist.html
Wave
https://tofgame.hatenablog.com/entry/2019/05/16/235531*/