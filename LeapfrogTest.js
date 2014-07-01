window.onload = function(){

	// Pause flag
	var paused = true;

//menu state
var Menu = function(game){};  
  Menu.prototype = {
    preload: function() {
        this.load.image('firstaid', 'assets/firstaid.png');
    },
    create: function() {
        console.log('Menu has started');
        
      //creates ground and starts scrolling it
      this.ground = this.game.add.tileSprite(0,400, 335,112,'ground');
      this.ground.autoScroll(-200,0);

      // adds the start button
      this.startButton = this.game.add.button(this.game.width/2, 300, 'firstaid', this.startClick, this);
      this.startButton.anchor.setTo(0.5,0.5);
    },
    startClick: function() {
      // start the 'gameplay' state
      this.game.state.start('gameplay');
    }
  };
  
//winner state
var Winner = function(game){};  
  Winner.prototype = {
    preload: function() {
 
    },
    create: function() {
        console.log('Win Game has started');
        console.log(counter);
      // add the ground sprite as a tile
      // and start scrolling in the negative x direction
      this.ground = this.game.add.tileSprite(0,400, 335,112,'ground');
      this.ground.autoScroll(-200,0);

    }
  };

	var gameplay = function(game){};

	gameplay.prototype = {
		preload: function(){
			// Load assets
			this.load.image('ground', 'assets/ground.png');
            this.load.spritesheet('bird', 'assets/bird.png',38,40);
			this.load.image('btnPause', 'assets/btn-pause.png');
			this.load.image('btnPlay', 'assets/btn-play.png');
			this.load.image('panel', 'assets/panel.png');
            this.load.spritesheet('hero', 'assets/leapfrog.png', 165, 225);
            this.load.spritesheet('fish', 'assets/fish.png',200,100);


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

			// Add a scrolling ground
			this.ground = this.game.add.tileSprite(0, 250, 480, 70, 'ground');
			this.game.physics.arcade.enableBody(this.ground);
			this.ground.body.immovable = true;
			this.ground.body.allowGravity = false;

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

			// Add hero
			this.hero = this.game.add.sprite(180, 60, 'hero');
			this.hero.anchor.setTo(0.5, 0.5);
            this.hero.animations.add('wrong',[33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58],15,false);
            this.hero.animations.add('right',[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],15,false);		
            this.hero.frame=0;
			this.heroVelocityY = 0;
            
            //add fish
            fish = game.add.sprite(200,200,'fish');
            fish.animations.add('jump',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],7,true);
            fish.animations.play('jump')
            
            //start timer
            counter=0;
            this.currentTimer = game.time.create(false);
            this.currentTimer.loop(Phaser.Timer.SECOND, this.updateTimer, this);
            this.currentTimer.start();

			//Jump button
            //This will be removed when JQuery calls are implemented
			this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.jumpKey.onDown.add(this.correctAnswer, this.hero);
        	this.wrongKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.wrongKey.onDown.add(this.incorrectAnswer, this.hero);

			// Add a pause button
			this.btnPause = this.game.add.button(20, 20, 'btnPause', this.pauseGame, this);

			// Let's build a pause panel
			this.pausePanel = new PausePanel(this.game);
			this.game.add.existing(this.pausePanel);

			// Enter play mode
			this.playGame();
		},

		update: function(){
        if(this.hero.body.touching.down && jumpKey.isUp)
    {
        this.hero.body.velocity.x=0;    
        this.hero.frame=0;
        this.hero.animations.stop;
    }
			// Revive dead birds
        this.birds.forEachDead(function(bird){
        bird.body.velocity.x = this.game.rnd.integerInRange(150, 200);
				bird.revive();
				bird.x = this.game.width + bird.width/2;
			}, this);

			// Collisions between hero and ground
			this.game.physics.arcade.collide(this.hero, this.ground);
            
		},
    
        updateTimer: function() {
            counter++;
            console.log(counter);

    },

		correctAnswer: function(){
			if(!paused){
				// Change hero velocity if touching the ground
				if(this.body.touching.down){
				    this.body.velocity.y -= 500;
                    this.body.velocity.x = 20;
                    this.animations.play('right');
                    }
			}
		},
        
        incorrectAnswer: function(){
			if(!paused){
				if(this.body.touching.down){
                    this.animations.play('wrong');
                    this.body.velocity.x=0;
                }
			}
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
        //this will be replaced by a JQuery call once the game recognizes that it has been won.
    startClick: function() {
      this.game.state.start('winner');
    },

		playGame: function(){
			if(paused){
				// Leaving pause
				paused = false;
				this.pausePanel.hide();

				// Anim ground
				this.ground.autoScroll(-100, 0);

				// play the runing animation of the hero
				this.hero.animations.currentAnim.paused = false;
				
				// Activate hero gravity
				this.game.physics.arcade.enableBody(this.hero);
				this.hero.body.allowGravity = true;
				this.hero.body.velocity.y = this.heroVelocityY;
                
                //continue the timer
                this.currentTimer.resume();


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
		this.btnPlay = this.game.add.button(20, 20, 'btnPlay', function(){
        this.game.state.getCurrentState().playGame()}
		, this);
		this.add(this.btnPlay);

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
	var game = new Phaser.Game(480, 320, Phaser.AUTO, 'game');
    game.state.add('menu', Menu);
	game.state.add('gameplay', gameplay);
    game.state.add('winner', Winner);
	game.state.start('menu');
};