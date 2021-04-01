import Phaser from 'phaser';

const gameScore = (score) => `Score: ${score}`;

export default class ScoreBoard extends Phaser.GameObjects.Text {
    constructor(scene, x, y, score, style) {
        super(scene, x, y, gameScore(score), style);
        this.score = score;
    }
    setScore(score) {
        this.score = score;
        this.updateScoreText();
    }
    add(points) {
        this.setScore(this.score + points);
    }
    updateScoreText() {
        this.setText(gameScore(this.score));
    }
}