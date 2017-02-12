/* 雷达图组件对象 */

var H5ComponentRadar =function ( name, cfg ) {
  var component =  new H5ComponentBase( name ,cfg );
  
  //  绘制网格线 - 背景层
  var w = cfg.width;
  var h = cfg.height;

  //  加入一个画布（网格线背景）
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height =h;
  component.append(cns);

  var r = w/2;
  var step = cfg.data.length;


  //  计算一个圆周上的坐标（计算多边形的顶点坐标）
  //  已知：圆心坐标(a,b)、半径 r；角度deg。
  //  rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i
  //  x = a + Math.sin( rad ) * r;
  //  y = b + Math.cos( rad ) * r;

  //  绘制网格背景（分面绘制，分为10份）
  var isBlue = false;
  for( var s = 10;s >0 ;s--){

    ctx.beginPath();
    for( var i=0;i<step;i++){
      var  rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i;

      var x = r + Math.sin( rad ) * r * (s/10);
      var y = r + Math.cos( rad ) * r * (s/10);
      ctx.lineTo(x,y);    
    }
    ctx.closePath();
    ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#f1f9ff';
    ctx.fill();
  }

  //   绘制伞骨
  for(var i = 0;i<step;i++){
    var  rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i;

    var x = r + Math.sin( rad ) * r ;
    var y = r + Math.cos( rad ) * r ;
    ctx.moveTo(r,r);
    ctx.lineTo(x,y);
    //  输出项目文字
    var text = $('<div class="text">');
    text.text( cfg.data[i][0] );
    text.css('transition','all .5s '+ i*.1 + 's');

    if( x > w/2 ){
     text.css('left',x/2+5);
    }else{
     text.css('right',(w-x)/2+5);
    }

    if( y > h/2){
      text.css('top',y/2+5);
    }else{
      text.css('bottom',(h-y)/2+5);
    }
    if( cfg.data[i][2] ){
      text.css('color',cfg.data[i][2])
    }
    text.css('opacity',0);

    component.append(text);

  }
  ctx.strokeStyle = '#e0e0e0';
  ctx.stroke();

  //  数据层的开发
  //  加入一个画布（数据层）
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height =h;
  component.append(cns);

  ctx.strokeStyle = '#f00';

  var draw = function( per ){

    if(per <= 1){
        component.find('.text').css('opacity',0);
    }
    if(per >= 1){
        component.find('.text').css('opacity',1);
    }
    
    ctx.clearRect(0,0,w,h);

    //  输出数据的折线
    for(var i=0;i<step;i++){
      var rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i;
      
      var rate  = cfg.data[i][1] * per;

      var x = r + Math.sin( rad ) * r * rate;
      var y = r + Math.cos( rad ) * r * rate ;

      ctx.lineTo(x,y);
   
    }
    ctx.closePath();
    ctx.stroke();

    //  输出数据的点
    ctx.fillStyle = '#ff7676';
    for(var i=0;i<step;i++){
      var rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i;
      
      var rate  = cfg.data[i][1] * per ;

      var x = r + Math.sin( rad ) * r * rate;
      var y = r + Math.cos( rad ) * r * rate ;

      ctx.beginPath();
      ctx.arc(x,y,5,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }


  }

  component.on('onLoad',function(){
    //  雷达图生长动画
      var s = 0;
      for( i=0;i<100;i++){
        setTimeout(function(){
            s+=.01;
            draw(s);
        },i*10+500);
      }
  });
   component.on('onLeave',function(){
    //  雷达图退场动画
      var s = 1;
      for( i=0;i<100;i++){
        setTimeout(function(){
            s-=.01;
            draw(s);
        },i*10);
      }
  });
  

  return component;
}