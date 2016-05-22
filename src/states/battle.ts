import { Player } from '../player';
import { Spotlight } from '../spotlight';
import { Oscar } from '../oscar';

export class Battle extends Phaser.State {
  text: Phaser.Text;
  players;
  playerCount: number;
  playerPairs;
  layer;
  layer2;
  layer3;
  map;
  music;
  conductor;
  stomp;
  oscar: Oscar;
  spotlight: Spotlight;
  private countdownText: Phaser.Text;
  timer;
  timerEvent;
  secondsRemaining = 10;


  pairwise(list) {
    if (list.length < 2) { return []; }
    var first = list[0],
        rest  = list.slice(1),
        pairs = rest.map(function (x) { return [first, x]; });
    return pairs.concat(this.pairwise(rest));
  }

  preload() {
    this.game.stage.backgroundColor = '#7D4545';
    this.game.load.atlas('player', 'assets/images/player.png', 'assets/images/player.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('conductor', 'assets/images/conductor.png', 'assets/images/conductor.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.tilemap('map', 'assets/tilemaps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tilespng', 'assets/images/tiles.png');
    this.game.load.image('tilespng2', 'assets/images/stage2.png');
    this.game.load.image('oscar', 'assets/images/oscar.png');
    this.game.load.audio('song', 'assets/audio/song.m4a');
    this.game.load.audio('stomp', 'assets/audio/stomp.wav');
  }

  create() {


    this.stomp = this.game.add.audio('stomp');
    this.music = this.game.add.audio('song');

    this.music.loop = true;

    this.musicVolume = 0.3;

    this.game.time.advancedTiming = true;
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('tiles','tilespng');
    this.map.addTilesetImage('foreground','tilespng2');

    this.layer2 = this.map.createLayer('Tile Layer 2');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer3 = this.map.createLayer('platforms');

    this.layer.visible = false;

    // map.setCollision(indexes: any, collides?: boolean, layer?: any, recalculate?: boolean
    this.map.setCollision(1, true, this.layer3);
    this.map.setCollision(2, true, this.layer);

    this.layer3.resizeWorld();

    let cursors = this.game.input.keyboard.createCursorKeys();
    // // this.game.world.setBounds(0, 0, 1400, 1400);
    this.players = [
      new Player(this.game,150,200,this.game.input.activePointer.leftButton, this.game.input.activePointer.rightButton, true, this.game.input.keyboard.addKey(Phaser.Keyboard.M)),
      new Player(this.game,550,200,this.game.input.keyboard.addKey(Phaser.Keyboard.A), this.game.input.keyboard.addKey(Phaser.Keyboard.D), false, this.game.input.keyboard.addKey(Phaser.Keyboard.W)),
      new Player(this.game,750,200,this.game.input.keyboard.addKey(Phaser.Keyboard.F), this.game.input.keyboard.addKey(Phaser.Keyboard.H), false, this.game.input.keyboard.addKey(Phaser.Keyboard.T))
    ];
    this.oscar = new Oscar(this.game, 500, 100);

    let topLayer = this.map.createLayer('Tile Layer 4');
    topLayer.alpha = 0.8;

    this.spotlight = new Spotlight(this.game, this.players[0]);
    this.spotlight.visible = false;
    this.playerPairs = this.pairwise(this.players);
    // // this.game.camera.follow(this.players[0], Phaser.Camera.FOLLOW_PLATFORMER);

    this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    this.game.physics.arcade.gravity.y = 1700;

    this.game.physics.arcade.checkCollision.down = false;

    this.conductor = this.game.add.sprite(600,830,'conductor');
    this.conductor.animations.add('conducting', [0, 1, 2, 3, 4, 5, 6, 7], 1, true);
    this.conductor.animations.play('conducting');
    // map.createFromObjects('Object Layer 1', 12, 'player', 0, true, false);

    let fontStyle = {
    font: '80px Gotham Black',
    fill: 'white'
    };
    this.countdownText = this.game.add.text(643, 40, Math.round(this.secondsRemaining).toString(), fontStyle);
    this.countdownText.anchor.setTo(0.5,0);
    this.timer = this.game.time.create();
    this.timerEvent = this.timer.add(Phaser.Timer.SECOND * this.secondsRemaining, this.endTimer, this);
  }

  endTimer() {
  }

  collectOscar(player, oscar) {
    oscar.destroy();
    player.state = "HOLDING";
    this.spotlight.followPlayer(player);
    this.music.play();
    if (this.timer && this.timer.running) {
      this.timer.stop(false);
    } else {
      this.timer.start();
    }
    // this.map.putTile(100, this.layer3.getTileX(8), this.layer3.getTileY(15), this.layer);
  }

  hitPlayer(player1,player2,recursive=true) {
    if (player1.body.y > player2.body.y + 50) {
      this.stomp.play();
      player2.body.velocity.y= -500;
      if (player1.state === "HOLDING") {
        player2.state = "HOLDING";
        this.spotlight.followPlayer(player2);
        this.timer.stop(false);
        this.timer.start();
      }

      let x = 0;
      while (x === 0) {
        x = this.game.rnd.integerInRange(100, 1100);
        for (var i = 0; i < this.players.length; i++) {
          if (Math.abs(this.players[i].body.x - x) < 150) { x = 0; }
        }
        player1.respawn(x);
      }
      this.musicVolume = 0.3;

    } else if (recursive) {
      this.hitPlayer(player2, player1, false);
    }
  };

  update() {
    this.musicVolume += 0.001;
    this.game.physics.arcade.collide(this.oscar, this.layer);
    this.game.physics.arcade.collide(this.oscar, this.layer3);
    this.countdownText.text = Math.round((this.timerEvent.delay - this.timer.ms) / 1000).toString();

    // this.game.physics.arcade.overlap(this.players, this.platforms);
    // this.game.physics.arcade.overlap(this.players[0], [this.players[1],this.players[2]], this.hitPlayer, null, this);

    for (var i = 0; i < this.players.length; i++) {
      this.game.physics.arcade.collide(this.players[i], this.layer);
      this.game.physics.arcade.collide(this.players[i], this.layer3);
      this.game.physics.arcade.overlap(this.players[i], this.oscar, this.collectOscar, null, this);
    }

    for (var i = 0; i < this.playerPairs.length; i++) {
      this.game.physics.arcade.collide(this.playerPairs[i][0], this.playerPairs[i][1], this.hitPlayer, null, this);
    }

  }

  render() {
    this.game.debug.text(this.game.time.fps.toString(), 200, 20, "#ff0000");

  }

  public get musicVolume():number {
    return this.music.volume;
  }

  public set musicVolume(val:number) {
    this.music.volume = Math.min(val, 1.5);
    let conductorSpeed = Math.max(this.music.volume * 30, 0);
    if (conductorSpeed == 0) {
      this.conductor.animations.paused = true;
    } else{
      // this.conductor.animations.currentAnim.speed = conductorSpeed;
      // this.conductor.animations.paused = false;
    }
  }

}
