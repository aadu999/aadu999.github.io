// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
}

// the rest of this code is by John Weachock
// gtfo if you're cheating
Math.dist=function(dx,dy) {
	return Math.sqrt(dx*dx+dy*dy);
}

function mixColors(c1,c2,p) {
	var r=c1[0]*p+c2[0]*(1-p);
	var g=c1[1]*p+c2[1]*(1-p);
	var b=c1[2]*p+c2[2]*(1-p);
	return Math.round(r)+", "+Math.round(g)+", "+Math.round(b);
}
function RGB(r,g,b,a) {
	this.r=Math.round(r);
	this.g=Math.round(g);
	this.b=Math.round(b);
	if(a==undefined) a=1;
	this.a=a;
	this.v="rgb("+this.r+","+this.g+","+this.b+")";
	this.va="rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
}
RGB.black=new RGB(0,0,0);
RGB.white=new RGB(255,255,255);
function HSL(h,s,l) {
	this.h=h;
	this.s=s;
	this.l=l;
	this.v="hsl("+h+","+Math.round(s*100)+"%,"+Math.round(l*100)+"%)";
}
HSL.black=new HSL(0,0,0);
HSL.white=new HSL(0,0,1);
function f(t) {
	var x=16*Math.pow(Math.sin(t),3);
	var y=-1*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
	return [x,y];
}
function fx(t) {
	return (f(x))[0];
}
function fy(t) {
	return (f(x))[1];
}

function Surface() {
	this.canvas=document.getElementById("surface");
	if(this.canvas.getContext) {
		this.context=this.canvas.getContext("2d");
		this.canvas.width=window.innerWidth;
		this.canvas.height=window.innerHeight;
		this.width=parseInt(this.canvas.width);
		this.height=parseInt(this.canvas.height);

		this.state=0;
		this.keys=[];
		this.mouse=[];
		this.mx=0;
		this.my=0;

		this.elements=[];

		this.ready=0;
		this.balls=1000;
		var sides=this.balls/8;
		for(var a=0;a<this.balls;a++) {
			var t=a/this.balls*Math.PI*2;
			var z=f(t);
			var x=z[0];
			var y=z[1];
			x*=10;
			y*=10;
			x+=this.width/2;
			y+=this.height/2;

			var e=new lolball(this,new HSL(Math.round(a*360/this.balls),1,0.5),3);

			/* circle */
			var r=Math.min(this.height/2,this.width/2);
			e.setPos(this.width/2+r*Math.cos(t-Math.PI/2),this.height/2+r*Math.sin(t-Math.PI/2));
			/**/

			/* sides = balls/8 
			if(a<sides) e.setPos((1+a/sides)*this.width/2,0);
			else if(a<sides*3) e.setPos(this.width,(a-sides)/sides*this.height/2);
			else if(a<sides*5) e.setPos(this.width-(a-sides*3)/sides*this.width/2,this.height);
			else if(a<sides*7) e.setPos(0,this.height-(a-sides*5)/sides*this.height/2);
			else e.setPos((a-sides*7)/sides*this.width/2,0);
			/**/

			/* sides = balls/4
			if(a<sides) e.setPos(0,a/sides*this.height);
			else if(a<sides*2) e.setPos((a-sides)/sides*this.width,this.height);
			else if(a<sides*3) e.setPos(this.width,this.height-(a-sides*2)/sides*this.height);
			else if(a<this.balls) e.setPos(this.width-(a-sides*3)/sides*this.width,0);
			/**/

			e.setTarget(x,y);
			e.setDelay(a);
			e.setT(a);
			this.elements.push(e);
		}
	} else {
		alert("No <canvas> support.");
	}
}
Surface.prototype.stepEach=function(arr) {
	var i;
	var rem=[];
	for(i=0;i<arr.length;i++) {
		var o=arr[i];
		if(o && o.step && o.draw && o.dead) {
			o.step();
			o.draw();
			if(o.dead()) {
				if(o.destroy) o.destroy();
				rem.push(i);
			}
		}
	}
	for(i=0;i<rem.length;i++) {
		arr.remove(rem[i]);
	}
}
Surface.prototype.step=function() {
	if(this.state==0) this.state=1;
	this.canvas.width=window.innerWidth;
	this.canvas.height=window.innerHeight;
	this.width=parseInt(this.canvas.width);
	this.height=parseInt(this.canvas.height);

	this.context.clearRect(0,0,this.width,this.height);
	this.stepEach(this.elements);

	setTimeout("surface.step()",1);
}
Surface.prototype.scatter=function() {
	this.ready=0;
	for(var i=0;i<this.elements.length;i++) {
		var e=this.elements[i];
		e.ready=false;
		e.dx=Math.random()*30-15;
		e.dy=Math.random()*30-15;
	}
}
Surface.prototype.keyu=function(e) {
	this.keys[e.keyCode]=false;
}
Surface.prototype.keyd=function(e) {
	this.keys[e.keyCode]=true;
}
Surface.prototype.mouseu=function(e) {
	this.mouse[e.button]=false;
}
Surface.prototype.moused=function(e) {
	if(surface.state==0) surface.step();
	else if(surface.state==1) surface.scatter();
	this.mouse[e.button]=true;
}
Surface.prototype.mousem=function(e) {
	this.mx=e.offsetX;
	this.my=e.offsetY;
}

// ELEMENT
function Element(surface) {
	this.surface=surface;
}
Element.prototype.setPos=function(x,y) {
	this.x=x;
	this.y=y;
}
Element.prototype.draw=function() {
	this.surface.context.beginPath();
	this.surface.context.fillStyle=RGB.white.v;
	this.surface.context.strokeStyle=RGB.white.v;
	this.surface.context.lineWidth=1;
	this.surface.context.arc(this.x,this.y,4,0,Math.PI*2);
	this.surface.context.fill();
}
Element.prototype.step=function() {}
Element.prototype.keyd=function() {}
Element.prototype.keyu=function() {}
Element.prototype.dead=function() {return false}
Element.prototype.destroy=function() {}
Element.prototype.bounds=function(x,y) {
	var dx=this.x-x;
	var dy=this.y-y;
	return Math.sqrt(dx*dx+dy*dy)<=4;
}

// BALL
function Ball(surface,color,radius) {
	this.surface=surface;
	this.color=color;
	this.radius=radius;
}
Ball.prototype=new Element();
Ball.prototype.draw=function() {
	this.surface.context.beginPath();
	this.surface.context.fillStyle=this.color.v;
	this.surface.context.lineWidth=1;
	this.surface.context.arc(this.x,this.y,this.radius,0,Math.PI*2);
	this.surface.context.fill();
}

// LOLBALL
function lolball(surface,color,radius) {
	this.surface=surface;
	this.color=color;
	this.radius=radius;
	this.dx=0;
	this.dy=0;
	this.fz=[0.99,0.9];
}
lolball.prototype=new Ball();
lolball.prototype.setDelay=function(t) {
	this.delay=t;
}
lolball.prototype.setTarget=function(x,y) {
	this.tx=x;
	this.ty=y;
}
lolball.prototype.setT=function(t) {
	this.t=t;
}
lolball.prototype.step=function() {
	if(this.delay>0) return this.delay--;
	
	var rx=this.tx;
	var ry=this.ty;
	/*
	var mx=this.surface.mx-this.x;
	var my=this.surface.my-this.y;
	var m=Math.dist(mx,my);
	rx-=8000*mx/m/m;
	ry-=8000*my/m/m;
	*/
	this.f=this.fz[this.ready?1:0];

	var dx=rx-this.x;
	var dy=ry-this.y;
	var d=Math.dist(dx,dy);
	this.dx+=dx/d/10;
	this.dy+=dy/d/10;
	this.dx*=this.f;
	this.dy*=this.f;
	this.x+=this.dx;
	this.y+=this.dy;

	if(d<=1 && Math.dist(this.dx,this.dy)<=1) {
		if(!this.ready) {
			this.ready=true;
			this.surface.ready++;
		}
		if(this.surface.ready==this.surface.balls) {
			this.t++;
			var z=f(this.t/this.surface.balls*Math.PI*2);
			this.tx=z[0]*10+this.surface.width/2;
			this.ty=z[1]*10+this.surface.height/2;
		}
	}
}

// SPLODE
function Splode(surface,color,size,x,y) {
	this.surface=surface;
	this.color=color;
	this.x=x;
	this.y=y;
	this.size=Math.ceil(size);

	this.dx=Math.random()*2-1;
	this.dy=Math.random()*2-1;
	this.timer=Math.round(Math.random()*25)+25;
	this.maxTimer=this.timer;
}
Splode.prototype=new Element();
Splode.prototype.step=function() {
	this.timer--;
	this.x+=this.dx;
	this.y+=this.dy;
}
Splode.prototype.dead=function() {
	return this.timer<=0;
}
Splode.prototype.draw=function() {
	this.surface.context.beginPath();
	this.surface.context.fillStyle="rgba("+this.color+", "+(this.timer/this.maxTimer)+")";
	this.surface.context.arc(this.x,this.y,this.size,0,Math.PI*2);
	this.surface.context.fill();
}

// WPN:

// surface and shit
var surface;
$(function() {
	surface=new Surface();
	surface.step();
	window.addEventListener("keydown",function(e) {surface.keyd(e)},true);
	window.addEventListener("keyup",function(e) {surface.keyu(e)},true);
	surface.canvas.addEventListener("mousedown",function(e) {surface.moused(e)},true);
	surface.canvas.addEventListener("mouseup",function(e) {surface.mouseu(e)},true);
	surface.canvas.addEventListener("mousemove",function(e) {surface.mousem(e)},true);
	window.addEventListener("selectstart",function(e) {e.preventDefault()},true);
	window.addEventListener("contextmenu",function(e) {e.preventDefault()},true);
});
