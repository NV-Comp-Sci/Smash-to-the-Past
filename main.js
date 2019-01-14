
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//var keyboard = new Keyboard(this);
function preload() {

    game.load.image('sky', 'assets/map.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('dude', 'assets/mini boss.png');
    game.load.image("p2",'assets/small knight.png');
    game.load.image('box', 'assets/box.png');
    game.load.spritesheet('boss','assets/Boss.png',68,84);
    game.load.spritesheet('button', 'assets/Button (1).png', 63, 26);
    game.load.image("bg", 'assets/bg.png');
}

var player;
var player2;
var boss;
//var move = Phaser.Keyboard.addKeys({'up':Phaser.KeyCode.W,'down':Phaser.KeyCode.S,'left':Phaser.KeyCode.A,'right':Phaser.KeyCode.D});
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
    player2 = game.add.sprite(500,game.world.height - 150,'p2');
    boss = game.add.sprite(700,game.world.height - 150,'boss');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(player2);
    game.physics.arcade.enable(boss);
    game.physics.arcade.enable(Button);

    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
   // player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player2.body.collideWorldBounds = true;
    boss.body.collideWorldBounds = true;

    player.body.allowGravity = false;
    player2.body.allowGravity = false;
    boss.body.allowGravity = false;

    
    //  Our two animations, walking left and right.
   // player.animations.add('left', [0, 1, 2, 3], 10, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  The score
    
    var scoreText = game.add.text(16,17, 'score: 0', { fontSize: '32px', fill: '#ff0000' });
    scoreText.fixedToCamera = true;
    //image (possible placeholder)
    
    game.add.image("bg");
    
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
}

function update() {

    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player2,platforms);
    game.physics.arcade.collide(boss,platforms);
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
    boss.body.velocity.x = 0;
    boss.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

       // player.animations.play('left');
    }
     if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        //player.animations.play('right');
    }
     if (cursors.down.isDown)
        {
            player.body.velocity.y =  150;
        }
     if (cursors.up.isDown)
        {
            player.body.velocity.y = -150;
        }
    else
    {
        //  Stand still
        player.animations.stop();

        //player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
    bossMovement();
    //tracking(boss,player);
    sector(100,player.x-boss.x,player.y-boss.y,25,0);
    
   
}

function pushStuff (player, objects) {
    
}

function pressed () {

    if (game.physics.arcade.overlap(Button, player)) {
      
        Button.frame = 1;
        press = true;    
    }
    else if (game.physics.arcade.overlap(Button, box)) {
       
        Button.frame = 1;
        press = true;
    }
    else {
      
        press = false;
        Button.frame = 0;
    }
}

function tracking(enemy,hero)
{
    
    enemy.body.velocity.x = 0;
    enemy.body.velocity.y = 0;
    //x direction is greater than y 
   if(Math.abs(enemy.x - hero.x)>Math.abs(enemy.y - hero.y))
       {
           if(enemy.x - hero.x > 0)
               {
                   enemy.body.velocity.x=-100;
               }
           else 
               {
                   enemy.body.velocity.x =100;
               }
       }
    // y direction is greater than x 
    else 
        {
           if(enemy.y-hero.y>0)
               {
                   enemy.body.velocity.y=-100;
               }
            else
                {
                    enemy.body.velocity.y=100;
                }
        }
}


function sector(radius,x,y,percent,start)
{
    const end = 360/percent + start;
    const polrad = Math.sqrt(x*x+y*y);
    const angle = Math.atan(y/x);
    
    if (angle>=start && angle<=end && polrad<radius) 
        tracking(boss,player);
}

function createHud() {
   
}
function bossMovement()
{
    if(boss.x < 700 && boss.x > 200)
        {
            
            if(boss.y <= game.world.height - 300 )
               {
                    boss.body.velocity.x = 150;
               }
            else 
                {
                    boss.body.velocity.x = -150;
                }
        }
    
    else if(boss.x == 700 && boss.y == game.world.height - 150)
        {
         
            boss.body.velocity.x = -150;
        }
    else if(boss.x == 200 && boss.y == game.world.height - 150)
        {
            boss.body.velocity.y = 150;
        }
    else if(boss.x == 200 && boss.y == game.world.height - 300)
        {
            boss.body.velocity.x = 150;
        }
    else if(boss.x ==700 && boss.y == game.world.height - 300)
        {
            boss.body.velocity.y = -150;
        }
    else 
        {
        
            if(boss.x >= 200)
                {
                  
                    boss.body.velocity.y = 150;
                }
            else{
                boss.body.velocity.y = -150;
            }
        }
}

