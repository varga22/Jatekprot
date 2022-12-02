// KERET KIVÁLASZTÁSA
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// JÁTÉK VÁLTOZÓI
let frames = 0;

//KÉP FORRÁS
const sprite = new Image()
sprite.src = "img/sprite.png";

//HÁTTÉR
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,

    draw : function() {
        
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }

}


//ELŐTÉR
const fg = {
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    y : cvs.height - 112,

    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);       //HÁTTÉR KIEGÉSZÍTÉSE - KERET KITÖLTÉSE

    }

}
//FABY
const bird = {
    animation : [
        {sX: 276, sY : 112},
        {sX: 276, sY : 139},
        {sX: 276, sY : 164},
        {sX: 276, sY : 139},
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,

    frame: 0,

    draw : function(){
        let.bird = this.animation[this.frame];

        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }

}

// ELEMEK(HÁTTÉR, ELŐTÉR, MADÁR, FELIRAT STB..)
function draw(){
    ctx.fillStyle = "#70c5ce";                          //HÁTTÉR KITÖLTÉSE SZÍN
    ctx.fillRect(0, 0, cvs.width, cvs.height);          //KOORDINÁTÁK

    bg.draw();
    fg.draw();
    bird.draw();

}


// UPDATE
function update(){

}


// LOOP(másodpercenként update-eli a játékot)
function loop(){                                
    update();                               //update-eli a képet
    draw();
    frames++;                               //1-el növeli a változót
    
    requestAnimationFrame(loop);            //visszahívja a loop-ot


}