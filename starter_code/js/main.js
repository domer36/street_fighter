const $canvas = document.querySelector('canvas')
const ctx = $canvas.getContext('2d')
let interval
let frames = 0
let f

class Fighter {
    constructor(){
        this.x = 50
        this.y = $canvas.height -250
        this.img_source = new Image()
        this.img_source.src = "./../images/ryu_moves.png"
        this.img_source.onload = ()=>this.Draw()
        this.isMoving = true
        this.isJumping = false
        this.keys = []
        this.idle()
    }

    Draw() {
        this.move.x += this.move.offset
        if( this.move.x >= this.move.end) this.move.x = 0

        ctx.drawImage(this.img_source, this.move.start+this.move.x,this.move.y,this.move.offset,this.move.height, this.x, this.y,100, 180)
    }

    idle() {
        this.move = {
            x: 0,
            y: 0,
            height: 100,
            offset: 50,
            start: 0,
            end: 150
        }
    }

    go(){
        this.move.start = 200
        this.move.offset = 50
        this.move.end = 250
        this.x += 5
    }
    back(){
        this.move.start = 200
            this.move.offset = 50
            this.move.end = 250
        this.x -= 5
    }
    down(){
        
        this.move.start = 1165
        this.move.offset = 35
        this.move.end = 35
    }
    jump(){
        this.isJumping = true

        this.move.start = 450
        this.move.offset = 50
        this.move.end = 300
    }
    jumpForward() {
        if( !this.isJumping ){

        }
    }
    punch(){
        this.move.y = 100
        this.move.start = 140
        this.move.offset = 70
        this.move.end = 70
    }
}

function checkingJumping(){
    if( f.isJumping ) {
        if(f.y > 100){
            f.y -=30
        }else{
            f.y = $canvas.height -250
            f.isJumping = false
            f.idle()
        }
    }
}

function update(){
    frames++
    ctx.clearRect(0,0, $canvas.width, $canvas.height)
    f.Draw()
    checkingJumping()
}

function start_game(){
    interval = setInterval(update, 300)
}

window.onload = ()=>{
    f = new Fighter()
    start_game()
}


window.onkeydown = ({keyCode})=>{
    f.keys[keyCode] = true
    console.log(f.keys)

    if( f.keys[37] && f.keys[17] ) return f.punch()
    if( f.keys[39] && f.keys[17] ) return f.punch()
    if( f.keys[38] && f.keys[39] ) return f.jumpForward()
    if( f.keys[39] && !f.isJumping ) return f.go()
    if( f.keys[37] && !f.isJumping ) return f.back()
    if( f.keys[40] && !f.isJumping ) return f.down()
    if( f.keys[38] ) f.jump()
    if( f.keys[17] ) f.punch()

}

window.onkeyup = ({keyCode})=>{
    console.log(keyCode)
    f.keys[keyCode] = false
    keyUp = (keyCode == 39 || keyCode == 37 || keyCode == 40 || keyCode == 17)
    if(keyUp){
        f.idle()

    }
}