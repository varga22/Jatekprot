/**
 * 
 * Játék konfigurációja.
 * @name configurations
 */
const configurations = {
    type: Phaser.AUTO,
    width: 288,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

/**
 *  Játék asset-jei.
 *  @name assets
 */
const assets = {
    bird: {
        red: 'bird-red',
        yellow: 'bird-yellow',
        blue: 'bird-blue'
    },
    obstacle: {
        pipe: {
            green: {
                top: 'pipe-green-top',
                bottom: 'pipe-green-bottom'
            },
            red: {
                top: 'pipe-red-top',
                bottom: 'pipe-red-bo'
            }
        }
    },
    scene: {
        width: 144,
        background: {
            day: 'background-day',
            night: 'background-night'
        },
        ground: 'ground',
        gameOver: 'game-over',
        restart: 'restart-button',
        messageInitial: 'message-initial'
    },
    scoreboard: {
        width: 25,
        base: 'number',
        number0: 'number0',
        number1: 'number1',
        number2: 'number2',
        number3: 'number3',
        number4: 'number4',
        number5: 'number5',
        number6: 'number6',
        number7: 'number7',
        number8: 'number8',
        number9: 'number9'
    },
    animation: {
        bird: {
            red: {
                clapWings: 'red-clap-wings',
                stop: 'red-stop'
            },
            blue: {
                clapWings: 'blue-clap-wings',
                stop: 'blue-stop'
            },
            yellow: {
                clapWings: 'yellow-clap-wings',
                stop: 'yellow-stop'
            }
           
        },
        ground: {
            moving: 'moving-ground',
            stop: 'stop-ground'
        }
    }
}


/**
 * Phaser fő vezérlője
 * @name game
 * @type {object}
 */
const game = new Phaser.Game(configurations)
/**
 * Ha a játék véget ér.
 * @type {boolean}
 */
let gameOver
/**
 * Ha a játék elkezdődött
 * @type {boolean}
 */
let gameStarted
/**
 * Fel gomb komponens
 * @type {object}
 */
let upButton
/**
 * Restart gomb komponens
 * @type {object}
 */
let restartButton
/**
 * Game over banner komponens.
 * @type {object}
 */
let gameOverBanner
/**
 * Üzenet kezdeti komponens.
 * @type {object}
 */
let messageInitial
// Bird
/**
 * Játékos component.
 * @type {object}
 */
let player
/**
 * Madár neve asset.
 * @type {string}
 */
let birdName
/**
 * Keretek felfelé mozgása.
 * @type {number}
 */
let framesMoveUp
// Hátterek
/**
 * Nappali háttér komponens.
 * @type {object}
 */
let backgroundDay
/**
 * Éjjeli háttér komponens.
 * @type {object}
 */
let backgroundNight
/**
 * Föld komponens.
 * @type {object}
 */
let ground
// csövek
/**
 * Csövek komponens.
 * @type {object}
 */
let pipesGroup
/**
 * Rések komponens.
 * @type {object}
 */
let gapsGroup
/**
 * Számláló a következő létrehozandó csőig.
 * @type {number}
 */
let nextPipes
/**
 * Jelenlegi cső asset.
 * @type {object}
 */
let currentPipe
// Score változók
/**
 * Eredménytábla komponens.
 * @type {object}
 */
let scoreboardGroup
/**
 * Score számláló.
 * @type {number}
 */
let score


//Assetek betöltése.
function preload() {
    // Hátterek és a föld
    this.load.image(assets.scene.background.day, 'assets/background-day.png')
    this.load.image(assets.scene.background.night, 'assets/background-night.png')
    this.load.spritesheet(assets.scene.ground, 'assets/ground-sprite.png', {
        frameWidth: 336,
        frameHeight: 112
    })

    // Csövek
    this.load.image(assets.obstacle.pipe.green.top, 'assets/pipe-green-top.png')
    this.load.image(assets.obstacle.pipe.green.bottom, 'assets/pipe-green-bottom.png')
    this.load.image(assets.obstacle.pipe.red.top, 'assets/pipe-red-top.png')
    this.load.image(assets.obstacle.pipe.red.bottom, 'assets/pipe-red-bottom.png')

    // Start game
    this.load.image(assets.scene.messageInitial, 'assets/message-initial.png')

    // End game
    this.load.image(assets.scene.gameOver, 'assets/gameover.png')
    this.load.image(assets.scene.restart, 'assets/restart-button.png')

    // Madarak
    this.load.spritesheet(assets.bird.red, 'assets/bird-red-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet(assets.bird.blue, 'assets/bird-blue-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet(assets.bird.yellow, 'assets/bird-yellow-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })

    // Számok
    this.load.image(assets.scoreboard.number0, 'assets/number0.png')
    this.load.image(assets.scoreboard.number1, 'assets/number1.png')
    this.load.image(assets.scoreboard.number2, 'assets/number2.png')
    this.load.image(assets.scoreboard.number3, 'assets/number3.png')
    this.load.image(assets.scoreboard.number4, 'assets/number4.png')
    this.load.image(assets.scoreboard.number5, 'assets/number5.png')
    this.load.image(assets.scoreboard.number6, 'assets/number6.png')
    this.load.image(assets.scoreboard.number7, 'assets/number7.png')
    this.load.image(assets.scoreboard.number8, 'assets/number8.png')
    this.load.image(assets.scoreboard.number9, 'assets/number9.png')
}

// Hangok hozzáadása
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";


//  A játék objektumai (képek, csövek, játékos és animációk).

function create() {
    backgroundDay = this.add.image(assets.scene.width, 256, assets.scene.background.day).setInteractive()
    backgroundDay.on('pointerdown', moveBird)
    backgroundNight = this.add.image(assets.scene.width, 256, assets.scene.background.night).setInteractive()
    backgroundNight.visible = false
    backgroundNight.on('pointerdown', moveBird)


    gapsGroup = this.physics.add.group()
    pipesGroup = this.physics.add.group()
    scoreboardGroup = this.physics.add.staticGroup()

    ground = this.physics.add.sprite(assets.scene.width, 458, assets.scene.ground)
    ground.setCollideWorldBounds(true)
    ground.setDepth(10)
   
    messageInitial = this.add.image(assets.scene.width, 156, assets.scene.messageInitial)
    messageInitial.setDepth(30)
    messageInitial.visible = false

    upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)

    // Föld animációja
    this.anims.create({
        key: assets.animation.ground.moving,
        frames: this.anims.generateFrameNumbers(assets.scene.ground, {
            start: 0,
            end: 2
        }),
        frameRate: 15,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.ground.stop,
        frames: [{
            key: assets.scene.ground,
            frame: 0
        }],
        frameRate: 20
    })

    // Piros Faby animációja
    this.anims.create({
        key: assets.animation.bird.red.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.red, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.red.stop,
        frames: [{
            key: assets.bird.red,
            frame: 1
        }],
        frameRate: 20
    })

    // Kék Faby anmiációja
    this.anims.create({
        key: assets.animation.bird.blue.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.blue, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.blue.stop,
        frames: [{
            key: assets.bird.blue,
            frame: 1
        }],
        frameRate: 20
    })

    // Sárga Faby animációja
    this.anims.create({
        key: assets.animation.bird.yellow.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.yellow, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.yellow.stop,
        frames: [{
            key: assets.bird.yellow,
            frame: 1
        }],
        frameRate: 20
    })

    prepareGame(this)

    gameOverBanner = this.add.image(assets.scene.width, 206, assets.scene.gameOver)
    gameOverBanner.setDepth(20)
    gameOverBanner.visible = false

    restartButton = this.add.image(assets.scene.width, 300, assets.scene.restart).setInteractive()
    restartButton.on('pointerdown', restartGame)
    restartButton.setDepth(20)
    restartButton.visible = false
}


  //Másodpercenként frissíti a jeleneteket, a madár mozgatásáért felelős, valamint a csövek létrehozásáért

function update() {
    if (gameOver || !gameStarted)
        return

    if (framesMoveUp > 0)
        framesMoveUp--
    else if (Phaser.Input.Keyboard.JustDown(upButton))
        moveBird()
    else {
        player.setVelocityY(120)
        

        if (player.angle < 90)
            player.angle += 1
    }
    

    pipesGroup.children.iterate(function (child) {
        if (child == undefined)
            return

        if (child.x < -50)
            child.destroy()
        else
            child.setVelocityX(-100)
    })

    gapsGroup.children.iterate(function (child) {
        child.body.setVelocityX(-100)
    })

    nextPipes++
    if (nextPipes === 130) {
        makePipes(game.scene.scenes[0])
        nextPipes = 0
        SCORE_S.play();
    }
}

/**
 *  Madár ütközésének a jelenete
 *  @param {object} player - Az objektum ami ütközik, jelenesetben a madár
 */
function hitBird(player) {
    this.physics.pause()

    gameOver = true
    gameStarted = false

    player.anims.play(getAnimationBird(birdName).stop)
    ground.anims.play(assets.animation.ground.stop)
    HIT.play();
    DIE.play();

    gameOverBanner.visible = true
    restartButton.visible = true
    
   
}

/**
 *   Frissíti az eredménytáblát
 *   @param {object} _ - Átfedésben lévő objektum, ezesetben a madár
 *   @param {object} gap - Átfedésben lévő objektum, itt a csövek közötti rés
 */
function updateScore(_, gap) {
    score++
    gap.destroy()

    if (score % 5 == 0) {
        backgroundDay.visible = !backgroundDay.visible
        backgroundNight.visible = !backgroundNight.visible

        if (currentPipe === assets.obstacle.pipe.green)
            currentPipe = assets.obstacle.pipe.red
        else
            currentPipe = assets.obstacle.pipe.green
    }

    updateScoreboard()
}

/**
 * Csövek és a köztük lévő rések létrehozásáért felelős
 * @param {object} scene - Game scene.
 */
function makePipes(scene) {
    if (!gameStarted || gameOver) return

    const pipeTopY = Phaser.Math.Between(-120, 120)

    const gap = scene.add.line(288, pipeTopY + 210, 0, 0, 0, 98)
    gapsGroup.add(gap)
    gap.body.allowGravity = false
    gap.visible = false

    const pipeTop = pipesGroup.create(288, pipeTopY, currentPipe.top)
    pipeTop.body.allowGravity = false

    const pipeBottom = pipesGroup.create(288, pipeTopY + 420, currentPipe.bottom)
    pipeBottom.body.allowGravity = false
}

/**
 * A madár elhelyezése a képrenyőn
 */
function moveBird() {
    if (gameOver)
        return

    if (!gameStarted)
        startGame(game.scene.scenes[0])

    player.setVelocityY(-400)
    player.angle = -15
    framesMoveUp = 5
    FLAP.play();

    
}

/**
 * Randomizált színt kap a madár
 * @return {string} A madár színjeinek az asset-jei.
 */
function getRandomBird() {
    switch (Phaser.Math.Between(0, 2)) {
        case 0:
            return assets.bird.red
        case 1:
            return assets.bird.blue
        case 2:
        default:
            return assets.bird.yellow
    }
}

/**
 * Az animáció nevének lekérdezése a madárról.
 * @param {string} birdColor - Madár színének az asset-e.
 * @return {object} - Madár animációjának az asset-e.
 */
function getAnimationBird(birdColor) {
    switch (birdColor) {
        case assets.bird.red:
            return assets.animation.bird.red
        case assets.bird.blue:
            return assets.animation.bird.blue
        case assets.bird.yellow:
        default:
            return assets.animation.bird.yellow
    }
}

/**
 *A játék eredménytáblájának frissítése.
 */
function updateScoreboard() {
    scoreboardGroup.clear(true, true)

    const scoreAsString = score.toString()
    if (scoreAsString.length == 1)
        scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.base + score).setDepth(10)
    else {
        let initialPosition = assets.scene.width - ((score.toString().length * assets.scoreboard.width) / 2)

        for (let i = 0; i < scoreAsString.length; i++) {
            scoreboardGroup.create(initialPosition, 30, assets.scoreboard.base + scoreAsString[i]).setDepth(10)
            initialPosition += assets.scoreboard.width
        }
    }
}

/**
 * Játék újraindítása 
 * Tisztítja a csoportokat, elrejti az objektumkat és leállítja a játék fizikáját.
 */
function restartGame() {
    pipesGroup.clear(true, true)
    pipesGroup.clear(true, true)
    gapsGroup.clear(true, true)
    scoreboardGroup.clear(true, true)
    player.destroy()
    gameOverBanner.visible = false
    restartButton.visible = false
   


    const gameScene = game.scene.scenes[0]
    prepareGame(gameScene)

    gameScene.physics.resume()
    

}

/**
 * Újra létrehozza a változókat és a konfigurációkat, majd a main-re mutat és újragenerálja a madarat.
 * @param {object} scene - Game scene.
 */
function prepareGame(scene) {
    framesMoveUp = 0
    nextPipes = 0
    currentPipe = assets.obstacle.pipe.green
    score = 0
    gameOver = false
    backgroundDay.visible = true
    backgroundNight.visible = false
    messageInitial.visible = true


    birdName = getRandomBird()
    player = scene.physics.add.sprite(60, 265, birdName)
    player.setCollideWorldBounds(true)
    player.anims.play(getAnimationBird(birdName).clapWings, true)
    player.body.allowGravity = false
    

    scene.physics.add.collider(player, ground, hitBird, null, scene)
    scene.physics.add.collider(player, pipesGroup, hitBird, null, scene)

    scene.physics.add.overlap(player, gapsGroup, updateScore, null, scene)

    ground.anims.play(assets.animation.ground.moving, true)
    
}

/**
 * Játék indítása, csövek újragenerálása, főmenü elrejtése.
 * @param {object} scene - Game scene.
 */
function startGame(scene) {
    gameStarted = true
    messageInitial.visible = false
    SWOOSHING.play();

    const score0 = scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.number0)
    score0.setDepth(20)

    makePipes(scene)
}