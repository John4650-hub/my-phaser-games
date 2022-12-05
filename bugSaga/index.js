var config = {
    type: Phaser.AUTO,
    scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 1050
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var leftBtn;
var rightBtn;
var upBtn;
var downBtn;
var movel;
var mover;
var movep;
var moved;
var player;
var stars;
var beetles;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var livesText;
var lives = 5;
var playbtn;
var c=false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', './assets/bg.png');
    this.load.image('leftButton', './assets/left.png');
    this.load.image('rightButton', './assets/right.png');
    this.load.image('upButton', './assets/up.png');
    this.load.image('downButton', './assets/down.png');
    this.load.image('playButton','./assets/shadedDark16.png')
    this.load.image('ground', './assets/platform.png');
    this.load.image('star', './assets/star.png');
    this.load.image('beetle', './assets/beetle.png');
    this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.5);
    player.setScale(1.2)
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events 
    256

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 7,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    beetles = this.physics.add.group();
    
    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    livesText = this.add.text(500,16,'lives: '+lives,{fontSize: '32px', fill: '#FF0000FF'})

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(beetles, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, beetles, hitbeetle, null, this);
  
  leftBtn = this.add.image(220, 835, 'leftButton').setInteractive();
  rightBtn = this.add.image(570, 835, 'rightButton').setInteractive();
  upBtn = this.add.image(410, 660, 'upButton').setInteractive();
  downBtn = this.add.image(410, 1000, 'downButton').setInteractive();
    // scaling the buttons
    leftBtn.setScale(1.5);
    rightBtn.setScale(1.5);
    upBtn.setScale(1.5);
    downBtn.setScale(1.5);

    leftBtn.on('pointerover', function() {
      movel = true;
      leftBtn.setTint(0xff0000)
    });
    leftBtn.on('pointerout', function() {
      movel = false;
      leftBtn.setTint()
    });

    rightBtn.on('pointerover', function() {
      mover = true;
      rightBtn.setTint(0xff0000)
    });
    rightBtn.on('pointerout', function() {
      mover = false;
      rightBtn.setTint()
    });
    upBtn.on('pointerover', function() {
      movep = true;
      upBtn.setTint(0xff0000);
    });
    upBtn.on('pointerout', function() {
      movep = false;
      upBtn.setTint();
    });
    downBtn.on('pointerover', function() {
      moved = true;
      downBtn.setTint(0xff0000);

    });
    downBtn.on('pointerout', function() {
      moved = false;
      downBtn.setTint();
    });
    
    
}

function update ()
{
    if (lives == 0)
    {
      this.physics.pause()
      gameOver = true
      };
    if (gameOver)
    {
      this.add.text(20, 300, "You've been infected", { fontSize: '42px', fill: '#000' });
    }

    if (movel == true) {
    player.setVelocityX(-300);
    player.anims.play('left', true);
    }
    else if (mover == true) {
    player.setVelocityX(300);
    player.anims.play('right', true);
    }
    else if (movep == true) {
    player.setVelocityY(-300);
    }
    else if (moved == true) {
    player.setVelocityY(300);
    }
    else {
    player.setVelocityX(0)
    player.anims.play('turn', true);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var beetle = beetles.create(x, 16, 'beetle');
        beetle.setBounce(1);
        beetle.setCollideWorldBounds(true);
        beetle.setVelocity(Phaser.Math.Between(-200, 200), 20);
        beetle.allowGravity = false;

    }
}

function hitbeetle (player, beetle)
{
    player.setTint(0xff0000);
    player.setTint();
    player.anims.play('turn');
    lives -=1
    livesText.setText('lives: '+lives)
}
