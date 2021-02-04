
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var color = "Red"
var SnowmenPosition = "RT"
var cl__ = 0;

var RightCount = 0 ;
var ErrCount = 0 ;
var modeV     = 'N';
var ansver     = 0 ;
var argX       = 0 ;
var argY       = 0 ;
var rightdirection = '';

var positionlistRT = []
var positionlistLT = []

var positionlistRD = []
var positionlistLD = []

var allSnowball  = []
// получить массив для доски
var getmassiv = function(direction)
{
 if (direction === "RT") {   return  positionlistRT; }
 else
 if (direction === "LT") {   return positionlistLT; }
 else
 if (direction === "RD") {  return positionlistRD; }
 else {  return positionlistLD; }
}
// заполнить массивыи из координат по которым катятся снежки  для каждого направления свой
var allball = function (){
 var y, x;

 for (var i = 0 ; i < 330  ; i= i+42  )
 {
   y = 30+ Math.floor(0.2 *i);
   positionlistLT.push({x:i,y:y});
 }
 for (var i = 0 ; i < 330  ; i= i+42  )
 {
   y = 262 +  Math.floor(0.2 *i);
   positionlistLD.push({x:i,y:y});
 }

 for (var i = 0 ; i < 330  ; i= i+42  )
 {
   x = 990 - i;
   y = 32 +  Math.floor(0.2 *(i));
   positionlistRT.push({x:x,y:y});
 }
 for (var i = 0 ; i < 330  ; i= i+42  )
 {
   x = 990 - i;
   y = 262 +  Math.floor(0.2 *(i));
   positionlistRD.push({x:x,y:y});
 }
}

// вызов функции заполнения массива
allball();

// начальная картинка
var image = document.getElementById('IMJ_RT');
ctx.drawImage(image, 0, 0);


// функция нарисовать окружность
var circle = function (x, y, radius, fillCircle) {
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2, false);
if (fillCircle) {ctx.fill();} else {ctx.stroke();}
};

////////////////////////////////////////////////////////////////////////////////////////
//Снежок знает по какой доске катится direction и на какой позиции находится  position number - изображенное число
///////////////////////////////////////////////////////////////////////////////////////
var SnowBall = function (pos, direction , number) {
this.position  = pos;
this.direction = direction;
this.number     = number; 
};
// снежок себя рисует
SnowBall.prototype.draw = function () 
{
 var pnt = {};
 var pntprv = {x:0, y :0};
 var mas = getmassiv(this.direction);

 
 if (this.position == -1)
 {
   pntprv = mas[mas.length-1];
 }
 else
 {
   pnt = mas[this.position];
   if (this.position > 0 )
     pntprv = mas[this.position-1];
 }

 if ((this.position < 0)|| (this.position > 0))
 { // clean previous
   ctx.lineWidth    = 3;
   ctx.strokeStyle  = "White";
   ctx.fillStyle  = "White";

   circle(pntprv.x,pntprv.y , 20, true);
   circle(pntprv.x,pntprv.y , 20, false);
 }
 if (this.position> 0 )
 {
   ctx.lineWidth    = 2;
   ctx.strokeStyle  = "blue";

   circle(pnt.x,pnt.y , 20);

   if (modeV == 'V')
   {
     ctx.fillStyle  = "black";
     ctx.font = "18px Arial";
     ctx.textBaseline = "middle";
     ctx.textAlign    = "center";

     ctx.fillText(this.number,pnt.x,pnt.y) ;
   }

 }
}

// перемещение к краю доски
SnowBall.prototype.tonextPose = function () {
 var mas = getmassiv(this.direction);
 if (this.position > -1)
 {
 if (this.position+ 1 >= mas.length)
 {
   this.position = -1;
   if (modeV == 'N')
   {
   if (this.direction  == SnowmenPosition)
     RightCount++;
   else
     ErrCount++;
   }
 }
 else
   this.position++;

 this.draw();
 }
 return this.position;
}

/////////////////////////////////////////////////////////////////////////////////////////////


// отобразить очки
function drawScore() {
var board = document.getElementById('score1');
    board.innerHTML =   RightCount;
//    board.innerHTML = 'Cautch snowball : '+RightCount + 'Lost snowball: ' + ErrCount ;
var board = document.getElementById('score2');
    board.innerHTML = ErrCount ;

}

// создать новый снежок для заданного направления в обычном режиме работы
var generateSnowBall = function ()
{
 var i  = Math.floor(Math.random()*4);
 var direction
 if (i==0)
  direction = "LT"
 else
  if (i==1)
    direction = "RT"
 else
  if (i==2)
    direction = "LD"
 else
  if (i==3)
    direction = "RD";

 var bl = new  SnowBall(0, direction, 0);

 allSnowball.push(bl);
 bl.draw();
}

 /// обычный режим, функция вызывается каждую скунду
var fNormalMode  = function () {
 var curpos = 0;
 var remove =  false;

 for (var i = 0; i < allSnowball.length ; i++)
 {
   curpos = allSnowball[i].tonextPose();
   if (curpos === -1) // ball down now
   {
     //check result
     remove = true;
	 
	 if (allSnowball[i].direction  != SnowmenPosition)
	 if ((allSnowball[i].direction) == "LT" || 
	 (allSnowball[i].direction) == "LD")
	 {
	   image = document.getElementById('BAZZ');
       ctx.drawImage(image, 300, 550); 
	 }
	 else
	 {
	   image = document.getElementById('BAZZ');
       ctx.drawImage(image, 700, 550); 
	 }
	 
	 
     if (ErrCount ==5)
     {
       clearInterval(timerset);
       image = document.getElementById('IMJ_END');
       ctx.drawImage(image, 0, 0);

     }

   }
 }
 if (remove)
      allSnowball.shift();


 if (cl__ === 0)
 {
   generateSnowBall();
   cl__ ++;
 }
 else
 { cl__++;
   if (cl__ > 2)  cl__ = 0;
 }
 drawScore();

} 

// запуск таймера
var timerset =  setInterval(fNormalMode,1000 )




// рисует пример на снеговике
var dravprimer = function ()
{
  var strprimer = argX + " * " + argY+ " = ?";

  ctx.fillStyle = "White";
  ctx.fillRect(432,450, 140,70);

  ctx.textBaseline = "middle";
  ctx.textAlign    = "center";
  ctx.font = "30px Arial";
  ctx.fillStyle = "Blue";
  ctx.fillText(strprimer , 500, 490);

}
// функция выполняется каждую секунду в режими "таблица умножения"
var ClockVMode  = function () {
  var curpos = 0;
  var remove =  false;

  for (var i = 0; i < allSnowball.length ; i++)
  {
    curpos = allSnowball[i].tonextPose();
    if ((curpos === -1) && (!remove)) // ball down now
    {
      //check result
     remove = true;
     if (rightdirection  == SnowmenPosition)
       RightCount++;
     else
       ErrCount++;

 
     if (ErrCount == 5)
     {
       clearInterval(timerset);
       
       image = document.getElementById('IMJ_END');
       ctx.drawImage(image, 0, 0);

     }
    }
  }

 if (remove && ErrCount < 5)   // почистить все и запустить следующий  пример
 {
  allSnowball.splice(0);
  generateSnowBallV();
  dravprimer();

 }

 drawScore();
 dravprimer();


}
// создать 4 снежка в режиме умножения
var generateSnowBallV = function ()
{
 var i  = Math.floor(Math.random()*10)+1;
 var j  = Math.floor(Math.random()*10)+1;
 var k 
 ansver  = i * j;
 argX = i;
 argY = j;

 var dr  = Math.floor(Math.random()*4);

 var direction
 if (dr==0)
  direction = "LT"
 else
  if (dr==1)
    direction = "RT"
 else
  if (dr==2)
    direction = "LD"
 else
  if (dr==3)
    direction = "RD";

 // направление на котором шар с правлиьным ответом
 rightdirection  = direction ;

 var bl = new  SnowBall(1, direction, ansver);
 allSnowball.push(bl);
 bl.draw();

 if (!(direction =="LT"))
 {
   k  = Math.floor(Math.random()*100);
   bl = new  SnowBall(1, "LT", k);
   allSnowball.push(bl);
   bl.draw();
 }

 if (!(direction =="RT"))
 {
   k  = Math.floor(Math.random()*100);
   bl = new  SnowBall(1, "RT", k);
   allSnowball.push(bl);
   bl.draw();
 }


 if (!(direction =="LD"))
 {
   k  = Math.floor(Math.random()*100);
   bl = new  SnowBall(1, "LD", k);
   allSnowball.push(bl);
   bl.draw();
 }


 if (!(direction =="RD"))
 {
   k  = Math.floor(Math.random()*100);
   bl = new  SnowBall(1, "RD", k);
   allSnowball.push(bl);
   bl.draw();
 }
}


// рисуетт все существующие шарики
var drawall = function ()
{
 for (var i = 0; i < allSnowball.length ; i++)
 {
   allSnowball[i].draw();
 }


}

var MultMode  = function() {
  if (modeV == 'N')
    modeV     = 'V';
  else
    modeV      = 'N'

  clearInterval(timerset);
  allSnowball.splice(0);
  RightCount = 0;
  ErrCount =   0;
  drawScore();
  image = document.getElementById('IMJ_RT');
  SnowmenPosition = "RT";

  ctx.drawImage(image, 0, 0);

  if (modeV     == 'V' )
  {
    generateSnowBallV();
    dravprimer();
    timerset =  setInterval(ClockVMode ,1000);
  }
  else
  {
    timerset =  setInterval(fNormalMode,1000 )
  }
}




mode.onclick =   MultMode;


// обработчик нажатия клавиш
document.onkeydown = function(event) {
//right
if(event.keyCode==106)
{
  MultMode() ;
};

if (ErrCount ==5) return;


if(event.keyCode==39 && SnowmenPosition[0] === "L") 
{
  if (SnowmenPosition == "LT")
  {
    image = document.getElementById('IMJ_RT');
    ctx.drawImage(image, 0, 0);
    SnowmenPosition = "RT"
  }
  else
  {
    image = document.getElementById('IMJ_RD');
    ctx.drawImage(image, 0, 0);
    SnowmenPosition = "RD"
  }
}
else //left
if(event.keyCode==37 && SnowmenPosition[0] === "R")
{
  if (SnowmenPosition == "RT" )
  {
    image = document.getElementById('IMJ_LT');
    ctx.drawImage(image, 0, 0);
    SnowmenPosition = "LT"
  }
  else
  {
    image = document.getElementById('IMJ_LD');
    ctx.drawImage(image, 0, 0);
    SnowmenPosition = "LD"
  }

}
else  //DOWN
if(event.keyCode==40 && SnowmenPosition[1] === "T")
{
  if (SnowmenPosition == "RT" )
  {
    image = document.getElementById('IMJ_RD');
    ctx.drawImage(image, 0, 0);
    SnowmenPosition = "RD"
  }
  else
  {
    image = document.getElementById('IMJ_LD');
    ctx.drawImage(image, 0, 0);
    SnowmenPosition = "LD"
  }


}
else     //TOP
if(event.keyCode==38 && SnowmenPosition[1] === "D")
{
  if (SnowmenPosition == "RD")
  {
    image = document.getElementById('IMJ_RT');
    ctx.drawImage(image, 0, 0);
    SnowmenPosition = "RT"
  }
  else
  {
    image = document.getElementById('IMJ_LT');
    ctx.drawImage(image, 0, 0);
    SnowmenPosition = "LT"
  }

}
 drawall();
 if (modeV     == 'V')
   dravprimer();

}