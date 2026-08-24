see"use strict";

/* ============================================================
   IRON FURY
   MATCHED GAME ENGINE
   ============================================================ */

const THREE = window.THREE;

if (!THREE) {
  throw new Error("Three.js failed to load.");
}


/* ============================================================
   ELEMENT HELPER
   ============================================================ */

function $(id) {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(
      "Iron Fury missing HTML element: #" + id
    );
  }

  return element;
}


/* ============================================================
   DOM
   ============================================================ */

const canvas = $("gameCanvas");

const loadingScreen = $("loadingScreen");
const loadingProgress = $("loadingProgress");
const loadingText = $("loadingText");

const playerHealth = $("playerHealth");
const enemyHealth = $("enemyHealth");

const playerHealthText = $("playerHealthText");
const enemyHealthText = $("enemyHealthText");

const playerVitality = $("playerVitality");
const enemyVitality = $("enemyVitality");

const playerVitalityText = $("playerVitalityText");
const enemyVitalityText = $("enemyVitalityText");

const fury1 = $("fury1");
const fury2 = $("fury2");
const fury3 = $("fury3");

const enemyFury1 = $("enemyFury1");
const enemyFury2 = $("enemyFury2");
const enemyFury3 = $("enemyFury3");

const playerFuryText = $("playerFuryText");
const enemyFuryText = $("enemyFuryText");

const timer = $("timer");
const roundNumber = $("roundNumber");

const message = $("message");
const subMessage = $("subMessage");

const comboCounter = $("comboCounter");
const comboNumber = $("comboNumber");

const damageNumber = $("damageNumber");
const damageFlash = $("damageFlash");
const furyFlash = $("furyFlash");

const pauseButton = $("pauseButton");
const pauseMenu = $("pauseMenu");
const resumeButton = $("resumeButton");
const pauseRestartButton = $("pauseRestartButton");

const resultOverlay = $("resultOverlay");
const resultTitle = $("resultTitle");
const resultDescription = $("resultDescription");
const resultCombo = $("resultCombo");
const resultDamage = $("resultDamage");
const resultFury = $("resultFury");
const restartButton = $("restartButton");

const finishOverlay = $("finishOverlay");
const finishTitle = $("finishTitle");
const finishSubtitle = $("finishSubtitle");
const finishButton = $("finishButton");

const joystick = $("joystick");
const joystickKnob = $("joystickKnob");

const jumpButton = $("jumpButton");
const dashButton = $("dashButton");
const punchButton = $("punchButton");
const kickButton = $("kickButton");
const blockButton = $("blockButton");
const furyButton = $("furyButton");


/* ============================================================
   CONSTANTS
   ============================================================ */

const MAX_HEALTH = 100;
const MAX_VITALITY = 100;

const MAX_FURY = 3;

const ARENA_LIMIT = 8.5;

const PLAYER_SPEED = 4.8;
const ENEMY_SPEED = 3.2;

const GRAVITY = 21;
const JUMP_FORCE = 8;

const ROUND_TIME = 60;

const COMBO_TIME = 1.15;


/* ============================================================
   GAME STATE
   ============================================================ */

const game = {

  running: false,

  paused: false,

  ended: false,

  time: ROUND_TIME,

  round: 1,

  maxCombo: 0,

  totalDamage: 0,

  cameraShake: 0

};


/* ============================================================
   INPUT
   ============================================================ */

const input = {

  left: false,

  right: false

};

const stick = {

  active: false,

  x: 0,

  y: 0

};


/* ============================================================
   RENDERER
   ============================================================ */

const renderer =
  new THREE.WebGLRenderer({

    canvas: canvas,

    antialias: true,

    powerPreference: "high-performance"

  });

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio || 1,
    2
  )
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;


/* ============================================================
   SCENE
   ============================================================ */

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(
    0x05080c
  );

scene.fog =
  new THREE.Fog(
    0x05080c,
    15,
    35
  );


/* ============================================================
   CAMERA
   ============================================================ */

const camera =
  new THREE.PerspectiveCamera(

    45,

    window.innerWidth /
      window.innerHeight,

    0.1,

    100

  );

camera.position.set(
  0,
  4.7,
  13
);

camera.lookAt(
  0,
  2.2,
  0
);


/* ============================================================
   LIGHTING
   ============================================================ */

scene.add(
  new THREE.HemisphereLight(
    0x8fc8ff,
    0x101010,
    1.8
  )
);

const sun =
  new THREE.DirectionalLight(
    0xffffff,
    2.5
  );

sun.position.set(
  4,
  10,
  7
);

sun.castShadow = true;

scene.add(sun);

const blueLight =
  new THREE.PointLight(
    0x18aaff,
    8,
    15
  );

blueLight.position.set(
  -8,
  4,
  2
);

scene.add(blueLight);

const redLight =
  new THREE.PointLight(
    0xff304d,
    8,
    15
  );

redLight.position.set(
  8,
  4,
  2
);

scene.add(redLight);


/* ============================================================
   MATERIAL
   ============================================================ */

function mat(color, metal = 0.15) {

  return new THREE.MeshStandardMaterial({

    color: color,

    roughness: 0.58,

    metalness: metal

  });

}


/* ============================================================
   ARENA
   ============================================================ */

const floor =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      22,
      14
    ),

    mat(0x111920, 0.35)

  );

floor.rotation.x =
  -Math.PI / 2;

floor.receiveShadow = true;

scene.add(floor);


/* ============================================================
   GRID
   ============================================================ */

const grid =
  new THREE.GridHelper(
    18,
    36,
    0x39515e,
    0x18252d
  );

grid.position.y =
  0.01;

scene.add(grid);


/* ============================================================
   BACK WALL
   ============================================================ */

const backWall =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      22,
      8,
      0.5
    ),

    mat(0x091016)

  );

backWall.position.set(
  0,
  4,
  -5
);

backWall.receiveShadow = true;

scene.add(backWall);


/* ============================================================
   ARENA SIDE MARKERS
   ============================================================ */

function arenaMarker(x) {

  const marker =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.15,
        2.5,
        0.15
      ),

      new THREE.MeshBasicMaterial({
        color: 0x28d7ff
      })

    );

  marker.position.set(
    x,
    1.25,
    -0.4
  );

  scene.add(marker);

}

arenaMarker(-9);
arenaMarker(9);


/* ============================================================
   PARTICLES
   ============================================================ */

const particles = [];

function particlesBurst(
  position,
  color,
  count = 12
) {

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const p =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.045,
          6,
          6
        ),

        new THREE.MeshBasicMaterial({
          color: color
        })

      );

    p.position.copy(
      position
    );

    p.userData.life =
      0.35 +
      Math.random() * 0.35;

    p.userData.velocity =
      new THREE.Vector3(

        (Math.random() - 0.5) * 4,

        Math.random() * 4,

        (Math.random() - 0.5) * 3

      );

    scene.add(p);

    particles.push(p);

  }

}

function updateParticles(dt) {

  for (
    let i = particles.length - 1;
    i >= 0;
    i--
  ) {

    const p =
      particles[i];

    p.userData.life -=
      dt;

    p.userData.velocity.y -=
      10 * dt;

    p.position.addScaledVector(
      p.userData.velocity,
      dt
    );

    if (
      p.userData.life <= 0
    ) {

      scene.remove(p);

      p.geometry.dispose();

      p.material.dispose();

      particles.splice(
        i,
        1
      );

    }

  }

}


/* ============================================================
   FIGHTER
   ============================================================ */

class Fighter {

  constructor(
    name,
    color,
    accent,
    playerControlled
  ) {

    this.name = name;

    this.color = color;

    this.accent = accent;

    this.playerControlled =
      playerControlled;

    this.group =
      new THREE.Group();

    this.health =
      MAX_HEALTH;

    this.vitality =
      MAX_VITALITY;

    this.fury = 0;

    this.combo = 0;

    this.comboTimer = 0;

    this.grounded = true;

    this.velocity =
      new THREE.Vector3();

    this.facing =
      playerControlled
        ? 1
        : -1;

    this.blocking = false;

    this.attacking = false;

    this.attack = null;

    this.attackTime = 0;

    this.hitConfirmed = false;

    this.hitStun = 0;

    this.dashTime = 0;

    this.invincible = false;

    this.damageDone = 0;

    this.furyUsed = 0;

    this.createModel();

    scene.add(
      this.group
    );

  }


  /* ========================================================
     MODEL
     ======================================================== */
/* ========================================================
   UPGRADED IRON FURY FIGHTER MODEL
   Kai = athletic martial artist
   Rocco = heavy muscular grappler
   ======================================================== */

createModel() {

  /* ------------------------------------------------------
     MATERIALS
     ------------------------------------------------------ */

  const skin = mat(0xc88968, 0.05);

  const skinDark = mat(0x8f553f, 0.05);

  const suit = mat(this.color, 0.32);

  const accent = mat(this.accent, 0.45);

  const dark = mat(0x101419, 0.5);

  const belt = mat(
    this.playerControlled
      ? 0x111111
      : 0x180d0d,
    0.25
  );

  const glove = mat(
    this.playerControlled
      ? 0x11161b
      : 0x161616,
    0.4
  );

  const red = mat(0x8f1828, 0.3);

  /* ------------------------------------------------------
     MAIN GROUP
     ------------------------------------------------------ */

  this.body = new THREE.Group();

  this.group.add(this.body);


  /* ------------------------------------------------------
     TORSO
     ------------------------------------------------------ */

  this.torso = new THREE.Mesh(

    new THREE.BoxGeometry(
      this.playerControlled ? 1.15 : 1.35,
      this.playerControlled ? 1.45 : 1.55,
      0.68
    ),

    suit

  );

  this.torso.position.y = 2.65;

  this.torso.castShadow = true;

  this.body.add(this.torso);


  /* ------------------------------------------------------
     SHOULDERS
     ------------------------------------------------------ */

  const shoulderWidth =
    this.playerControlled
      ? 0.72
      : 0.9;

  this.shoulders = new THREE.Mesh(

    new THREE.BoxGeometry(
      shoulderWidth * 2,
      0.35,
      0.72
    ),

    suit

  );

  this.shoulders.position.y = 3.15;

  this.shoulders.castShadow = true;

  this.body.add(this.shoulders);


  /* ------------------------------------------------------
     CHEST
     ------------------------------------------------------ */

  const chest = new THREE.Mesh(

    new THREE.BoxGeometry(
      this.playerControlled ? 0.8 : 1.0,
      0.48,
      0.74
    ),

    accent

  );

  chest.position.set(
    0,
    2.82,
    0.34
  );

  chest.castShadow = true;

  this.body.add(chest);


  /* ------------------------------------------------------
     CHEST STRAP / GI COLLAR
     ------------------------------------------------------ */

  if (this.playerControlled) {

    const collar = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.18,
        0.95,
        0.06
      ),

      dark

    );

    collar.position.set(
      0,
      2.9,
      0.39
    );

    collar.rotation.z =
      Math.PI * 0.15;

    this.body.add(collar);

  } else {

    /* Rocco chest armor */

    const armor = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.9,
        0.75,
        0.08
      ),

      dark

    );

    armor.position.set(
      0,
      2.8,
      0.39
    );

    this.body.add(armor);

  }


  /* ------------------------------------------------------
     HEAD
     ------------------------------------------------------ */

  this.head = new THREE.Mesh(

    new THREE.SphereGeometry(
      this.playerControlled
        ? 0.42
        : 0.48,
      18,
      14
    ),

    skin

  );

  this.head.position.y =
    this.playerControlled
      ? 3.88
      : 3.98;

  this.head.scale.set(
    1,
    1.08,
    0.92
  );

  this.head.castShadow = true;

  this.body.add(this.head);


  /* ------------------------------------------------------
     HAIR
     ------------------------------------------------------ */

  if (this.playerControlled) {

    const hair = new THREE.Mesh(

      new THREE.SphereGeometry(
        0.43,
        14,
        8
      ),

      dark

    );

    hair.scale.set(
      1.02,
      0.48,
      1
    );

    hair.position.set(
      0,
      4.15,
      -0.02
    );

    this.body.add(hair);

  } else {

    /* Rocco bald head + beard */

    const beard = new THREE.Mesh(

      new THREE.SphereGeometry(
        0.28,
        12,
        8
      ),

      skinDark

    );

    beard.scale.set(
      0.8,
      0.65,
      0.65
    );

    beard.position.set(
      0,
      3.72,
      0.3
    );

    this.body.add(beard);

  }


  /* ------------------------------------------------------
     FACE / VISOR
     ------------------------------------------------------ */

  const face = new THREE.Mesh(

    new THREE.BoxGeometry(
      0.55,
      0.12,
      0.06
    ),

    dark

  );

  face.position.set(
    0,
    this.playerControlled
      ? 3.92
      : 4.02,
    0.42
  );

  this.body.add(face);


  /* ------------------------------------------------------
     NECK
     ------------------------------------------------------ */

  const neck = new THREE.Mesh(

    new THREE.CylinderGeometry(
      this.playerControlled
        ? 0.19
        : 0.25,
      this.playerControlled
        ? 0.22
        : 0.29,
      0.32,
      10
    ),

    skin

  );

  neck.position.y = 3.45;

  neck.castShadow = true;

  this.body.add(neck);


  /* ------------------------------------------------------
     ARMS
     ------------------------------------------------------ */

  this.leftArm = this.createArm(
    suit,
    glove,
    skin,
    -1
  );

  this.rightArm = this.createArm(
    suit,
    glove,
    skin,
    1
  );


  this.leftArm.position.set(
    -shoulderWidth,
    3.05,
    0
  );

  this.rightArm.position.set(
    shoulderWidth,
    3.05,
    0
  );

  this.body.add(
    this.leftArm,
    this.rightArm
  );


  /* ------------------------------------------------------
     LEGS
     ------------------------------------------------------ */

  const legMaterial =
    this.playerControlled
      ? suit
      : dark;

  this.leftLeg =
    this.createLeg(
      legMaterial,
      skin
    );

  this.rightLeg =
    this.createLeg(
      legMaterial,
      skin
    );


  this.leftLeg.position.set(
    -0.32,
    1.65,
    0
  );

  this.rightLeg.position.set(
    0.32,
    1.65,
    0
  );

  this.body.add(
    this.leftLeg,
    this.rightLeg
  );


  /* ------------------------------------------------------
     BELT
     ------------------------------------------------------ */

  this.belt = new THREE.Mesh(

    new THREE.BoxGeometry(
      this.playerControlled
        ? 1.2
        : 1.45,
      0.25,
      0.74
    ),

    belt

  );

  this.belt.position.y = 1.98;

  this.belt.castShadow = true;

  this.body.add(this.belt);


  /* ------------------------------------------------------
     KAI GI BELT STRAPS
     ------------------------------------------------------ */

  if (this.playerControlled) {

    this.beltTail1 = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.12,
        0.65,
        0.08
      ),

      belt

    );

    this.beltTail1.position.set(
      -0.12,
      1.65,
      0.4
    );

    this.beltTail1.rotation.z = -0.15;

    this.body.add(this.beltTail1);


    this.beltTail2 =
      this.beltTail1.clone();

    this.beltTail2.position.x =
      0.12;

    this.beltTail2.rotation.z =
      0.15;

    this.body.add(this.beltTail2);

  }


  /* ------------------------------------------------------
     Rocco RED ARM / LEG ACCENTS
     ------------------------------------------------------ */

  if (!this.playerControlled) {

    const redChest = new THREE.Mesh(

      new THREE.BoxGeometry(
        0.95,
        0.12,
        0.1
      ),

      red

    );

    redChest.position.set(
      0,
      2.45,
      0.4
    );

    this.body.add(redChest);

  }


  this.resetPose();

}


/* ========================================================
   ARM CREATOR
   ======================================================== */

createArm(
  suit,
  glove,
  skin,
  side
) {

  const arm =
    new THREE.Group();

  const upperArm =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        this.playerControlled
          ? 0.17
          : 0.25,
        this.playerControlled
          ? 0.19
          : 0.27,
        this.playerControlled
          ? 0.7
          : 0.82,
        10
      ),

      suit

    );

  upperArm.position.y =
    -0.34;

  upperArm.castShadow = true;

  arm.add(upperArm);


  /* FOREARM */

  const forearm =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        this.playerControlled
          ? 0.16
          : 0.24,
        this.playerControlled
          ? 0.18
          : 0.26,
        this.playerControlled
          ? 0.62
          : 0.72,
        10
      ),

      this.playerControlled
        ? suit
        : skin

    );

  forearm.position.y =
    -0.9;

  forearm.castShadow = true;

  arm.add(forearm);


  /* GLOVE */

  const fist =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        this.playerControlled
          ? 0.20
          : 0.27,
        12,
        10
      ),

      glove

    );

  fist.position.y =
    -1.32;

  fist.scale.set(
    1,
    0.9,
    0.85
  );

  fist.castShadow = true;

  arm.add(fist);


  return arm;

}


/* ========================================================
   LEG CREATOR
   ======================================================== */

createLeg(
  material,
  skin
) {

  const leg =
    new THREE.Group();


  const thigh =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        this.playerControlled
          ? 0.23
          : 0.31,
        this.playerControlled
          ? 0.25
          : 0.34,
        this.playerControlled
          ? 0.85
          : 1.0,
        10
      ),

      material

    );

  thigh.position.y =
    -0.42;

  thigh.castShadow = true;

  leg.add(thigh);


  const shin =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        this.playerControlled
          ? 0.19
          : 0.27,
        this.playerControlled
          ? 0.21
          : 0.29,
        this.playerControlled
          ? 0.85
          : 0.95,
        10
      ),

      this.playerControlled
        ? skin
        : material

    );

  shin.position.y =
    -1.2;

  shin.castShadow = true;

  leg.add(shin);


  /* FOOT */

  const foot =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        this.playerControlled
          ? 0.38
          : 0.48,
        0.22,
        this.playerControlled
          ? 0.62
          : 0.76
      ),

      this.playerControlled
        ? skin
        : mat(0x101010, 0.45)

    );

  foot.position.set(
    0,
    -1.73,
    0.16
  );

  foot.castShadow = true;

  leg.add(foot);


  return leg;

}


/* ========================================================
   RESET POSE
   ======================================================== */

resetPose() {

  /* Arms */

  this.leftArm.rotation.set(
    0.15,
    0,
    0.22
  );

  this.rightArm.rotation.set(
    0.15,
    0,
    -0.22
  );


  /* Legs */

  this.leftLeg.rotation.set(
    0,
    0,
    0
  );

  this.rightLeg.rotation.set(
    0,
    0,
    0
  );


  /* Body */

  this.body.rotation.set(
    0,
    0,
    0
  );

  this.body.scale.set(
    1,
    1,
    1
  );


  /* Torso */

  if (this.torso) {

    this.torso.rotation.set(
      0,
      0,
      0
    );

  }

}


/* ========================================================
   UPGRADED FIGHTING ANIMATION
   ======================================================== */

animate() {

  const now =
    performance.now() * 0.001;

  const idle =
    Math.sin(now * 3);


  /* ------------------------------------------------------
     BLOCK
     ------------------------------------------------------ */

  if (this.blocking) {

    this.leftArm.rotation.x =
      -1.25;

    this.rightArm.rotation.x =
      -1.25;

    this.leftArm.rotation.z =
      0.65;

    this.rightArm.rotation.z =
      -0.65;

    this.body.rotation.z =
      Math.sin(now * 5) * 0.025;

    return;

  }


  /* ------------------------------------------------------
     ATTACK
     ------------------------------------------------------ */

  if (this.attacking) {

    const duration =
      this.attack === "punch"
        ? 0.42
        : this.attack === "kick"
          ? 0.55
          : 1.15;

    const progress =
      THREE.MathUtils.clamp(
        1 -
        this.attackTime /
        duration,
        0,
        1
      );


    /* Smooth attack curve */

    const attackCurve =
      Math.sin(
        progress *
        Math.PI
      );


    /* --------------------------------------------------
       PUNCH
       -------------------------------------------------- */

    if (
      this.attack === "punch"
    ) {

      const arm =
        this.facing === 1
          ? this.rightArm
          : this.leftArm;

      const other =
        this.facing === 1
          ? this.leftArm
          : this.rightArm;


      arm.rotation.x =
        -2.25 *
        attackCurve;

      arm.rotation.z =
        -0.18 *
        this.facing *
        attackCurve;


      other.rotation.x =
        -0.65 *
        attackCurve;


      this.body.rotation.y =
        0.18 *
        this.facing *
        attackCurve;


      this.body.rotation.z =
        -0.05 *
        attackCurve;

    }


    /* --------------------------------------------------
       KICK
       -------------------------------------------------- */

    if (
      this.attack === "kick"
    ) {

      const leg =
        this.facing === 1
          ? this.rightLeg
          : this.leftLeg;

      const other =
        this.facing === 1
          ? this.leftLeg
          : this.rightLeg;


      leg.rotation.x =
        -1.85 *
        attackCurve;


      leg.rotation.z =
        0.18 *
        this.facing *
        attackCurve;


      other.rotation.x =
        0.2 *
        attackCurve;


      this.body.rotation.y =
        -0.15 *
        this.facing *
        attackCurve;


      this.body.rotation.z =
        0.06 *
        attackCurve;

    }


    /* --------------------------------------------------
       FURY
       -------------------------------------------------- */

    if (
      this.attack === "fury"
    ) {

      const pulse =
        1 +
        Math.sin(now * 15) *
        0.045;


      this.body.scale.set(
        pulse,
        pulse,
        pulse
      );


      this.leftArm.rotation.x =
        -1.65;

      this.rightArm.rotation.x =
        -1.65;


      this.leftArm.rotation.z =
        0.4;

      this.rightArm.rotation.z =
        -0.4;


      this.leftLeg.rotation.x =
        -0.3;

      this.rightLeg.rotation.x =
        0.3;


      this.body.rotation.y =
        Math.sin(now * 10) *
        0.08;

      return;

    }


    return;

  }


  /* ------------------------------------------------------
     JUMP
     ------------------------------------------------------ */

  if (!this.grounded) {

    this.leftLeg.rotation.x =
      -0.5;

    this.rightLeg.rotation.x =
      0.5;


    this.leftArm.rotation.x =
      -0.4;

    this.rightArm.rotation.x =
      -0.4;


    this.body.rotation.z =
      0;

    return;

  }


  /* ------------------------------------------------------
     IDLE / FIGHTING STANCE
     ------------------------------------------------------ */

  this.leftArm.rotation.x =
    0.15 +
    idle * 0.06;

  this.rightArm.rotation.x =
    0.15 -
    idle * 0.06;


  this.leftArm.rotation.z =
    0.22;

  this.rightArm.rotation.z =
    -0.22;


  this.leftLeg.rotation.x =
    -idle * 0.025;

  this.rightLeg.rotation.x =
    idle * 0.025;


  /* Breathing */

  const breathing =
    1 +
    Math.sin(now * 2.2) *
    0.012;

  this.body.scale.y =
    breathing;

}


/* ========================================================
   HIT REACTION
   ======================================================== */

animateHit() {

  const reaction =
    Math.sin(
      performance.now() *
      0.035
    );


  this.body.rotation.z =
    0.18 *
    this.facing;


  this.body.rotation.y =
    -0.12 *
    this.facing;


  this.leftArm.rotation.z =
    0.5;

  this.rightArm.rotation.z =
    -0.5;


  this.leftArm.rotation.x =
    0.5 +
    reaction * 0.15;

  this.rightArm.rotation.x =
    0.5 -
    reaction * 0.15;

}
  
    
        

  limb(
    radius,
    length,
    material
  ) {

    const pivot =
      new THREE.Group();

    const mesh =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          radius,
          radius,
          length,
          10
        ),

        material

      );

    mesh.position.y =
      -length / 2;

    mesh.castShadow = true;

    pivot.add(mesh);

    return pivot;

  }


  resetPose() {

    this.leftArm.rotation.set(
      0.1,
      0,
      0.15
    );

    this.rightArm.rotation.set(
      0.1,
      0,
      -0.15
    );

    this.leftLeg.rotation.set(
      0,
      0,
      0
    );

    this.rightLeg.rotation.set(
      0,
      0,
      0
    );

    this.body.scale.set(
      1,
      1,
      1
    );

  }


  /* ========================================================
     UPDATE
     ======================================================== */

  update(dt, opponent) {

    if (
      this.hitStun > 0
    ) {

      this.hitStun -= dt;

      this.blocking = false;

      this.physics(dt);

      this.animateHit();

      return;

    }


    if (
      this.dashTime > 0
    ) {

      this.dashTime -= dt;

      this.group.position.x +=
        this.facing *
        13 *
        dt;

      this.invincible = true;

    } else {

      this.invincible = false;

    }


    if (
      this.attacking
    ) {

      this.updateAttack(
        dt,
        opponent
      );

    }


    this.physics(dt);

    this.faceOpponent(
      opponent
    );

    this.animate();

    this.limitPosition();

    this.comboTimer -= dt;

    if (
      this.comboTimer <= 0
    ) {

      this.combo = 0;

    }

  }


  /* ========================================================
     PHYSICS
     ======================================================== */

  physics(dt) {

    if (
      !this.grounded
    ) {

      this.velocity.y -=
        GRAVITY * dt;

      this.group.position.y +=
        this.velocity.y *
        dt;

      if (
        this.group.position.y <=
        0
      ) {

        this.group.position.y =
          0;

        this.velocity.y =
          0;

        this.grounded =
          true;

      }

    }

  }


  /* ========================================================
     MOVEMENT
     ======================================================== */

  move(direction, dt) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0 ||
      this.dashTime > 0
    ) {

      return;

    }

    const speed =
      this.playerControlled
        ? PLAYER_SPEED
        : ENEMY_SPEED;

    this.group.position.x +=
      direction *
      speed *
      dt;

  }


  jump() {

    if (
      !this.grounded ||
      this.attacking ||
      this.blocking
    ) {

      return;

    }

    this.velocity.y =
      JUMP_FORCE;

    this.grounded =
      false;

  }


  dash() {

    if (
      this.dashTime > 0 ||
      this.hitStun > 0
    ) {

      return;

    }

    this.dashTime =
      0.18;

    particlesBurst(
      new THREE.Vector3(
        this.group.position.x,
        1,
        0
      ),
      this.accent,
      8
    );

  }


  block(value) {

    if (
      this.attacking ||
      this.hitStun > 0
    ) {

      this.blocking = false;

      return;

    }

    this.blocking =
      value;

  }


  /* ========================================================
     ATTACK
     ======================================================== */

  startAttack(type) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;

    }

    this.attacking = true;

    this.attack = type;

    this.hitConfirmed = false;

    this.attackTime =
      type === "punch"
        ? 0.42
        : type === "kick"
          ? 0.55
          : 1.15;

  }


  updateAttack(
    dt,
    opponent
  ) {

    this.attackTime -= dt;

    const duration =
      this.attack === "punch"
        ? 0.42
        : this.attack === "kick"
          ? 0.55
          : 1.15;

    const progress =
      1 -
      this.attackTime /
        duration;


    if (
      !this.hitConfirmed &&
      progress > 0.3 &&
      progress < 0.72
    ) {

      this.hitConfirmed =
        true;

      const distance =
        Math.abs(
          opponent.group.position.x -
          this.group.position.x
        );

      const range =
        this.attack === "kick"
          ? 2.05
          : this.attack === "fury"
            ? 3.2
            : 1.7;

      if (
        distance <= range
      ) {

        let damage = 0;

        if (
          this.attack ===
          "punch"
        ) {

          damage = 7;

        } else if (
          this.attack ===
          "kick"
        ) {

          damage = 10;

        } else {

          damage =
            15 +
            this.furyUsed * 8;

        }

        opponent.takeDamage(
          damage,
          this
        );

      }

    }


    if (
      this.attackTime <= 0
    ) {

      this.attacking =
        false;

      this.attack = null;

      this.attackTime = 0;

      this.body.scale.set(
        1,
        1,
        1
      );

    }

  }


  /* ========================================================
     DAMAGE
     ======================================================== */

  takeDamage(
    damage,
    attacker
  ) {

    if (
      this.invincible ||
      game.ended
    ) {

      return;

    }

    let actual =
      damage;


    if (
      this.blocking
    ) {

      actual *= 0.2;

      this.vitality =
        Math.max(
          0,
          this.vitality -
            damage * 0.15
        );

    } else {

      this.vitality =
        Math.max(
          0,
          this.vitality -
            damage * 0.08
        );

      this.hitStun =
        0.2;

      this.velocity.x =
        attacker.facing * 2;

      this.comboTimer =
        COMBO_TIME;

    }


    this.health =
      Math.max(
        0,
        this.health -
          actual
      );


    attacker.damageDone +=
      actual;


    if (
      attacker.playerControlled
    ) {

      attacker.combo++;

      attacker.comboTimer =
        COMBO_TIME;

      game.maxCombo =
        Math.max(
          game.maxCombo,
          attacker.combo
        );

      game.totalDamage +=
        actual;

      gainFury(
        attacker,
        actual
      );

      showDamage(
        actual
      );

    }


    game.cameraShake =
      Math.min(
        0.25,
        game.cameraShake +
          0.09
      );


    particlesBurst(

      new THREE.Vector3(
        this.group.position.x,
        2.5,
        0.5
      ),

      this.blocking
        ? 0xb76cff
        : 0xffbf3d,

      this.blocking
        ? 7
        : 12

    );


    updateHUD();


    if (
      this.health <= 0
    ) {

      this.health = 0;

      checkWinner();

    }

  }


  /* ========================================================
     FURY
     ======================================================== */

  useFury() {

    const level =
      Math.floor(
        this.fury
      );

    if (
      level < 1 ||
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;

    }

    this.fury = 0;

    this.furyUsed +=
      level;

    this.attacking =
      true;

    this.attack =
      "fury";

    this.attackTime =
      1.15;

    this.hitConfirmed =
      false;

    furyFlash.classList.remove(
      "active"
    );

    void furyFlash.offsetWidth;

    furyFlash.classList.add(
      "active"
    );

    particlesBurst(

      new THREE.Vector3(
        this.group.position.x,
        2.5,
        0
      ),

      this.accent,

      35

    );

    updateHUD();

  }


  /* ========================================================
     ANIMATION
     ======================================================== */

  animate() {

    const time =
      performance.now() *
      0.008;


    if (
      this.blocking
    ) {

      this.leftArm.rotation.x =
        -0.7;

      this.rightArm.rotation.x =
        -0.7;

      this.leftArm.rotation.z =
        0.65;

      this.rightArm.rotation.z =
        -0.65;

      return;

    }


    if (
      this.attacking
    ) {

      const progress =
        1 -
        this.attackTime /
          (
            this.attack ===
              "punch"
              ? 0.42
              : this.attack ===
                  "kick"
                ? 0.55
                : 1.15
          );

      const swing =
        Math.sin(
          Math.min(
            1,
            progress
          ) *
          Math.PI
        );


      if (
        this.attack ===
        "punch"
      ) {

        if (
          this.facing === 1
        ) {

          this.rightArm.rotation.x =
            -1.7 * swing;

          this.rightArm.rotation.z =
            -0.3 * swing;

        } else {

          this.leftArm.rotation.x =
            -1.7 * swing;

          this.leftArm.rotation.z =
            0.3 * swing;

        }

      }


      if (
        this.attack ===
        "kick"
      ) {

        if (
          this.facing === 1
        ) {

          this.rightLeg.rotation.x =
            -1.45 * swing;

        } else {

          this.leftLeg.rotation.x =
            -1.45 * swing;

        }

      }


      if (
        this.attack ===
        "fury"
      ) {

        const pulse =
          1 +
          Math.sin(
            time * 4
          ) *
          0.08;

        this.body.scale.set(
          pulse,
          pulse,
          pulse
        );

        this.leftArm.rotation.x =
          -1.4;

        this.rightArm.rotation.x =
          -1.4;

        this.leftLeg.rotation.x =
          -0.25;

        this.rightLeg.rotation.x =
          0.25;

      }

      return;

    }


    if (
      !this.grounded
    ) {

      this.leftLeg.rotation.x =
        -0.3;

      this.rightLeg.rotation.x =
        0.3;

      return;

    }


    const walking =
      Math.sin(
        performance.now() *
        0.012
      );

    this.leftArm.rotation.x =
      walking * 0.18;

    this.rightArm.rotation.x =
      -walking * 0.18;

    this.leftLeg.rotation.x =
      -walking * 0.15;

    this.rightLeg.rotation.x =
      walking * 0.15;

  }


  animateHit() {

    this.torso.rotation.z =
      0.2 * this.facing;

    this.leftArm.rotation.z =
      0.45;

    this.rightArm.rotation.z =
      -0.45;

  }


  /* ========================================================
     FACING
     ======================================================== */

  faceOpponent(
    opponent
  ) {

    if (
      this.attacking
    ) {

      return;

    }

    this.facing =
      opponent.group.position.x >
      this.group.position.x
        ? 1
        : -1;

    this.group.rotation.y =
      this.facing === 1
        ? 0
        : Math.PI;

  }


  /* ========================================================
     LIMIT
     ======================================================== */

  limitPosition() {

    this.group.position.x =
      THREE.MathUtils.clamp(
        this.group.position.x,
        -ARENA_LIMIT,
        ARENA_LIMIT
      );

  }

}


/* ============================================================
   CREATE FIGHTERS
   ============================================================ */

const player =
  new Fighter(
    "IRON FURY",
    0x263b46,
    0x28d7ff,
    true
  );

const enemy =
  new Fighter(
    "RIVAL",
    0x4a2029,
    0xff4057,
    false
  );

player.group.position.x =
  -3.8;

enemy.group.position.x =
  3.8;


/* ============================================================
   FURY
   ============================================================ */

function gainFury(
  fighter,
  damage
) {

  fighter.fury =
    Math.min(
      MAX_FURY,
      fighter.fury +
        (damage >= 8
          ? 0.16
          : 0.1)
    );

  fighter.fury =
    Math.floor(
      fighter.fury * 10
    ) / 10;

}


/* ============================================================
   PLAYER UPDATE
   ============================================================ */

function updatePlayer(dt) {

  let direction = 0;

  if (
    stick.x < -0.2 ||
    input.left
  ) {

    direction -= 1;

  }

  if (
    stick.x > 0.2 ||
    input.right
  ) {

    direction += 1;

  }

  player.move(
    direction,
    dt
  );

}


/* ============================================================
   ENEMY AI
   ============================================================ */

let aiTimer = 0;

function updateEnemy(dt) {

  aiTimer -= dt;

  if (
    aiTimer > 0
  ) {

    return;

  }

  aiTimer =
    0.15 +
    Math.random() * 0.2;

  const distance =
    player.group.position.x -
    enemy.group.position.x;

  const absolute =
    Math.abs(distance);


  if (
    absolute > 2
  ) {

    enemy.move(
      Math.sign(distance),
      dt * 2.5
    );

    return;

  }


  const choice =
    Math.random();


  if (
    choice < 0.35
  ) {

    enemy.startAttack(
      "punch"
    );

  } else if (
    choice < 0.55
  ) {

    enemy.startAttack(
      "kick"
    );

  } else if (
    choice < 0.72
  ) {

    enemy.block(true);

    setTimeout(
      () => enemy.block(false),
      350
    );

  } else if (
    enemy.fury >= 1
  ) {

    enemy.useFury();

  }

}


/* ============================================================
   CAMERA
   ============================================================ */

function updateCamera() {

  const center =
    (
      player.group.position.x +
      enemy.group.position.x
    ) / 2;

  const distance =
    Math.abs(
      player.group.position.x -
      enemy.group.position.x
    );

  const targetZ =
    THREE.MathUtils.clamp(
      12 +
        distance * 0.35,
      11,
      16
    );


  let shakeX = 0;
  let shakeY = 0;


  if (
    game.cameraShake > 0
  ) {

    shakeX =
      (Math.random() - 0.5) *
      game.cameraShake;

    shakeY =
      (Math.random() - 0.5) *
      game.cameraShake;

    game.cameraShake *=
      0.88;

  }


  camera.position.x +=
    (
      center +
      shakeX -
      camera.position.x
    ) * 0.08;

  camera.position.y +=
    (
      4.7 +
      shakeY -
      camera.position.y
    ) * 0.08;

  camera.position.z +=
    (
      targetZ -
      camera.position.z
    ) * 0.08;

  camera.lookAt(
    center,
    2.2,
    0
  );

}


/* ============================================================
   HUD
   ============================================================ */

function updateHUD() {

  playerHealth.style.width =
    player.health + "%";

  enemyHealth.style.width =
    enemy.health + "%";

  playerVitality.style.width =
    player.vitality + "%";

  enemyVitality.style.width =
    enemy.vitality + "%";


  playerHealthText.textContent =
    Math.ceil(
      player.health
    );

  enemyHealthText.textContent =
    Math.ceil(
      enemy.health
    );

  playerVitalityText.textContent =
    Math.ceil(
      player.vitality
    );

  enemyVitalityText.textContent =
    Math.ceil(
      enemy.vitality
    );


  playerFuryText.textContent =
    Math.floor(
      player.fury
    ) +
    " / 3";

  enemyFuryText.textContent =
    Math.floor(
      enemy.fury
    ) +
    " / 3";


  const playerFury =
    Math.floor(
      player.fury
    );

  const enemyFury =
    Math.floor(
      enemy.fury
    );


  const playerSlots = [
    fury1,
    fury2,
    fury3
  ];

  const enemySlots = [
    enemyFury1,
    enemyFury2,
    enemyFury3
  ];


  playerSlots.forEach(
    (slot, index) => {

      slot.classList.toggle(
        "active",
        index < playerFury
      );

      slot.classList.toggle(
        "ready",
        playerFury === 3
      );

    }
  );


  enemySlots.forEach(
    (slot, index) => {

      slot.classList.toggle(
        "active",
        index < enemyFury
      );

      slot.classList.toggle(
        "ready",
        enemyFury === 3
      );

    }
  );


  furyButton.classList.toggle(
    "ready",
    playerFury >= 1
  );


  comboNumber.textContent =
    player.combo;

  comboCounter.classList.toggle(
    "visible",
    player.combo > 0
  );


  timer.textContent =
    Math.max(
      0,
      Math.ceil(game.time)
    );

}


/* ============================================================
   DAMAGE DISPLAY
   ============================================================ */

function showDamage(
  amount
) {

  damageNumber.textContent =
    Math.round(amount);

  damageNumber.classList.remove(
    "show"
  );

  void damageNumber.offsetWidth;

  damageNumber.classList.add(
    "show"
  );


  damageFlash.classList.remove(
    "active"
  );

  void damageFlash.offsetWidth;

  damageFlash.classList.add(
    "active"
  );

}


/* ============================================================
   WINNER
   ============================================================ */

function checkWinner() {

  if (
    game.ended
  ) {

    return;

  }


  if (
    enemy.health <= 0
  ) {

    finishOverlay.classList.remove(
      "hidden"
    );

    finishTitle.textContent =
      "FURY FINISH";

    finishSubtitle.textContent =
      "THE RIVAL HAS FALLEN";

    return;

  }


  if (
    player.health <= 0
  ) {

    endGame(
      false,
      "THE RIVAL WINS"
    );

  }

}


/* ============================================================
   FINISH
   ============================================================ */

finishButton.addEventListener(
  "click",
  () => {

    finishOverlay.classList.add(
      "hidden"
    );

    game.ended = true;

    particlesBurst(

      new THREE.Vector3(
        enemy.group.position.x,
        2.5,
        0
      ),

      0x28d7ff,

      50

    );

    showMessage(
      "FURY FINISH",
      "IRON FURY",
      1500
    );

    setTimeout(
      () => {

        endGame(
          true,
          "FURY FINISH"
        );

      },
      1200
    );

  }
);


/* ============================================================
   END GAME
   ============================================================ */

function endGame(
  victory,
  description
) {

  game.ended =
    true;

  resultTitle.textContent =
    victory
      ? "VICTORY"
      : "DEFEAT";

  resultDescription.textContent =
    description;

  resultCombo.textContent =
    game.maxCombo;

  resultDamage.textContent =
    Math.round(
      game.totalDamage
    );

  resultFury.textContent =
    player.furyUsed;

  resultOverlay.classList.remove(
    "hidden"
  );

}


/* ============================================================
   RESTART
   ============================================================ */

function restartGame() {

  game.running = true;
  game.paused = false;
  game.ended = false;

  game.time =
    ROUND_TIME;

  game.maxCombo = 0;

  game.totalDamage = 0;

  game.cameraShake = 0;

  player.health =
    MAX_HEALTH;

  player.vitality =
    MAX_VITALITY;

  player.fury = 0;

  player.combo = 0;

  player.comboTimer = 0;

  player.furyUsed = 0;

  player.attacking = false;

  player.blocking = false;

  player.hitStun = 0;

  player.group.position.set(
    -3.8,
    0,
    0
  );

  player.velocity.set(
    0,
    0,
    0
  );

  player.grounded = true;


  enemy.health =
    MAX_HEALTH;

  enemy.vitality =
    MAX_VITALITY;

  enemy.fury = 0;

  enemy.combo = 0;

  enemy.furyUsed = 0;

  enemy.attacking = false;

  enemy.blocking = false;

  enemy.hitStun = 0;

  enemy.group.position.set(
    3.8,
    0,
    0
  );

  enemy.velocity.set(
    0,
    0,
    0
  );

  enemy.grounded = true;


  resultOverlay.classList.add(
    "hidden"
  );

  pauseMenu.classList.add(
    "hidden"
  );

  finishOverlay.classList.add(
    "hidden"
  );


  player.resetPose();
  enemy.resetPose();

  updateHUD();

  showMessage(
    "ROUND 1",
    "FIGHT",
    1200
  );

}


/* ============================================================
   PAUSE
   ============================================================ */

function setPaused(
  paused
) {

  game.paused =
    paused;

  pauseMenu.classList.toggle(
    "hidden",
    !paused
  );

}


pauseButton.addEventListener(
  "click",
  () => {

    setPaused(
      !game.paused
    );

  }
);


resumeButton.addEventListener(
  "click",
  () => {

    setPaused(false);

  }
);


pauseRestartButton.addEventListener(
  "click",
  restartGame
);


restartButton.addEventListener(
  "click",
  restartGame
);


/* ============================================================
   MOBILE BUTTONS
   ============================================================ */

function pressButton(
  element,
  down,
  up
) {

  element.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      element.classList.add(
        "pressed"
      );

      down();

    },
    {
      passive: false
    }
  );


  element.addEventListener(
    "pointerup",
    event => {

      event.preventDefault();

      element.classList.remove(
        "pressed"
      );

      up();

    },
    {
      passive: false
    }
  );


  element.addEventListener(
    "pointercancel",
    () => {

      element.classList.remove(
        "pressed"
      );

      up();

    }
  );

}


pressButton(
  jumpButton,
  () => player.jump(),
  () => {}
);

pressButton(
  dashButton,
  () => player.dash(),
  () => {}
);

pressButton(
  punchButton,
  () => player.startAttack("punch"),
  () => {}
);

pressButton(
  kickButton,
  () => player.startAttack("kick"),
  () => {}
);

pressButton(
  blockButton,
  () => player.block(true),
  () => player.block(false)
);

pressButton(
  furyButton,
  () => player.useFury(),
  () => {}
);


/* ============================================================
   KEYBOARD
   ============================================================ */

window.addEventListener(
  "keydown",
  event => {

    if (
      event.code === "ArrowLeft" ||
      event.code === "KeyA"
    ) {

      input.left = true;

    }

    if (
      event.code === "ArrowRight" ||
      event.code === "KeyD"
    ) {

      input.right = true;

    }

    if (
      event.code === "Space" &&
      !event.repeat
    ) {

      player.jump();

    }

    if (
      event.code === "ShiftLeft" &&
      !event.repeat
    ) {

      player.dash();

    }

    if (
      event.code === "KeyJ" &&
      !event.repeat
    ) {

      player.startAttack(
        "punch"
      );

    }

    if (
      event.code === "KeyK" &&
      !event.repeat
    ) {

      player.startAttack(
        "kick"
      );

    }

    if (
      event.code === "KeyL"
    ) {

      player.block(true);

    }

    if (
      event.code === "KeyF" &&
      !event.repeat
    ) {

      player.useFury();

    }

    if (
      event.code === "Escape"
    ) {

      setPaused(
        !game.paused
      );

    }

  }
);


window.addEventListener(
  "keyup",
  event => {

    if (
      event.code === "ArrowLeft" ||
      event.code === "KeyA"
    ) {

      input.left = false;

    }

    if (
      event.code === "ArrowRight" ||
      event.code === "KeyD"
    ) {

      input.right = false;

    }

    if (
      event.code === "KeyL"
    ) {

      player.block(false);

    }

  }
);


/* ============================================================
   JOYSTICK
   ============================================================ */

function updateStick(
  x,
  y
) {

  const rect =
    joystick.getBoundingClientRect();

  const centerX =
    rect.left +
    rect.width / 2;

  const centerY =
    rect.top +
    rect.height / 2;

  let dx =
    x - centerX;

  let dy =
    y - centerY;

  const radius =
    rect.width * 0.34;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (
    distance > radius
  ) {

    dx =
      dx /
      distance *
      radius;

    dy =
      dy /
      distance *
      radius;

  }


  stick.x =
    dx / radius;

  stick.y =
    dy / radius;


  joystickKnob.style.transform =
    "translate(calc(-50% + " +
    dx +
    "px), calc(-50% + " +
    dy +
    "px))";

}


function resetStick() {

  stick.active =
    false;

  stick.x = 0;
  stick.y = 0;

  joystickKnob.style.transform =
    "translate(-50%, -50%)";

}


joystick.addEventListener(
  "pointerdown",
  event => {

    event.preventDefault();

    stick.active =
      true;

    joystick.setPointerCapture(
      event.pointerId
    );

    updateStick(
      event.clientX,
      event.clientY
    );

  },
  {
    passive: false
  }
);


joystick.addEventListener(
  "pointermove",
  event => {

    if (
      !stick.active
    ) {

      return;

    }

    event.preventDefault();

    updateStick(
      event.clientX,
      event.clientY
    );

  },
  {
    passive: false
  }
);


joystick.addEventListener(
  "pointerup",
  resetStick
);

joystick.addEventListener(
  "pointercancel",
  resetStick
);


/* ============================================================
   RESIZE
   ============================================================ */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

  }
);


/* ============================================================
   TIMER
   ============================================================ */

function updateTimer(dt) {

  game.time -= dt;

  if (
    game.time <= 0
  ) {

    game.time = 0;

    if (
      player.health >=
      enemy.health
    ) {

      endGame(
        true,
        "TIME VICTORY"
      );

    } else {

      endGame(
        false,
        "TIME DEFEAT"
      );

    }

  }

}


/* ============================================================
   MAIN LOOP
   ============================================================ */

let previous =
  performance.now();

function loop(now) {

  requestAnimationFrame(
    loop
  );

  const dt =
    Math.min(
      0.05,
      (now - previous) /
        1000
    );

  previous = now;


  if (
    game.running &&
    !game.paused &&
    !game.ended
  ) {

    updatePlayer(dt);

    updateEnemy(dt);

    player.update(
      dt,
      enemy
    );

    enemy.update(
      dt,
      player
    );

    updateTimer(dt);

  }


  updateParticles(dt);

  updateCamera();

  renderer.render(
    scene,
    camera
  );

}


/* ============================================================
   STARTUP
   ============================================================ */

function initialize() {

  loadingText.textContent =
    "INITIALIZING ENGINE";

  let progress = 0;


  const interval =
    setInterval(
      () => {

        progress += 10;

        if (
          progress >= 30
        ) {

          loadingText.textContent =
            "BUILDING ARENA";

        }

        if (
          progress >= 60
        ) {

          loadingText.textContent =
            "LOADING FIGHTERS";

        }

        if (
          progress >= 85
        ) {

          loadingText.textContent =
            "ARMING FURY SYSTEM";

        }

        if (
          progress >= 100
        ) {

          clearInterval(
            interval
          );

          loadingProgress.style.width =
            "100%";

          loadingText.textContent =
            "READY";

          setTimeout(
            () => {

              loadingScreen.classList.add(
                "hidden"
              );

              restartGame();

            },
            350
          );

        } else {

          loadingProgress.style.width =
            progress + "%";

        }

      },
      80
    );

}


/* ============================================================
   BOOT
   ============================================================ */

try {

  updateHUD();

  loop(
    performance.now()
  );

  initialize();

} catch (error) {

  console.error(
    "IRON FURY STARTUP ERROR:",
    error
  );

  loadingText.textContent =
    "ENGINE ERROR";

  loadingProgress.style.width =
    "100%";

}
