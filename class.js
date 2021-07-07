var controlsup  = "#controlsuperior";
var controlinf  = "#controlinferior";

dac = new Tone.Channel({
    volume:0,
    pan:0,
    channelCount:2
}).toDestination();

// var width = document.getElementById('continferior').clientWidth;
class Control {

  constructor() {

//Start Loop

    this.onoff = new Nexus.Add.Button(controlsup,{
      'size': [40,40],
      'mode': 'toggle',
      'state': false,
    })

//Randomizer
    this.set = new Nexus.Add.Button(controlsup,{ ////Random todo
      'size': [40,40],
      'mode': 'toggle',
      'state': false
    })

    this.tilt = new Nexus.Add.Tilt(controlsup,{
      'size': [40,40]
    });
    this.tilt.active=false;

    this.slidervol = new Nexus.Add.Slider(controlsup,{
      'size': [90, 40],
      'min': -100,
      'max': 0,
      'step': 1,
      'value': -100
    });

    this.wetdelay = new Nexus.Add.Dial(controlsup,{
      'size': [40, 40],
      'min': 0,
      'max': 1,
      'step': 0,
      'value': 0.5
    });

    this.dialverb = new Nexus.Add.Dial(controlsup,{
      'size': [40, 40],
      'min': -100,
      'max': 0,
      'step': 1,
      'value': -100
    });


    this.position = new Nexus.Add.Position(controlinf,{
      'size': [400,500],
      'mode': 'absolute',  // absolute or relative
      'x': 0.5,  // initial x value
      'minX': 30,
      'maxX': 100,
      'stepX': 1,
      'y': 0.5,  // initial y value
      'minY': 0,
      'maxY': 75,
      'stepY': 0
    });


    //
    // // create a meter on the destination node
    // this.meter = new Nexus.Add.Meter(control).connect(dac);
  }
  destroyer() {
    this.slidervol.destroy();
    this.dialdelay.destroy();
    this.dialverb.destroy();
    this.position.destroy();
    this.tilt.destroy();
    this.meter.destroy();
  }
}


class Player {
  //
  // player receives a singlge userdata object (not the array userData)
  //
  constructor() {
    // The Player's UserData (from the server)
    // this.oscid = ud.oscid;
    // this.id    = ud.id;
    // this.name  = ud.name;
    // this.time  = ud.time;



    this.freq = Tone.Midi(Nexus.rf(40,50));
    // The Player's main Synth:

    this.synth = new Tone.MonoSynth({
      detune: 0, //cents
      portamento: 0,
      volume: -Infinity,
      envelope: {
        attack: 0.5,
        attackCurve: "linear",
        decay: 0.3,
        decayCurve: "exponential",
        release: 0.8,
        releaseCurve: "exponential",
        sustain: 0
      },
      filter: {
        Q: 1,
        detune: 0,
        frequency: 1000, //position2
        gain: 0,
        rolloff: -12,
        type: "lowpass"
      },
      filterEnvelope: {
        attack: 0.001,
        attackCurve: "linear",
        decay: 0.7,
        decayCurve: "exponential",
        release: 0.8,
        releaseCurve: "exponential",
        sustain: 0,
        baseFrequency: 300,
        exponent: 2,
        octaves: 4
      },
      oscilator:{
        frequency: 220,
        type: "am" // Hz "fm", "am", or "fat" "pwm" or "pulse" //agregar text selector
      },
    });



    this.loop = new Tone.Loop((time) => {
      // channel.pan.rampTo(Nexus.rf(-1,1), vel * 0.1);
      // // vel = Nexus.rf(0.1, 1);
      let f = this.freq + Nexus.rf(-3, 3); // randomizar los valores
      this.freq = f //
      this.pitch(this.freq)
      // this.pitch(Nexus.rf(40, 50));
    },1);
    Tone.Transport.start();





    // The Player's Main Channel
    this.channel = new Tone.Channel();
    this.dist = new Tone.Distortion(0.8);

    // The Player's FEEDBACK DELAY
    this.fdelay = new Tone.FeedbackDelay({
      delayTime: "2n",
    	feedback: 0.5}).connect(dac);
    this.shift = new Tone.PitchShift(5);
    // this.synth.chain(this.shift, this.fdelay, dac);


    // The Player's EQUAL PANNER OBJ
    this.panner  = new Tone.Panner({pan:0});
    this.lfo = new Tone.LFO(0.1, -1,1).connect(this.panner.pan).start();

    // The FX CHAIN --> connects player to dac
    this.synth.chain(this.panner, this.channel, dac);
    this.synth.fan(this.fdelay)

    // console.log(Created synth:  + this.oscid);
  }
  vol(f) {
    // console.log(f)
    this.synth.volume.rampTo(f,0.1);
  }
  pitch(f) {
      this.freq = Tone.Midi(f);
      this.synth.triggerAttackRelease(this.freq)
  }
  detune(f) {
      this.synth.detune.rampTo(f, 0.1)
  }
  delaywet(f) {
        this.fdelay.wet.rampTo(f,0.1);
  }
  // harmonicity(f) {
  // //     this.synth.harmonicity = f;
  // // }
  // // mod(f) {
  // //     this.synth.modulationIndex = f;
  // // }
  // destroyer() {
  // console.log(Disconnecting synth:  + this.oscid);
  // ramp to -Infinity in 30 seconds, and out.
  // this.synth.dispose();
}
