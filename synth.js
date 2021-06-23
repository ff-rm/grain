var freq;
var vel = 120;
var atk = 0.01;
var rel = 0.1;
var mod_atk = 0.1;
var mod_rel = 0.2;
var modIndex = 12;
var det = 2;
var lfofreq = 20;
//Controles//
//boton on/off//



//Volumen//

var vol = new Nexus.Slider('#vol',{
  'size': [20,100],
  'min': -100,
  'max': 0,
  'step': 1,
  'value': -100,
});

var harmonicity = new Nexus.Slider('#harmo',{
	'size': [20,100],
	'min': 0,
	'max': 20,
	'step': 1,
	'value': 1
});

var lfopan = new Nexus.Slider('#lfopan',{
	'size': [20,100],
	'min': 0.1,
	'max': 20,
	'step': 1,
	'value': 1
});

var position = new Nexus.Position('#position',{
  'size': [200,200],
  'mode': 'absolute',  // "absolute" or "relative"
  'x': 0.5,  // initial x value
  'minX': 30,
  'maxX': 100,
  'stepX': 1,
  'y': 0.5,  // initial y value
  'minY': 1,
  'maxY': 24,
  'stepY': 1
})

const channel = new Tone.Channel({ volume: -100});

const lfo = new Tone.LFO(lfofreq, -1,1).connect(channel.pan).start();
const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5);

const synth = new Tone.MetalSynth({
  resonance : 1000,
  detune : det,
  harmonicity : 0,
  modulationIndex : modIndex,
  octaves : 1,
  volume : -1
});


synth.chain(feedbackDelay, channel, Tone.Destination);

//funciones
//On/Off
//Volumen
vol.on('change',function(v) {
    channel.volume.rampTo(v, 0.1);
})
harmonicity.on('change',function(v) {
    synth.harmonicity = v;
})

lfopan.on('change',function(v) {
    lfo.frequency.rampTo(v,5);
})

position.on('change',function(v) {
  freq = Tone.Midi(v.x);
  vel = Nexus.scale(v.y,1,24,240,2000);
	// freqarray = freq.harmonize([0,7]);
	synth.frequency.rampTo(freq/2,0.25);
  synth.resonance = freq/2;
  synth.harmonicity = v.y;
  Tone.Transport.bpm.rampTo(vel, 1);
	// console.log(freq);
})

const loop = new Tone.Loop((time) => {
  // channel.pan.rampTo(Nexus.rf(-1,1), vel * 0.1);
	vel = Nexus.rf(0.1, 1);
	// console.log(vel);
	synth.triggerAttackRelease(freq);
}, "4n").start(0);



//Analisis y Visualización
var meter = new Nexus.Meter('#met', {
	'size': [50,75]
});
meter.connect(channel);

var osci = new Nexus.Oscilloscope('#osci',{
  'size': [150,75]
});
osci.connect(channel);

// multislider.on('change',function(v) {
  //   	atk = v[0];
  //   	rel = v[1];
  //   	mod_atk = v[2];
  //   	mod_rel = v[3];
  //   console.log(v);
  // })
var onoff = new Nexus.Button('#onoff',{
  'size': [50,50],
})


onoff.on('change',function(v) {
    Tone.start();
    console.log("botton");
    Tone.Transport.start();
});

// rand.on('change',function(v) {
  //   console.log(atk);
  // })


// var select = new Nexus.Select('#sel',{
  //   'size': [100,30],
  //   'options': ['sine','triangle','square', 'sawtooth']
  // });

  // var multislider = new Nexus.Multislider('#multislider',{
    //  'size': [100,50],
    //  'numberOfSliders': 4,
    //  'min': 0.001,
    //  'max': 1,
    //  'step': 0,
    //  'candycane': 3,
    //  'values': [0.1,0.1,0.2,0.2],
    //  'smoothing': 0,
    //  'mode': 'bar'  // 'bar' or 'line'
    // })

    // var number = new Nexus.Number('#dial',{
      //   'size': [60,30],
      //   'value': 0,
      //   'min': 0,
      //   'max': 20,
      //   'step': 1
      // })


