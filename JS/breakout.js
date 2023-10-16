const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 640,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false
        },
    }
};

const game = new Phaser.Game(config);

//variable declarations
let player, ball, violetBricks, yellowBricks, redBricks, cursors;
let gameStarted = false;

function preload() {
    this.load.image('ball', 'assets/images/ball_32_32.png');
    this.load.image('paddle', 'assets/images/paddle_128_32.png');
    this.load.image('brick1', 'assets/images/brick1_64_32.png');
    this.load.image('brick2', 'assets/images/brick2_64_32.png');
    this.load.image('brick3', 'assets/images/brick3_64_32.png');
};
    function create() {

        //player is the paddle
        player = this.physics.add.sprite(
            400, //x position
            600, // y position
            'paddle', //key for the image of the paddle
        );

        //the ball with hit off the paddle to the other bricks
        ball = this.physics.add.sprite(
            400, //x position
            565, //y position
            'ball' //key for the image of the ball
        );

        //first row of bricks - these can be any colour you wish
        violetBricks = this.physics.add.group({
            key: 'brick1',
            repeat: 9,
            immovable: true,
            setXY: {
                x: 80,
                y: 140,
                stepX: 70
            }
        });

        //second row of bricks - these can be any colour you wish
        yellowBricks = this.physics.add.group({
            key: 'brick2',
            repeat: 9,
            immovable: true,
            setXY: {
                x: 80,
                y: 90,
                stepX: 70
            }
        });

        //third row of bricks - these can be any colour you wish
        redBricks = this.physics.add.group({
            key: 'brick3',
            repeat: 9,
            immovable: true,
            setXY: {
                x: 80,
                y: 40,
                stepX: 70
            }
        });

        function isGameOver(world) {
            return ball.body.y > world.bounds.height;
        }

        function isWon() {
            return violetBricks.countActive() + yellowBricks.countActive() +
                redBricks.countActive() === 0;
        }

        //adding player movement with keyboard input
        cursors = this.input.keyboard.createCursorKeys();

        player.setCollideWorldBounds(true);
        ball.setCollideWorldBounds(true);

        //brick collision
        this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
        this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
        this.physics.add.collider(ball, redBricks, hitBrick, null, this);

        //player collision
        player.setImmovable(true);

        //collider between the ball and the player
        this.physics.add.collider(ball, player, hitPlayer, null, this);

        function update() {
            // check to see if the ball left the game scene
            if (isGameOver(this.physics.world)) {
                // game over man... game over!
            } else if (isWon()) {
                // you have won!
            } else {
                //Put this in so that the player stays still if no key is being pressed
                player.body.setVelocityX(0);
                
                if (cursors.left.isDown) {
                    player.body.setVelocityX(-350);
                } else if (cursors.right.isDown) {
                    player.body.setVelocityX(350);
                }
                if (!gameStarted) {
                    ball.setX(player.x);

                    if (cursors.space.isDown) {
                        gameStarted = true;
                        ball.setVelocityY(-200);
                        openingText.setVisible(false);
                    }
                }
            }
            player.setCollideWorldBounds(true);
            ball.setCollideWorldBounds(true);

            ball.setBounce(1, 1);

            this.physics.world.checkCollision.down = false;
        }

        function hitBrick(ball, brick) {
            brick.disableBody(true, true);

            if (ball.body.velocity.x === 0) {
                randNum = Math.random();

                if (randNum >= 0.5) {
                    ball.body.setVelocityX(150);
                } else {
                    ball.body.setVelocityX(-150);
                }
            }
        }
    }

    function hitPlayer(ball, player) {
        //increase the velocity of the ball after it bounces
        ball.setVelocityY(ball.body.velocity.y - 5);

        let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
        // if the ball is to the left of the player, ensure the X-velocity is negative

        if (ball.x < player.x) {
            ball.setVelocityX(-newXVelocity);
        } else {
            ball.setVelocityX(newXVelocity);
        }
    }