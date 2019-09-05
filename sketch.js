let clapper1;
let clapper2;

let index = 0;
let repetitions = 0;
let initialDelay = 1200; //milliseconds
let lastClap = 0;

let pattern = [true, true, true, false,
             true, true, false, true,
             false,true, true, false];

let spacing;

var attackLevel = 1.0;
var releaseLevel = 0.0;

var attackTime = 0.004
var decayTime = 0.007;
var susPercent = 0.5;
var releaseTime = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);

  clapper1 = new Clapper(400, true);
  clapper2 = new Clapper(820, false);

  clapper1.initializeOscillator();
  clapper2.initializeOscillator();

  spacing = width/(pattern.length + 1);
}

class Clapper {
  constructor(frequency, is_static) {
    this.frequency = frequency;
    this.pattern = pattern.slice();
    this.phase = is_static ? 0 : 0.4;
    this.panning = is_static ? -0.8 : 0.8;

    this.env = new p5.Env();
    this.env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    this.env.setRange(attackLevel, releaseLevel);

    this.osc = new p5.Oscillator();
    this.osc.setType('sine');
    this.osc.amp(this.env);
    this.osc.freq(frequency);
    this.osc.phase(this.phase);
    this.osc.pan(this.panning);
  }

  initializeOscillator() {
    this.osc.start();
  }

  clap(delay) {
    if (this.pattern[index]) {
      if (delay)
        this.env.play(this.osc, 0.01);
      else
        this.env.play();
    }
  }

  shiftPattern() {
      let temp = this.pattern[0];
      this.pattern.shift();
      this.pattern.push(temp);
  }
}

function draw() {
  let now = millis();
  if (now > initialDelay && (now - lastClap > 180) ) {
    lastClap = millis();
    if (repetitions != 0 && repetitions % 4 == 0 && index == 0) {
      clapper2.shiftPattern();
      //console.log("shift");
    }

    clapper1.clap(false);
    clapper2.clap(true);

    index = (index + 1) % pattern.length;

    if (index == 0) {
      repetitions++;
      //console.log(repetitions);
    }
  }

  translate(0, height/2);
  let x = spacing;
  for(let i = 0; i < pattern.length; i++) {

    if (clapper1.pattern[i]) {
      fill(0,255, 0);
    } else {
      fill(255);
    }

    ellipse(x, -100, 30, 30);

    if (clapper2.pattern[i]) {
      fill(255,0,255);
    } else {
      fill(255);
    }

    ellipse(x, 20, 30, 30);

    x += spacing;
  }

}
