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
sound.src = "sound/ryu.mp3"
const sound_hit = new Audio()
sound_hit.src = "sound/hit.wav"
const sound_shock = new Audio()
sound_shock.src = "sound/shock.wav"

const ko_sound = new Audio()
ko_sound.src = "sound/ko_sound.mp3"
const deadth_sound = new Audio()
deadth_sound.src = "sound/deadth_sound.mp3"

const ko_image = new Image()
ko_image.src = "images/ko.png"

const you_win = new Image()
you_win.src = "images/you_win.png"

const characters = {
    ryu: "images/ryu_moves.png",
    guile: "images/guile_moves.png",
}

class Fighter {
    constructor(character, player2 = false ){
        this.x = ( player2 ) ? -$canvas.width+150 : 50
        this.y = $canvas.height -200
        this.attack = false
        this.health = 100
        this.power = 5
        this.height = 180
        this.width = 100
        this.intervalDesition
        this.auto_machine = false
        
        this.direction = player2
        this.img_source = new Image()
        this.img_source.src = character
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
        this.x -= 10
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
        if( this.attack ) return
        sound_shock.play()
        this.width += 20
        this.attack = true
        this.x += 20
        this.move.y = 100
        this.move.start = 140
        this.move.offset = 70
        this.move.end = 70
    }
    kick(){
        if( this.attack ) return
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
        this.health -= (this.health > 0 ) ? power : 0
        game.checkHealth()
        if( this.health <= 0 ) return this.ko()
        
        this.move.y = 200
        this.move.start = 0
        this.move.offset = 70
        this.move.end = 70
    }

    hability(){
        console.log("Hability")
        this.width = this.width +50
        this.move.y = 300
        this.move.start = 400
        this.move.offset = 100
        this.move.end = 100
    }

    ko() {
        deadth_sound.play()
        timeout = frames + 15
        this.isKO = true
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
        bg.src = "images/ryu_stage.jpg"
        bg.onload = ()=> this.showStage()
        this.DrawGameOver()
        sound.play()
    }
    Draw(){ 
        this.player1.Draw()
        this.player2.Draw()
    }
    showStage(){
        ctx.drawImage(bg, 0,0, $canvas.width, $canvas.height)
    }
    checkKnock() {
        
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
            deadth_sound.volume = 0.2
            deadth_sound.play()
            ko_sound.play()
            sound.pause()
            ctx.fillStyle = "black"
            ctx.fillRect($canvas.width /2 -200, $canvas.height -25, 400, 30)
            ctx.fillStyle = "white"
            ctx.fillText("Press Q key to exit", $canvas.width /2 -80, $canvas.height -7)
            ctx.drawImage(ko_image, $canvas.width /2 -200, 10)

            if(this.player2.isKO) ctx.drawImage(you_win, 20, 80)
            if(this.player1.isKO) ctx.drawImage(you_win, $canvas.width -300, 80)
        }
    }



    isGameOver(){
        return ((this.player1.isKO || this.player2.isKO))
    }

    SpaceBetweenBoth(){
        const space_between = -this.player2.x -this.player1.x 
        return (space_between > 250)
    }

    takeDesition() {
        if( this.isGameOver() ) return
        if( this.player2.auto_machine ){
            if( this.SpaceBetweenBoth() ){
                 this.player2.go()
            }else{
                const action = Math.floor(Math.random()*30)
                switch( action ){
                    case 0:
                          this.player2.idle()
                          break
                     case 1:
                          this.player2.punch()
                          break
                     case 2:
                          this.player2.kick()
                          break
                     case 3:
                          this.player2.back()
                          break
                    default :
                         this.player2.idle()
                         break
                }
                
            }
        }

        if( this.player1.auto_machine ){
            if( this.SpaceBetweenBoth() ){
                this.player1.go()
            }else{
                const action2 = Math.floor(Math.random()*30)
                switch( action2 ){
                    case 0:
                          this.player1.idle()
                          break
                     case 1:
                          this.player1.punch()
                          break
                     case 2:
                          this.player1.kick()
                          break
                     case 3:
                          this.player1.back()
                          break
                    default :
                     this.player1.idle()
                     break
                }
                
            }
        }

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
    game.DrawGameOver()
    game.takeDesition()
    game.checkHealth()
    checkingJumping()
    game.checkKnock()
    game.Draw()
    if( game.isGameOver() && frames >= timeout ) clearInterval(interval)

}

function show_menu(){
    clearInterval(interval)
    $canvas.style.visibility = "hidden"
    document.querySelector('.splash').style.visibility = 'visible'
}

function hide_menu(){
    $canvas.style.visibility = "visible"
    document.querySelector('.splash').style.visibility = 'hidden'
}

function start_game(){
    // game = new Game(
    //     new Fighter(characters.ryu, false),
    //     new Fighter(characters.guile, true))

    // // game.player1.auto_machine = true
    // // game.player2.auto_machine = true
    // interval = setInterval(update, 100)
}
const a = new Audio()

window.onload = ()=>{
    $canvas.style.visibility = 'hidden'
}


window.onkeydown = ({keyCode})=>{
    

    game.player1.keys[keyCode] = true
    game.player2.keys[keyCode] = true

    if( keyCode === 81 ) return show_menu()

    if( game.player1.keys[17] && game.player1.keys[39]) game.player1.punch()
    else if(game.player1.keys[17] && game.player1.keys[37]) game.player1.punch()
    else if(game.player1.keys[16] && game.player1.keys[39]) game.player1.kick()
    else if(game.player1.keys[16] && game.player1.keys[37]) game.player1.kick()
    else{
        if( game.player1.keys[39] && !game.player1.isJumping )  game.player1.go()
        if( game.player1.keys[37] && !game.player1.isJumping )  game.player1.back()
        if( game.player1.keys[17] && !game.player1.isJumping )  game.player1.punch()
        if( game.player1.keys[16] && !game.player1.isJumping )  game.player1.kick()
    }

    if( game.player2.keys[65] && game.player2.keys[74]) game.player2.punch()
    else if( game.player2.keys[65] && game.player2.keys[76]) game.player2.punch()
    else if(game.player2.keys[83] && game.player2.keys[74]) game.player2.kick()
    else if(game.player2.keys[83] && game.player2.keys[76]) game.player2.kick()
    else{
        if( game.player2.keys[74] && !game.player2.isJumping )  game.player2.go()
        if( game.player2.keys[76] && !game.player2.isJumping )  game.player2.back()
        if( game.player2.keys[65] && !game.player2.isJumping )  game.player2.punch()
        if( game.player2.keys[83] && !game.player2.isJumping )  game.player2.kick()
    }
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

const one_player = document.querySelector('#one_player')
const two_players = document.querySelector('#two_players')
const demo = document.querySelector('#demo')

one_player.onclick = () =>{
    hide_menu()
    game = new Game(
        new Fighter(characters.ryu, false),
        new Fighter(characters.guile, true))

    game.player2.auto_machine = true
    interval = setInterval(update, 100)
}

two_players.onclick = ()=>{
    hide_menu()
    game = new Game(
        new Fighter(characters.ryu, false),
        new Fighter(characters.guile, true))
    interval = setInterval(update, 100)
}

demo.onclick = ()=>{
    hide_menu()
    game = new Game(
        new Fighter(characters.ryu, false),
        new Fighter(characters.guile, true))

    game.player1.health = 30
    game.player2.health = 30

    game.player1.auto_machine = true
    game.player2.auto_machine = true
    interval = setInterval(update, 100)
}