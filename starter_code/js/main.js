const $canvas = document.querySelector('canvas')
const ctx = $canvas.getContext('2d')
let interval
let frames = 0
let game
let f
let f2
let bg 
let timeout = 0

const sound = new Audio()
sound.src = "./../sound/ryu.mp3"
const sound_hit = new Audio()
sound_hit.src = "./../sound/hit.wav"
const sound_shock = new Audio()
sound_shock.src = "./../sound/shock.wav"
const ko_image = new Image()
ko_image.src = "./../images/ko.png"

const characters = {
    ryu: "./../images/ryu_moves.png",
    guile: "./../images/guile_moves.png",
}

class Fighter {
    constructor(character, player2 = false ){
        this.x = ( player2 ) ? -$canvas.width+150 : 50
        this.y = $canvas.height -200
        this.attack = false
        this.health = 20
        this.power = 5
        this.height = 180
        this.width = 100
        // this.x = 0kz
        // this.y = 0
        this.direction = player2
        this.img_source = new Image()
        this.img_source.src = character
        // this.img_source.src = "./../images/ryu_moves.png"
        this.img_source.onload = ()=>{
            
            
            this.Draw()
        }
        this.isKO = false
        this.isMoving = true
        this.isJumping = false
        this.keys = []
        this.idle()
    }
    
    Draw() {
        this.move.x += this.move.offset

        if( this.move.x >= this.move.end) this.move.x = (this.isKO) ? this.move.end -this.move.offset : 0
        
        if( this.direction ){
            ctx.translate(0, 0)
            ctx.scale(-1,1)
        }else{
            ctx.translate(0,0)
            ctx.scale(1,1)
        }
        
        
        ctx.drawImage(this.img_source, 
            this.move.start+this.move.x,
            this.move.y,
            this.move.offset,
            this.move.height, 
            this.x, 
            this.y,
            this.width, 
            this.height)
    }

    idle() {
        this.attack = false
        this.width = 100
        this.height = 180
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
            this.isJumping = true
            this.x += 50
            this.move.start = 450
            this.move.offset = 50
            this.move.end = 300
        }
    }
    punch(){
        sound_shock.play()
        this.attack = true
        this.x += 20
        this.move.y = 100
        this.move.start = 140
        this.move.offset = 70
        this.move.end = 70
    }
    kick(){
        sound_shock.play()
        this.attack = true
        this.x += 20
        this.move.y = 100
        this.move.start = 420
        this.move.offset = 70
        this.move.end = 70
    }
    hit(power){
        sound_hit.play()
        this.health -= power
        game.checkHealth()
        if( this.health <= 0 ) return this.ko()
        
        this.move.y = 200
        this.move.start = 0
        this.move.offset = 70
        this.move.end = 70
    }

    ko() {
        this.isKO = true
        timeout = frames + 10
        this.x -= 200
        this.width = 180
        this.move.y = 200
        this.move.start = 0
        this.move.offset = 90
        this.move.end = 360
        
    }
}


class Game{
    constructor(pl1, pl2){
        this.player1 = pl1
        this.player2 = pl2
        this.checkHealth()
        bg = new Image()
        bg.src = "./../images/ryu_stage.jpg"
        bg.onload = ()=> this.showStage()

        
    }
    Draw(){ 
        this.player1.Draw()
        this.player2.Draw()
        // sound.play()
    }
    showStage(){
        ctx.drawImage(bg, 0,0, $canvas.width, $canvas.height)
    }
    checkKnock() {
        // console.log( this.player1.x, -this.player2.x-this.player1.width, $canvas.width, this.player2.x)
        if(this.player1.x + 100 > -this.player2.x-100) {
            if( this.player1.attack ) {
                this.player2.hit(this.player1.power) 
            }
            if( this.player2.attack ) {
                this.player1.hit(this.player2.power)
            }
            // (this.player2.attack) ? this.player1.hit() : null
            this.player1.x -= 20
            this.player2.x -= 20
            
        }
        if( -this.player2.x-this.player1.width >= $canvas.width -this.player2.width){
            this.player2.x = -$canvas.width +this.player2.width
        }
        if( this.player1.x <= 0 ) this.player1.x = 0

    }
    checkHealth(){
        const mid_width = ($canvas.width /2)

        ctx.fillStyle = "red"
        ctx.font = "bold 20px Arial"
        ctx.fillText("K.O.",mid_width -17, 40)

        ctx.strokeStyle = "white"
        ctx.strokeRect(mid_width -321, 19, 302, 32)
        ctx.strokeRect(mid_width +19, 19, 302, 32)

        ctx.fillRect(mid_width -320, 20, 300, 30)
        ctx.fillRect(mid_width +20, 20, 300, 30)
        ctx.fillStyle = "yellow"
        
        ctx.fillRect(mid_width -320, 20, this.player1.health * 300 / 100, 30)
        ctx.fillRect(mid_width +20, 20, this.player2.health * 300 / 100, 30)

    }

    DrawGameOver(){
        if(this.isGameOver()){
            ctx.drawImage(ko_image, $canvas.width /2 -200, 100)
        }
    }

    isGameOver(){
        console.log(frames, timeout)
        return ((this.player1.isKO || this.player2.isKO) && frames >= timeout)
    }

}
function checkingJumping(){
    if( game.player1.isJumping ) {
        if(game.player1.y > 100){
            game.player1.y -=30
        }else{
            game.player1.y = $canvas.height -250
            game.player1.isJumping = false
            game.player1.idle()
        }
    }
    if( game.player2.isJumping ) {
        if(game.player2.y > 100){
            game.player2.y -=30
        }else{
            game.player2.y = $canvas.height -250
            game.player2.isJumping = false
            game.player2.idle()
        }
    }
}

function update(){
    frames++
    ctx.clearRect(0,0, $canvas.width, $canvas.height)
    game.showStage()
    game.checkHealth()
    checkingJumping()
    // f.Draw()
    // f2.Draw()
    game.Draw()
    game.checkKnock()
    game.DrawGameOver()
    if( game.isGameOver() ) clearInterval(interval)

}

function start_game(){
    game = new Game(
        new Fighter(characters.ryu, false),
        new Fighter(characters.guile, true))
    interval = setInterval(update, 100)
}
const a = new Audio()

window.onload = ()=>{
    // f = new Fighter(characters.ryu, false)
    // f2= new Fighter(characters.guile, true)
    start_game()
}


window.onkeydown = ({keyCode})=>{
    game.player1.keys[keyCode] = true
    game.player2.keys[keyCode] = true

    if( game.player1.keys[37] && game.player1.keys[17] )  game.player1.punch()
    if( game.player1.keys[39] && game.player1.keys[17] )  game.player1.punch()
    if( game.player1.keys[38] && game.player1.keys[39] )  game.player1.jumpForward()
    if( game.player1.keys[39] && !game.player1.isJumping )  game.player1.go()
    if( game.player1.keys[37] && !game.player1.isJumping )  game.player1.back()
    if( game.player1.keys[40] && !game.player1.isJumping )  game.player1.down()
    if( game.player1.keys[38] ) game.player1.jump()
    if( game.player1.keys[17] ) game.player1.punch()
    if( game.player1.keys[16] ) game.player1.kick()


    if( game.player2.keys[74] && !game.player2.isJumping )  game.player2.go()
    if( game.player2.keys[76] && !game.player2.isJumping )  game.player2.back()
    if( game.player2.keys[65] && !game.player2.isJumping )  game.player2.punch()
    if( game.player2.keys[83] && !game.player2.isJumping )  game.player2.kick()
    return false
}

window.onkeyup = ({keyCode})=>{
    // console.log(keyCode)
    game.player1.keys[keyCode] = false
    game.player2.keys[keyCode] = false
    keyUp1 = (keyCode == 39 || keyCode == 37 || keyCode == 40 || keyCode == 17 || keyCode == 16)
    if(keyUp1){
        game.player1.idle()

    }
    keyUp2 = (keyCode == 74 || keyCode == 76 || keyCode == 65 || keyCode == 83)
    if(keyUp2){
        game.player2.idle()

    }
    return false
}