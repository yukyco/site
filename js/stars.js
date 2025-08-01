
<!-- 星のスクリプト -->
 
const NUM = 20;
const SIZE = 0.006;
const SPEED = 0.06;
const SCREEN_ROTATION = 0.2;

const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

function Matrix3() {}
Matrix3.prototype = {
  0:1,1:0,2:0,3:0,4:1,5:0,6:0,7:0,8:1,
  mul: function() {
    var a = this, b = arguments, c = new Matrix3();
    c[0]=a[0]*b[0]+a[1]*b[3]+a[2]*b[6];
    c[1]=a[0]*b[1]+a[1]*b[4]+a[2]*b[7];
    c[2]=a[0]*b[2]+a[1]*b[5]+a[2]*b[8];
    c[3]=a[3]*b[0]+a[4]*b[3]+a[5]*b[6];
    c[4]=a[3]*b[1]+a[4]*b[4]+a[5]*b[7];
    c[5]=a[3]*b[2]+a[4]*b[5]+a[5]*b[8];
    c[6]=a[6]*b[0]+a[7]*b[3]+a[8]*b[6];
    c[7]=a[6]*b[1]+a[7]*b[4]+a[8]*b[7];
    c[8]=a[6]*b[2]+a[7]*b[5]+a[8]*b[8];
    return c;
  },
  rx: function(t){ var c=Math.cos(t),s=Math.sin(t); return this.mul(1,0,0,0,c,-s,0,s,c); },
  ry: function(t){ var c=Math.cos(t),s=Math.sin(t); return this.mul(c,0,s,0,1,0,-s,0,c); },
  rz: function(t){ var c=Math.cos(t),s=Math.sin(t); return this.mul(c,-s,0,s,c,0,0,0,1); }
};

function Point3d() {}
Point3d.prototype = {
  x:0, y:0, z:0,
  rotate: function(m){
    var p=new Point3d();
    p.x=m[0]*this.x+m[1]*this.y+m[2]*this.z;
    p.y=m[3]*this.x+m[4]*this.y+m[5]*this.z;
    p.z=m[6]*this.x+m[7]*this.y+m[8]*this.z;
    return p;
  }
};

function random(n){
  for(var i=0;i<6;i++){ n^=n<<3; n^=n>>2; }
  return (n&0xffffff)/0x1000000;
}

function draw(ctx) {
  const t = new Date() / 1000;
  const r = new Matrix3().ry(-t * 0.123).rx(0.8).rz(SCREEN_ROTATION);
  const k = 1 + 1 / NUM;

  for (let i = 0; i < NUM; i++) {
    let j = t * SPEED + i * k;
    let p = new Point3d();
    p.x = random(j); p.y = j % 1; p.z = random(j + 10000);
    p.x -= 0.5; p.y -= 0.5; p.z -= 0.5;
    p.y *= -5;
    p = p.rotate(r);
    p.x += Math.sin(t * 0.1 + i) * 0.2;
    p.z += 0.5;

    if (p.z <= 0) continue;

    ctx.save();
    ctx.globalAlpha = 1 / (p.z + 1.2);
    ctx.translate(p.x / p.z, p.y / p.z);
    ctx.scale(SIZE / p.z, SIZE / p.z);
    ctx.rotate(SCREEN_ROTATION);

    // 丸っこい星を描く
    ctx.beginPath();
    const rOuter = 2;
    const rInner = 0.9;
    for (let n = 0; n < 10; n++) {
      const angle = Math.PI * n / 5;
      const radius = n % 2 === 0 ? rOuter : rInner;
      const x = Math.sin(angle) * radius;
      const y = -Math.cos(angle) * radius;
      if (n === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const colors = [
      ['#ffffcc', '#ffccff'],
      ['#ccffff', '#ffffff'],
      ['#ffd700', '#fffacd'],
    ];
    const rand = Math.floor(Math.random() * colors.length);
    let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 3);
    grad.addColorStop(0, colors[rand][0]);
    grad.addColorStop(1, colors[rand][1]);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();
  }
}

function loop() {
  const scale = Math.max(canvas.width, canvas.height);

  // ✨ 残像処理で尾を残す（本文が暗くならないように工夫）
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  ctx.save();
  ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
  ctx.scale(scale, scale);
  draw(ctx);
  ctx.restore();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
setInterval(loop, 16);

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            if (!Array.isArray(data.holidays)) {
                alert("インポートデータの形式が正しくありません。");
                return;
            }

            holidays = data.holidays;
            saveData();  // localStorage に保存
            renderCalendar();  // カレンダー更新
            renderHolidaysList();  // 一覧更新
            alert("休みデータをインポートしました。");

        } catch (error) {
            alert("インポート中にエラーが発生しました: " + error.message);
        }
    };
    reader.readAsText(file);
}
