export class Menu extends Phaser.State {
    preload() {

      this.game.load.image('titlescreen', 'assets/images/titlescreen.png');
    }

    create() {

      let image = this.game.add.sprite(0,0,'titlescreen');
      image.inputEnabled = true;
      image.events.onInputDown.addOnce(this.buttonClicked, this);
    }

    buttonClicked() {
      this.game.state.start('Battle');
    }
}
