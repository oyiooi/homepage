var ws = new WebSocket('ws://49.235.72.75:88');
var input = document.getElementById('input');
var talkArea = document.querySelector('.talkArea');
var swipper = document.querySelector('.swipper');
var p1 = document.querySelector('.p1');
var p2 = document.querySelector('.p2');
var p3 = document.querySelector('.p3');
var p4 = document.querySelector('.p4');
var width = window.innerWidth;
var x;
var position2x = parseFloat(window.getComputedStyle(p2).left);
var position1x = parseFloat(window.getComputedStyle(p1).left);
var position3x = parseFloat(window.getComputedStyle(p3).left);
var position4x = position2x;
var d1 = position2x-position1x;
var d2 = position3x-position2x;
var ary=[p1,p2,p3,p4];
var indexer = document.querySelector('.indexer');
var c1 = document.getElementById('c1');
var c2 = document.getElementById('c2');
var c3 = document.getElementById('c3');
var tr = document.querySelector('.tr');
var tl = document.querySelector('.tl');
var timer;
var back = document.querySelector('.back');
var container = document.querySelector('.container');
var part1 = document.getElementById('part1');

//indexer
indexer.addEventListener('click',function(e){
    switch(e.target.id){
        case 'c1':
            e.target.classList.add('focus'),c2.classList.remove('focus'),c3.classList.remove('focus'),part1.scrollIntoView(false);
            break;
        case 'c2':
            e.target.classList.add('focus'),c1.classList.remove('focus'),c3.classList.remove('focus'),part2.scrollIntoView(false);
            break;
        case 'c3':
            e.target.classList.add('focus'),c1.classList.remove('focus'),c2.classList.remove('focus'),part3.scrollIntoView(false);
            break;
        default:
            console.log('default');
    }
})

//part1 back star
var cx,cy;
var h = window.innerHeight;

function computedZ(z){
    var zarray = z.split(',');
    return parseFloat(zarray[14]);
}

container.addEventListener('touchstart',function(e){
    cy = e.touches[0].clientY;    
})

container.addEventListener('touchmove',function(e){
    e.stopPropagation();
    e.preventDefault();
    var z = window.getComputedStyle(back).transform;
    var currentz = computedZ(z);
    var dz = e.touches[0].clientY - cy;
    var zp = dz/h;
    cy = e.touches[0].clientY;
    if((currentz<-460&&dz<0)|(currentz>0&&dz>0)) return;
    back.style.transform='translateZ(' + (currentz + 500*zp) + 'px)';   
})

//star color change
var colorArray = ['black','#d8aa1e','#c613ec','#38d957','#e31754']

function changeC(){
    var nodes = back.children;
    let colorIndex = Math.floor(Math.random(0,1)*colorArray.length);
    var chosedColor = colorArray[colorIndex]
    for (node of nodes){
        node.style.borderColor = chosedColor;
    }
}

setInterval(changeC,200);

//wheel 事件
container.addEventListener('wheel',function(e){
    e.preventDefault();
    e.stopPropagation();
    var z = window.getComputedStyle(back).transform;
    var cz = computedZ(z);
    if(e.deltaY<0){
        if(cz<-270) return;
        back.style.transform = 'translateZ(' + (cz - 100) + 'px)';
    }

    if(e.deltaY>0){
        if(cz>0) return;
        back.style.transform = 'translateZ(' + (cz + 100) + 'px)';
    }
})

//swipper

function forward(array){
    var firstone = array.shift();
    array.push(firstone);
}

function goback(array){
    var lastone = array.pop();
    array.unshift(lastone);
}

swipper.addEventListener('touchstart',function(event){
    clearInterval(timer);
    x=event.touches[0].clientX;
})

swipper.addEventListener('touchmove',function(event){
    event.preventDefault();
    event.stopPropagation();
    var dx = event.touches[0].clientX - x; 
    var per = dx/width;
    if(Math.abs(per)>1) return;
    var transform2 = 'rotateY('+ (-45*per)+'deg)'+ ' '+'translateZ('+(100-200*Math.abs(per))+'px)';
    var transform1 = 'rotateY('+ (45-45*Math.abs(per))+'deg)'+' '+'translateZ('+(per>0?(-100+200*per):(-100+100*per))+'px)';
    console.log(transform1);
    var transform3 = 'rotateY('+(-45 + 45*Math.abs(per)) +'deg)'+' '+'translateZ('+(per>0?(-100-100*Math.abs(per)):(-100+200*Math.abs(per)))+'px)';
    var transform4 = 'rotateY('+(45*per)+'deg)' + ' ' + 'translateZ(' + (-200+100*Math.abs(per)) +'px)';
    if(per>0){
        ary[0].style.zIndex=3;
        ary[1].style.zIndex=2;
        ary[2].style.zIndex=1;
        ary[3].style.zIndex=0;
    }
    if(per<0){
        ary[0].style.zIndex=0;
        ary[1].style.zIndex=2;
        ary[2].style.zIndex=3;
        ary[3].style.zIndex=1;
    }
    ary[0].style.left=(position1x+d1*Math.abs(per))+'px';
    ary[0].style.transform=transform1;
    ary[3].style.left=(position4x-(per>0?(d2*per):(d1*per))) + 'px';
    ary[3].style.transform=transform4;
    ary[2].style.transform=transform3;
    ary[2].style.left=(position3x-d2*Math.abs(per)) + 'px'; 
    ary[1].style.transform= transform2;
    ary[1].style.left=(position2x+d1*per)+'px'; 
})
  
swipper.addEventListener('touchend',function(event){
    var endper = (event.changedTouches[0].clientX - x)/width;
    if(endper<=-0.5){
        forward(ary);
    }
    if(endper>=0.5){
        goback(ary);
    }
    ary[1].style.zIndex=2;
    ary[0].style.zIndex=1;
    ary[2].style.zIndex=1;
    ary[3].style.zIndex=0;
    ary[0].style.left='-5%';
    ary[0].style.transform='rotateY(45deg) translateZ(-100px)';
    ary[1].style.left='15%';
    ary[1].style.transform = 'translateZ(100px)';
    ary[2].style.left='35%';
    ary[2].style.transform = 'rotateY(-45deg) translateZ(-100px)';
    ary[3].style.left='15%';
    ary[3].style.transform = 'translateZ(-200px)';
    set();
})

//arrow click handler
function toleft(){
    forward(ary);
    ary[1].style.zIndex=2;
    ary[0].style.zIndex=1;
    ary[2].style.zIndex=1;
    ary[3].style.zIndex=0;
    ary[0].style.left='-5%';
    ary[0].style.transform='rotateY(45deg) translateZ(-100px)';
    ary[1].style.left='15%';
    ary[1].style.transform = 'translateZ(100px)';
    ary[2].style.left='35%';
    ary[2].style.transform = 'rotateY(-45deg) translateZ(-100px)';
    ary[3].style.left='15%';
    ary[3].style.transform = 'translateZ(-200px)';
}

function toright(){
    goback(ary);
    ary[1].style.zIndex=2;
    ary[0].style.zIndex=1;
    ary[2].style.zIndex=1;
    ary[3].style.zIndex=0;
    ary[0].style.left='-5%';
    ary[0].style.transform='rotateY(45deg) translateZ(-100px)';
    ary[1].style.left='15%';
    ary[1].style.transform = 'translateZ(100px)';
    ary[2].style.left='35%';
    ary[2].style.transform = 'rotateY(-45deg) translateZ(-100px)';
    ary[3].style.left='15%';
    ary[3].style.transform = 'translateZ(-200px)';
}

function trhandler(){
    clearInterval(timer);
    toright();
    set();
}

function tlhandler(){
    clearInterval(timer);
    toleft();
    set();
}

tr.addEventListener('click',trhandler);
tl.addEventListener('click',tlhandler);
//定时器
function set(){
    timer = setInterval(function(){
        tlhandler()
    },3000)
}

set();

//part2 no scroll
var part2 = document.getElementById('part2');
part2.addEventListener('wheel',function(event){
    event.preventDefault();
    event.stopPropagation();
})
//part3 no scroll

var part3 = document.getElementById('part3');
part3.addEventListener('wheel',function(event){
    event.preventDefault();
    event.stopPropagation();
})
part3.addEventListener('touchmove',function(e){
    e.preventDefault();
    e.stopPropagation();
})

var inputC = document.querySelector('.inputC');

input.addEventListener('focus',function(){
    inputC.classList.remove('blink')
})

input.addEventListener('blur',function(){
    inputC.classList.add('blink')
})

//聊天室
input.addEventListener('keydown',function(event){
    if(event.keyCode=== 13){
        const value = input.value;
        input.value = '';
        if(value===''){
            return 
        }else{
            if(localStorage.getItem('oyid')){
                ws.send(JSON.stringify({
                    id: localStorage.getItem('oyid'),
                    message: value,
                    type: 'message'
                }))
            }else{
                ws.send(JSON.stringify({
                    type: 'assign',
                    message: value
                }))
            }
        }
    }
})

ws.onmessage=function(event){
   let data = JSON.parse(event.data);
   if(data.type==='assign'){
       localStorage.setItem('oyid',data.id)
   }else{
       let node = document.createElement('div');
       node.className='sentence';
       node.innerHTML="<div class='name'>编号"+data.id+":</div><div class='saying'>"+data.message+"</div>"
       talkArea.appendChild(node);
       console.log(talkArea)
   }
}

ws.onopen = function(){
    console.log('已连接')
}

