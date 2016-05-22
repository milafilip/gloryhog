export class GameOver extends Phaser.State {
    text: Phaser.Text;

    create() {
      let fontStyle = {
        font: '70px Gotham Black',
        fill: '#7edcfc'
      };
      this.text = this.add.text(this.world.centerX, this.world.centerY, 'PLAY AGAIN?', fontStyle);
      this.text.anchor.setTo(0.5, 0.5);
      this.text.inputEnabled = true;
      this.text.events.onInputDown.addOnce(this.buttonClicked, this);
    }

    buttonClicked() {
      this.game.state.start('Battle');
    }
}
