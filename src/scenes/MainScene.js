import Phaser from 'phaser';
import ScoreBoard from './ScoreBoard';
import Bomb from './Bomb';

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'key';
const BOMB_KEY = 'bomb';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super()
        this.player = undefined;
        this.cursors = undefined;
        this.scoreBoard = undefined;
        this.stars = undefined;
        this.bomb = undefined;
        this.gameOver = false;
    }

    preload() {
        this.load.image('sky', 'assets/sky.png')
		this.load.image(GROUND_KEY, 'assets/platform.png')
		this.load.image(STAR_KEY, 'assets/donut.png')
		this.load.image(BOMB_KEY, 'assets/bomb.png')

		this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		)
    }
    create() {
        this.add.image(400, 300, 'sky')
    	
        const platforms = this.creatPlatforms();
        this.player = this.createPlayer();
        this.stars = this.createStars();

        this.scoreBoard = this.createScoreBoard(16, 16, 0);

        this.bomb = new Bomb(this, BOMB_KEY);
        const bombGroup = this.bomb.group;

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.collider(bombGroup, platforms);
        this.physics.add.collider(this.player, bombGroup, this.explode, null, this);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }
    collectStar(player, star)
	{
		star.disableBody(true, true)
        this.scoreBoard.add(10);

        if (this.stars.countActive(true) === 0)
		{
			// this.stars.children.iterate((child) => {
			// 	child.enableBody(true, child.x, 0, true, true)
			// })
			this.scene.pause();
			this.gameOver = true;
			this.gameOverText = this.add.text(400, 300, `You win! You have collected all of the stars!`, {
				fontSize: 24,
				fontFamily: "Courier New, monospace",
				fill: "#000000",
			  });
			  this.gameOverText.setOrigin(0.5);

			this.startOverButton = this.add.text(400, 400, "Start Over", {
				fontSize: 36,
				fontFamily: "Courier New, monospace",
				fill: "#000000",
			  });
			this.startOverButton.setOrigin(0.5);
			this.startOverButton.setInteractive();
			this.startOverButton.on("pointerdown", () => {
				this.scene.start('MainScene');
				this.gameOver = false;
			  })  	  

		}

		this.bomb.makeBomb(player.x)
	}
    creatPlatforms() {
        const platforms = this.physics.add.staticGroup()

		platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()
	
		platforms.create(600, 400, GROUND_KEY)
		platforms.create(50, 250, GROUND_KEY)
		platforms.create(750, 220, GROUND_KEY)

        return platforms;
    }
    createPlayer() {
        const player = this.physics.add.sprite(100, 450, DUDE_KEY);
        player.setBounce(0.2);
		player.setCollideWorldBounds(true);

        this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
        
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

        return player;
    }
    createStars() {
		const stars = this.physics.add.group({
			key: STAR_KEY,
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		})
		
		stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})

		return stars
	}
    createScoreBoard(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' };
		const scoreBoard = new ScoreBoard(this, x, y, score, style);

		this.add.existing(scoreBoard);

		return scoreBoard
	}

    explode(player, bomb) {
		this.physics.pause()
		player.setTint(0xff0000)
		player.anims.play('turn')
		this.gameOver = true
		this.gameOverText = this.add.text(400, 300, `Game Over`, {
			fontSize: 48,
			fontFamily: "Courier New, monospace",
			fill: "#000000",
		  });
		  this.gameOverText.setOrigin(0.5);
	  
		  this.startOverButton = this.add.text(400, 400, "Start Over", {
			fontSize: 36,
			fontFamily: "Courier New, monospace",
			fill: "#000000",
		  });
		  this.startOverButton.setOrigin(0.5);
		  this.startOverButton.setInteractive();
		  this.startOverButton.on("pointerdown", () => {
			  this.scene.start('MainScene');
			  this.gameOver = false;
		  })
	  
	}

    update() {
        if(this.gameOver){
            return
        }
		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-160)

			this.player.anims.play('left', true)
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(160)

			this.player.anims.play('right', true)
		}
		else
		{
			this.player.setVelocityX(0)

			this.player.anims.play('turn')
		}

		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-330)
		}
	}

}