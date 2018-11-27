
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/map.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('box', 'assets/box.png');
    game.load.spritesheet('button', 'assets/Button (1).png', 63, 26);
}

var player;
var platforms;
var cursors;
var objects;
var tick = 0;
var stars;
var score = 0;
var scoreText;
var ground;
var Button;
var box;
    var press = false;
function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');
    game.world.setBounds(0,0,1240,1629);
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    Button = game.add.sprite(600, game.world.height - 58, 'button');
    Button.enableBody = true;
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    
    objects = game.add.group();
    objects.enableBody = true;
    
    box = objects.create(140, game.world.height - 106, 'box');
    box.body.gravity.y = 300;
    box.body.drag.x = 500;
    box.collideWorldBounds - true;
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 32, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 1);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(Button);

    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
   // player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.body.allowGravity = false;

    
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
}

function update() {

    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    var hitObject = game.physics.arcade.collide(player, objects);
    game.physics.arcade.collide(box, platforms);
    //game.physics.arcade.overlap(Button, box, pressed, null, this);
    
    //game.physics.arcade.overlap(Button, player, pressed, null, this);
    
    pressed();
    tick++;
    game.physics.arcade.overlap(player, objects, pushStuff, null, this);


    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else if (cursors.down.isDown)
        {
            player.body.velocity.y =  150;
        }
    else if (cursors.up.isDown)
        {
            player.body.velocity.y = -150;
        }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }

}

function pushStuff (player, objects) {
    
}

function pressed () {
//console.log("run");

    if (game.physics.arcade.overlap(Button, player)) {
       // console.log("Hello");
        Button.frame = 1;
        press = true;    
    }
    else if (game.physics.arcade.overlap(Button, box)) {
       // console.log("Hello");
        Button.frame = 1;
        press = true;
    }
    else {
       // console.log("bye");
        press = false;
        Button.frame = 0;
    }
}