
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//var keyboard = new Keyboard(this);
function preload() {

    game.load.image('sky', 'assets/map.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('dude', 'assets/mini boss.png');
    game.load.image("p2",'assets/small knight.png');
    game.load.image('box', 'assets/box.png');
    game.load.image('arrow',"assets/Arrow.png");
    game.load.spritesheet('boss','assets/Boss.png',68,84);
    game.load.spritesheet("slash","assets/slash.png");
    game.load.spritesheet("eSlash",'assets/mew2.png');
    game.load.spritesheet('button', 'assets/Button (1).png', 63, 26);
    game.load.spritesheet('ammunition', 'assets/arrow.png');
    game.load.image("bg","assets/bg.png");
}

var player;
var p1Hp = 100;
var p1AT = 10;
var player2;
var p2Hp = 100;
var p2AT = 10;
var boss;
var bossHp = 100;
var wKey;
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
var tick = 0;
var score = 0;
var scoreText;
var press = false;
var arrows;
var aTicks = 0;
var sTicks = 0;
var stamina = 100;
var ammo = 20;

var spacebar;
var escape;
var x;
var y;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
     wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
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
    
    //Ammo Pickup
    ammunition = objects.create(425, game.world.height - 130, 'ammunition');
    
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
    
    //Attack
    attack = game.add.sprite(-1000,-1000, 'slash');
    game.physics.enable(attack);
    //P2 Attack
    arrows = game.add.group();
    arrows.enableBody = true;
    arrow = arrows.create(-1000, -1000, 'arrow');
    
    p2Attack = game.add.sprite(-1000,-1000, 'slash');
    game.physics.enable(p2Attack);
    //enemyAttack (eAttack)
    eAttack = game.add.sprite(-1000, -1000, 'eSlash');
    game.physics.enable(eAttack);
    
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

    
    //menu--------------------------------------------------
    
    menu = game.add.sprite(x/2,y/2, "ground");
        menu.fixedToCamera = true;
    menu.hidden = true;
    
    //menu--------------------------------------------------
    
    
    
    
    //keyboard declariations
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    escape = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    qKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_8);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_5);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_4);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_6);
    sevenKey = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_7);
    enter = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_ENTER);
    
    
    //  Our two animations, walking left and right.
   // player.animations.add('left', [0, 1, 2, 3], 10, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    scoreText.inputEnabled = false;
    scoreText.fixedToCamera = true;

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
    //pause handler
    escape.onDown.add(pauseHandler,this);
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


    //Attack
    game.physics.arcade.overlap(arrows, boss, damageBossA, null, this);
    game.physics.arcade.overlap(eAttack, player, damagePlayer(), null, this);
    p1AT -=1;
    p2AT -=1;
    
    //Time Between Arrows
    aTicks -= 1;
    
    //Time Between Stabs
    sTicks -= 1;
    
    //Stamina Replenish
    if (tick %10 == 0) {
        stamina += 1;
        console.log(stamina);
    }
    //Arrow Pick Up Perform
    if (game.physics.arcade.overlap(player2, ammunition)) {
        ammo += 10;
        ammunition.kill();
    }
    
     //Enemy Death
    if (bossHp <= 0) {
        boss.kill();
    } 
    
    
    //Player Death
    if (p1Hp <= 0) {
        player.kill();
        attack.kill();
    }
    if (p2Hp <= 0) {
        player2.kill();
    }
    
    //Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player2.body.velocity.x = 0;
    player2.body.velocity.y = 0;
    boss.body.velocity.x = 0;
    boss.body.velocity.y = 0;

   //Player 1 Movement
    if (leftKey.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

       // player.animations.play('left');
    }
     if (rightKey.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        //player.animations.play('right');
    }
     if (downKey.isDown)
        {
            player.body.velocity.y =  150;
        }
     if (upKey.isDown)
        {
            player.body.velocity.y = -150;
        }
     if (sevenKey.isDown)
        {
            //Cat(Attack) follows player
            if (sTicks <= 0) {
            sTicks = 15;
            attack = game.add.sprite(player.x,player.y, 'slash');
            game.physics.enable(attack);
            game.physics.arcade.overlap(attack, boss, damageBoss(), null, this);
            //attack.x = player.x+10;
            //attack.y = player.y;
            //p1AT=10;
            attack.kill();
            }
        }
    else
    {
        //  Stand still
        player.animations.stop();

        //player.frame = 4;
    }
    
    //Player 2 Movement
    if (aKey.isDown)
    {
        //  Move to the left
        player2.body.velocity.x = -200;

       // player.animations.play('left');
    }
     if (dKey.isDown)
    {
        //  Move to the right
        player2.body.velocity.x = 200;

        //player.animations.play('right');
    }
     if (sKey.isDown)
        {
            player2.body.velocity.y =  200;
        }
     if (wKey.isDown)
        {
            player2.body.velocity.y = -200;
        }
     if (qKey.isDown)
        {
            if (aTicks <= 0 && ammo > 0) {
            aTicks = 30;
            ammo -= 1;
            let arrow = arrows.create(player2.x+35,player2.y, 'arrow');
            arrow.angle = 45;
            //Cat(Attack) follows player
            arrow.body.velocity.x = 150;  
            p2AT = 15;
            console.log(ammo);
            }
        }
    else
    {
        //  Stand still
        player2.animations.stop();

        //player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -150;
    }
    bossMovement();
    //tracking(boss,player);
    sector(100,player.x-boss.x,player.y-boss.y,25,0);
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

function pauseHandler(event)
{
    if(game.paused){
        game.paused = false;
       }
    else{
        game.paused = true;
    }
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
//Attack
function damageBoss () {
    if (game.physics.arcade.overlap(attack, boss)) {
        bossHp -= 25;
        console.log ("Boss HP: " + bossHp);
        boss.x += 25;
    }
} 
function damageBossA (boss, arrow) {
        bossHp -= 20;
        console.log ("Boss HP: " + bossHp);
        boss.x += 25;
        arrow.kill();
} 
//Enemy Attack
function damagePlayer () {
    if (game.physics.arcade.overlap(eAttack, player)) {
        p1Hp -= 2;
        console.log ("Player1 HP: " + p1Hp);
    }
    if (game.physics.arcade.overlap(eAttack, player2)) {
        p2Hp -= 2;
        console.log ("Player 2 HP: " + p2Hp);
    }
}


