import { Detector } from "./FaceLandmarkDetector";
import * as Phaser from "phaser";

import { MainMenuScene } from "./Scenes/MainMenuScene";
import { Chapter1Scene } from "./Scenes/Chapter1Scene";
import { Chapter2Scene } from "./Scenes/Chapter2Scene";
import { Chapter3Scene } from "./Scenes/Chapter3Scene";
import { Chapter4Scene } from "./Scenes/Chapter4Scene";
import { Chapter5Scene } from "./Scenes/Chapter5Scene";
import { FaceDetectorScene } from "./FaceDetectorScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "focus-but-what",
  type: Phaser.AUTO,
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  parent: "game",
  backgroundColor: "#000000",
  scene: [    
    Chapter3Scene,
    Chapter1Scene,
    Chapter2Scene,
    Chapter4Scene,
    Chapter5Scene,
  ],
};

export const game = new Phaser.Game(gameConfig);

async function app() {
  try {
    await Detector.setup();
    FaceDetectorScene.currentScene = game.scene.getAt(0);
  } catch (error) {
    console.log(error);
  }
}

app();
