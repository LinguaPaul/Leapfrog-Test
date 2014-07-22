window.onload = function(){

	// Pause flag
	var paused = true;
    var counter=0;
    var minute=0;


    
//menu state
var Menu = function(game){};  
  Menu.prototype = {
    preload: function() {
        this.load.image('firstaid', 'assets/firstaid.png');
        this.load.spritesheet('background', 'assets/start.png',800,400);
        this.load.spritesheet('textbg','assets/textbg.png',486,512);

    },
    create: function() {
        // Reponsive and centered canvas
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 320;
			this.scale.minHeight = 200;
			this.scale.maxWidth = 720;
			this.scale.maxHeight = 480;

			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;

			this.scale.setScreenSize(true);
        
        console.log('Menu has started');
        
      //creates ground and starts scrolling it
      this.background = this.game.add.image(-5, -15,'background');
      this.textbg = this.game.add.sprite(this.game.width/5,-this.game.height,'textbg');

      this.game.physics.arcade.enableBody(this.textbg);
      this.textbg.body.allowGravity = false;
    },
    startClick: function() {
      // start the 'gameplay' state
      this.game.state.start('gameplay');
    },
    update: function() {
        this.textbg.body.velocity.y=300;
    if (this.textbg.position.y>-60){
      this.textbg.body.velocity.y = 0;
      this.startButton = this.game.add.button(this.game.width/2,this.game.height/2,'firstaid',this.startClick,this);
      this.startButton.anchor.setTo(0.5,0.5);   
        startText = game.add.text(-80+this.game.width/2,50+this.game.height/2, 'Click to play!', { font: "32px Arial", fill: "#000000", align: "middle" });
        }
    }
  };
  

    
    
//winner state
var Winner = function(game){};  
  Winner.prototype = {
    preload: function() {
         this.load.image('win', 'assets/win.png');

    },
    create: function() {
        console.log('Win Game has started');
        console.log(counter);
      // add the ground sprite as a tile
      // and start scrolling in the negative x direction
      this.win = this.game.add.image(-5, -15,'win');
      this.lilypad1 = game.add.sprite(10,200,'lilypad');
      this.lilypad2 = game.add.sprite(220,120,'lilypad');
      this.lilypad1.scale.setTo(1.5,1.5);
      this.lilypad2.scale.setTo(1.5,1.5);
      this.hero = game.add.sprite(90, 80, 'hero');
      this.hero.animations.add('right',[6],15,false);
      this.hero.animations.play('right');
      this.game.physics.arcade.enableBody(this.hero);
      this.hero.body.allowGravity = true;
      this.hero.body.velocity.y -= 900;
      this.hero.body.velocity.x = 150;
      this.game.physics.arcade.enableBody(this.lilypad2);
      this.lilypad2.body.immovable = true;
      this.lilypad2.body.allowGravity = false;
      this.hero.body.setSize(165,155);
      //this.hero.pivot.x = 0;
      //this.hero.pivot.y = 0;
      endText = game.add.text(-120+this.game.width/2,100+this.game.height/2, 'Congratulations!', { font: "32px Arial", fill: "#ffffff", align: "middle" });
    },
    update:function(){
    this.game.physics.arcade.collide(this.hero, this.lilypad2);
    //this.hero.rotation +=0.0;
    if(this.hero.body.touching.down)
    {
        this.hero.body.velocity.x=00;    
        this.hero.animations.stop;
        this.hero.frame=0;
    }
    }
  };

    
    
    
    
//Gameplay state
var gameplay = function(game){};
	gameplay.prototype = {
		preload: function(){
			// Load assets
            this.load.image('background', 'assets/gameplay.png');
			this.load.image('ground', 'assets/ground1.png');
            this.load.spritesheet('bird', 'assets/bird.png',38,40);
			this.load.image('btnPause', 'assets/btn-pause.png');
			this.load.image('btnPlay', 'assets/btn-play.png');
			this.load.image('panel', 'assets/panel.png');
            this.load.spritesheet('hero', 'assets/leapfrog.png', 165, 225);
            this.load.spritesheet('fish', 'assets/fish.png',200,100);
            this.load.spritesheet('lilypad', 'assets/lilypad.png', 171, 64);
            this.load.spritesheet('timer', 'assets/timer.png', 256, 256);
		},

		create: function(){
			// Reponsive and centered canvas
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
        console.log('Game has started');
                cursors = game.input.keyboard.createCursorKeys();
         // add our start button with a callback
            this.startButton = this.game.add.button(this.game.width/2, 30, 'firstaid', this.startClick, this);
      this.startButton.anchor.setTo(0.5,0.5);


			this.scale.minWidth = 320;
			this.scale.minHeight = 200;
			this.scale.maxWidth = 720;
			this.scale.maxHeight = 480;

			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;

			this.scale.setScreenSize(true);

			// Change stage background color
			this.game.stage.backgroundColor = '#d0f4f7';

			// Enable arcade physics
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.physics.arcade.gravity.y = 1200;
            
            //add background
            this.background = this.game.add.sprite(0, 0, 'background');

			// Add some moving birds
    	this.birds = game.add.group();
			for(var i=0; i<3; i++){
				var bird = this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.width), this.game.rnd.integerInRange(0, 50), 'bird');
				bird.anchor.setTo(0.5, 0);
				this.birds.add(bird);

				// Kill the birds when out of bounds
				bird.checkWorldBounds = true;
   				bird.outOfBoundsKill = true;

   				// Move birds
   				this.game.physics.arcade.enableBody(bird);
   				bird.body.allowGravity = false;
				bird.body.velocity.x = -this.game.rnd.integerInRange(15, 30);
                bird.animations.add('left',[0,1,2,3,4,5,4,3,2],15,true);
			     bird.animations.play('left');
			}

            //add lilypads
        	this.lilys = game.add.group();
            this.lilypad1 = this.game.add.sprite(50, this.game.rnd.integerInRange(200, 250), 'lilypad');
            this.lilypad2 = this.game.add.sprite(450, this.game.rnd.integerInRange(200, 250), 'lilypad');
            this.lilypad1.scale.setTo(1.5,1.5);
            this.lilypad2.scale.setTo(1.5,1.5);
            this.lilys.add(this.lilypad1);
            this.lilys.add(this.lilypad2);
            this.game.physics.arcade.enableBody(this.lilypad1);
            this.lilypad1.body.immovable = true;
            this.lilypad1.body.allowGravity = false;
            this.game.physics.arcade.enableBody(this.lilypad2);
            this.lilypad2.body.immovable = true;
            this.lilypad2.body.allowGravity = false;
            
            // Kill the lilys when out of bounds
				this.lilys.checkWorldBounds = true;
   				this.lilys.outOfBoundsKill = true;

			// Add hero
			this.hero = this.game.add.sprite(75, -100, 'hero');
            this.hero.animations.add('wrong',[33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58],15,false);
            this.hero.animations.add('right',[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],40,false);		
            this.hero.frame=0;
			this.heroVelocityY = 0;
            
            //add timer
            this.timerImage = this.game.add.sprite(25, 275, 'timer');
            timerText = game.add.text(40,320, '0:00', { font: "20px Arial", fill: "#000000", align: "middle" });
            
            
            //add fish
            fish = game.add.sprite(200,75,'fish');
            fish.animations.add('jump',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],20,true);
            fish.animations.play('jump')
            
            //start timer
            this.currentTimer = this.game.time.create(false);
            this.currentTimer.loop(Phaser.Timer.SECOND, this.updateTimer, this);
            this.currentTimer.start();

			//Jump button
            //This will be removed when JQuery calls are implemented
			this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.jumpKey.onDown.add(this.correctAnswer, this.hero);
        	this.wrongKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.wrongKey.onDown.add(this.incorrectAnswer, this.hero);

			// Add a pause button
			//this.btnPause = this.game.add.button(20, 20, 'btnPause', this.pauseGame, this);

			// Let's build a pause panel
			this.pausePanel = new PausePanel(this.game);
			this.game.add.existing(this.pausePanel);

			// Enter play mode
			this.playGame();
            this.hero.body.setSize(165,155);

		},

		update: function(){
            console.log(this.hero.animations.currentFrame.index);
            // Collisions between hero and ground
            this.game.physics.arcade.collide(this.hero, this.lilypad1);
            this.game.physics.arcade.collide(this.hero, this.lilypad2);
			// Revive dead birds
        this.birds.forEachDead(function(bird){
        bird.body.velocity.x = this.game.rnd.integerInRange(150, 200);
				bird.revive();
				bird.x = this.game.width + bird.width/2;
			}, this);
            
            // Revive dead lilypads
            if(this.lilypad1.x<-171){
				this.lilypad1.body.x = 629;
                this.lilypad1.body.y = this.game.rnd.integerInRange(200, 250);
            }
            if(this.lilypad2.x<-171){
				this.lilypad2.body.x = 629;
                this.lilypad2.body.y = this.game.rnd.integerInRange(200, 250);
            }

        if(!paused && this.hero.body.touching.down && this.wrongKey.isUp)
    {
        this.hero.body.velocity.y=0;    
        this.hero.animations.stop;
        this.hero.frame=0;
    }
        if(!paused && this.hero.animations.currentFrame.index == 0 || this.hero.animations.currentFrame.index == 32){
            this.lilypad1.body.velocity.x=0;
            this.lilypad2.body.velocity.x=0;

        }
            else{
                this.lilypad1.body.velocity.x=-645;
                this.lilypad2.body.velocity.x=-645;
            }
		},
    
        updateTimer: function() {
            counter++;
            if(counter==60){
                minute++;
                counter=0;
            }
            if (counter<10){
            timerText.setText(minute+':0'+counter);
            }
            else{
                timerText.setText(minute+':'+counter);
            }
    },

		correctAnswer: function(){
			if(!paused){
	8			// Change hero velocity if touching the ground
				if(this.body.touching.down){
				    this.body.velocity.y = -500;
                    this.animations.play('right');
                    }
			}
		},
        
        incorrectAnswer: function(){
			if(!paused){
				if(this.body.touching.down){
                    this.animations.play('wrong');
                }
			}
		},
        //this will be replaced by a JQuery call once the game recognizes that it has been won.
    startClick: function() {
      this.game.state.start('winner');
    },
		pauseGame: function(){
			if(!paused){
				// Enter pause
				paused = true;
				this.pausePanel.show();

				// Stop auto scrolling
				this.ground.autoScroll(0, 0);

				// Stop the hero
				this.hero.animations.currentAnim.paused = true;

				// Save the velocity of the hero before killing the body
				this.heroVelocityY = this.hero.body.velocity.y;

				// Kill the body
				this.hero.body = null;
                
                //pause the timer
                this.currentTimer.pause();


			}
		},
		playGame: function(){
			if(paused){
				// Leaving pause
				paused = false;
				this.pausePanel.hide();

				// Activate hero gravity				
                this.game.physics.arcade.enableBody(this.hero);
				this.hero.body.allowGravity = true;
				this.hero.body.velocity.y = this.heroVelocityY;
                this.hero.body.setSize(220, 180, 0, 0);

                
                //continue the timer
                if (this.currentTimer.paused == true){
                this.currentTimer.resume();
                }


			}
		}
	};

	// Create our pause panel extending Phaser.Group
	var PausePanel = function(game, parent){
		// Super call to Phaser.Group
		Phaser.Group.call(this, game, parent);

		// Add the panel
		this.panel = this.create(this.game.width/2, 10, 'panel');
		this.panel.anchor.setTo(0.5, 0);

		// Add play button
		//this.btnPlay = this.game.add.button(20, 20, 'btnPlay', function(){
        //this.game.state.getCurrentState().playGame()}
		//, this);
		//this.add(this.btnPlay);

		// Place it out of bounds
		this.x = 0;
		this.y = -100;
	};

	PausePanel.prototype = Object.create(Phaser.Group.prototype);
	PausePanel.constructor = PausePanel;

	PausePanel.prototype.show = function(){
		this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
	};
	PausePanel.prototype.hide = function(){
		this.game.add.tween(this).to({y:-100}, 200, Phaser.Easing.Linear.NONE, true);
	};

	// Create game state and start phaser
	var game = new Phaser.Game(600, 385, Phaser.AUTO, 'game');
    game.state.add('menu', Menu);
	game.state.add('gameplay', gameplay);
    game.state.add('winner', Winner);
	game.state.start('menu');
}