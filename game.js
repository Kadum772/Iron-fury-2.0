Iron Fury — game.js

"use strict";

/* ============================================================
   IRON FURY 3D
   COMPLETE MATCHED GAME ENGINE

   Fighter
      ├── createModel()
      ├── movement
      ├── jumping
      ├── dash
      ├── blocking
      ├── attacks
      ├── damage
      ├── Fury
      └── animations

   ============================================================ */

const THREE = window.THREE;

if (!THREE) {
  throw new Error("Three.js failed to load.");
}


/* ============================================================
   DOM HELPER
   ============================================================ */

const $ = id => {

  const element =
    document.getElementById(id);

  if (!element) {

    throw new Error(
      "Missing HTML element #" + id
    );

  }

  return element;

};


/* ============================================================
   DOM
   ============================================================ */

const canvas =
  $("gameCanvas");

const loadingScreen =
  $("loadingScreen");

const loadingProgress =
  $("loadingProgress");

const loadingText =
  $("loadingText");


const playerHealth =
  $("playerHealth");

const enemyHealth =
  $("enemyHealth");

const playerHealthText =
  $("playerHealthText");

const enemyHealthText =
  $("enemyHealthText");


const playerVitality =
  $("playerVitality");

const enemyVitality =
  $("enemyVitality");

const playerVitalityText =
  $("playerVitalityText");

const enemyVitalityText =
  $("enemyVitalityText");


const fury1 = $("fury1");
const fury2 = $("fury2");
const fury3 = $("fury3");

const enemyFury1 =
  $("enemyFury1");

const enemyFury2 =
  $("enemyFury2");

const enemyFury3 =
  $("enemyFury3");


const playerFuryText =
  $("playerFuryText");

const enemyFuryText =
  $("enemyFuryText");


const timer =
  $("timer");

const roundNumber =
  $("roundNumber");


const message =
  $("message");

const subMessage =
  $("subMessage");


const comboCounter =
  $("comboCounter");

const comboNumber =
  $("comboNumber");


const damageNumber =
  $("damageNumber");

const damageFlash =
  $("damageFlash");

const furyFlash =
  $("furyFlash");


const pauseButton =
  $("pauseButton");

const pauseMenu =
  $("pauseMenu");

const resumeButton =
  $("resumeButton");

const pauseRestartButton =
  $("pauseRestartButton");


const resultOverlay =
  $("resultOverlay");

const resultTitle =
  $("resultTitle");

const resultDescription =
  $("resultDescription");

const resultCombo =
  $("resultCombo");

const resultDamage =
  $("resultDamage");

const resultFury =
  $("resultFury");

const restartButton =
  $("restartButton");


const finishOverlay =
  $("finishOverlay");

const finishTitle =
  $("finishTitle");

const finishSubtitle =
  $("finishSubtitle");

const finishButton =
  $("finishButton");


const joystick =
  $("joystick");

const joystickKnob =
  $("joystickKnob");


const jumpButton =
  $("jumpButton");

const dashButton =
  $("dashButton");

const punchButton =
  $("punchButton");

const kickButton =
  $("kickButton");

const blockButton =
  $("blockButton");

const furyButton =
  $("furyButton");


/* ============================================================
   CONSTANTS
   ============================================================ */

const MAX_HEALTH =
  100;

const MAX_VITALITY =
  100;

const MAX_FURY =
  3;

const ARENA_LIMIT =
  8.5;

const PLAYER_SPEED =
  5.3;

const ENEMY_SPEED =
  3.25;

const MOVE_ACCEL =
  22;

const MOVE_DECEL =
  28;

const GRAVITY =
  21;

const JUMP_FORCE =
  8.3;

const ROUND_TIME =
  60;

const COMBO_TIME =
  1.15;


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

    powerPreference:
      "high-performance"

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


renderer.shadowMap.enabled =
  true;


renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;


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
    38
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
    0x9bcfff,
    0x11151a,
    2
  )
);


const sun =
  new THREE.DirectionalLight(
    0xffffff,
    2.7
  );


sun.position.set(
  5,
  11,
  8
);


sun.castShadow =
  true;


sun.shadow.mapSize.set(
  1024,
  1024
);


scene.add(
  sun
);


const blueLight =
  new THREE.PointLight(
    0x18aaff,
    10,
    18
  );


blueLight.position.set(
  -8,
  4,
  2
);


scene.add(
  blueLight
);


const redLight =
  new THREE.PointLight(
    0xff304d,
    10,
    18
  );


redLight.position.set(
  8,
  4,
  2
);


scene.add(
  redLight
);


/* ============================================================
   MATERIAL
   ============================================================ */

function mat(
  color,
  metal = 0.15,
  roughness = 0.58
) {

  return new THREE.MeshStandardMaterial({

    color: color,

    roughness:
      roughness,

    metalness:
      metal

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

    mat(
      0x111920,
      0.35,
      0.68
    )

  );


floor.rotation.x =
  -Math.PI / 2;


floor.receiveShadow =
  true;


scene.add(
  floor
);


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


scene.add(
  grid
);


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

    mat(
      0x091016,
      0.25,
      0.75
    )

  );


backWall.position.set(
  0,
  4,
  -5
);


backWall.receiveShadow =
  true;


scene.add(
  backWall
);


/* ============================================================
   ARENA LIGHT MARKERS
   ============================================================ */

function arenaMarker(
  x,
  color
) {

  const group =
    new THREE.Group();


  const pillar =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.16,
        2.8,
        0.16
      ),

      new THREE.MeshBasicMaterial({
        color: color
      })

    );


  pillar.position.y =
    1.4;


  group.add(
    pillar
  );


  group.position.x =
    x;


  scene.add(
    group
  );

}


arenaMarker(
  -9,
  0x28d7ff
);


arenaMarker(
  9,
  0xff4057
);


/* ============================================================
   ARENA LIGHT BARS
   ============================================================ */

for (
  const x of [-6, -2, 2, 6]
) {

  const bar =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        2.2,
        0.08,
        0.08
      ),

      new THREE.MeshBasicMaterial({

        color:
          x < 0
            ? 0x1ba9ff
            : 0xff3652

      })

    );


  bar.position.set(
    x,
    5.7,
    -4.65
  );


  scene.add(
    bar
  );

}


/* ============================================================
   PARTICLES
   ============================================================ */

const particles = [];


function particlesBurst(
  position,
  color,
  count = 12,
  power = 1
) {

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const particle =
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


    particle.position.copy(
      position
    );


    particle.userData.life =
      0.25 +
      Math.random() * 0.35;


    particle.userData.velocity =
      new THREE.Vector3(

        (Math.random() - 0.5) *
          4 *
          power,

        (Math.random() * 4 + 1) *
          power,

        (Math.random() - 0.5) *
          3 *
          power

      );


    scene.add(
      particle
    );


    particles.push(
      particle
    );

  }

}


function updateParticles(
  dt
) {

  for (
    let i =
      particles.length - 1;

    i >= 0;

    i--
  ) {

    const particle =
      particles[i];


    particle.userData.life -=
      dt;


    particle.userData.velocity.y -=
      10 * dt;


    particle.position.addScaledVector(
      particle.userData.velocity,
      dt
    );


    if (
      particle.userData.life <=
      0
    ) {

      scene.remove(
        particle
      );


      particle.geometry.dispose();

      particle.material.dispose();


      particles.splice(
        i,
        1
      );

    }

  }

}


/* ============================================================
   FIGHTER CLASS
   ============================================================ */

class Fighter {

  constructor(
    name,
    color,
    accent,
    playerControlled,
    skinColor = 0xc88968
  ) {

    this.name =
      name;

    this.color =
      color;

    this.accent =
      accent;

    this.skinColor =
      skinColor;

    this.playerControlled =
      playerControlled;


    this.group =
      new THREE.Group();


    this.health =
      MAX_HEALTH;

    this.vitality =
      MAX_VITALITY;

    this.fury =
      0;


    this.combo =
      0;

    this.comboTimer =
      0;


    this.grounded =
      true;


    this.velocity =
      new THREE.Vector3();


    /* SMOOTH MOVEMENT */

    this.moveVelocity =
      0;

    this.moveInput =
      0;


    this.facing =
      playerControlled
        ? 1
        : -1;


    this.blocking =
      false;

    this.attacking =
      false;

    this.attack =
      null;

    this.attackTime =
      0;

    this.hitConfirmed =
      false;

    this.hitStun =
      0;

    this.dashTime =
      0;

    this.invincible =
      false;


    this.damageDone =
      0;

    this.furyUsed =
      0;


    /* BUILD 3D CHARACTER */

    this.createModel();


    scene.add(
      this.group
    );

  }


  /* ==========================================================
     CREATE MODEL
     ========================================================== */

  createModel() {

    const skin =
      mat(
        this.skinColor,
        0.05,
        0.7
      );


    const suit =
      mat(
        this.color,
        0.35,
        0.52
      );


    const accent =
      mat(
        this.accent,
        0.5,
        0.4
      );


    const dark =
      mat(
        0x11161b,
        0.45,
        0.5
      );


    const sole =
      mat(
        0x07090b,
        0.35,
        0.7
      );


    /* BODY ROOT */

    this.body =
      new THREE.Group();


    this.group.add(
      this.body
    );


    /* ========================================================
       HIPS
       ======================================================== */

    this.hips =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.92,
          0.45,
          0.56
        ),

        dark

      );


    this.hips.position.set(
      0,
      1.72,
      0
    );


    this.hips.castShadow =
      true;


    this.body.add(
      this.hips
    );


    /* ========================================================
       TORSO
       ======================================================== */

    this.torso =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          1.12,
          1.42,
          0.62
        ),

        suit

      );


    this.torso.position.set(
      0,
      2.55,
      0
    );


    this.torso.castShadow =
      true;


    this.body.add(
      this.torso
    );


    /* ========================================================
       CHEST ARMOR
       ======================================================== */

    const chest =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.78,
          0.48,
          0.68
        ),

        accent

      );


    chest.position.set(
      0,
      2.78,
      0.30
    );


    chest.castShadow =
      true;


    this.body.add(
      chest
    );


    /* ========================================================
       NECK
       ======================================================== */

    this.neck =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          0.18,
          0.20,
          0.28,
          12
        ),

        skin

      );


    this.neck.position.set(
      0,
      3.42,
      0
    );


    this.neck.castShadow =
      true;


    this.body.add(
      this.neck
    );


    /* ========================================================
       HEAD
       ======================================================== */

    this.head =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.43,
          20,
          14
        ),

        skin

      );


    this.head.scale.set(
      0.98,
      1.08,
      0.95
    );


    this.head.position.set(
      0,
      3.86,
      0
    );


    this.head.castShadow =
      true;


    this.body.add(
      this.head
    );


    /* ========================================================
       HAIR
       ======================================================== */

    const hair =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.445,
          16,
          10,
          0,
          Math.PI * 2,
          0,
          Math.PI * 0.52
        ),

        dark

      );


    hair.position.set(
      0,
      4.02,
      -0.01
    );


    this.body.add(
      hair
    );


    /* ========================================================
       FACE VISOR
       ======================================================== */

    const visor =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.58,
          0.13,
          0.09
        ),

        dark

      );


    visor.position.set(
      0,
      3.87,
      0.405
    );


    this.body.add(
      visor
    );


    /* ========================================================
       SHOULDERS
       ======================================================== */

    this.leftShoulder =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.28,
          12,
          8
        ),

        accent

      );


    this.rightShoulder =
      this.leftShoulder.clone();


    this.leftShoulder.position.set(
      -0.72,
      3.12,
      0
    );


    this.rightShoulder.position.set(
      0.72,
      3.12,
      0
    );


    this.body.add(
      this.leftShoulder,
      this.rightShoulder
    );


    /* ========================================================
       UPPER ARMS
       ======================================================== */

    this.leftArm =
      this.makeLimb(
        0.18,
        0.58,
        suit
      );


    this.rightArm =
      this.makeLimb(
        0.18,
        0.58,
        suit
      );


    this.leftArm.position.set(
      -0.76,
      3.08,
      0
    );


    this.rightArm.position.set(
      0.76,
      3.08,
      0
    );


    this.body.add(
      this.leftArm,
      this.rightArm
    );


    /* ========================================================
       FOREARMS
       ======================================================== */

    this.leftForearm =
      this.makeLimb(
        0.16,
        0.52,
        suit
      );


    this.rightForearm =
      this.makeLimb(
        0.16,
        0.52,
        suit
      );


    this.leftForearm.position.y =
      -0.57;


    this.rightForearm.position.y =
      -0.57;


    this.leftArm.add(
      this.leftForearm
    );


    this.rightArm.add(
      this.rightForearm
    );


    /* ========================================================
       GLOVES
       ======================================================== */

    this.leftFist =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.31,
          0.30,
          0.34
        ),

        accent

      );


    this.rightFist =
      this.leftFist.clone();


    this.leftFist.position.set(
      0,
      -0.32,
      0.02
    );


    this.rightFist.position.set(
      0,
      -0.32,
      0.02
    );


    this.leftForearm.add(
      this.leftFist
    );


    this.rightForearm.add(
      this.rightFist
    );


    /* ========================================================
       THIGHS
       ======================================================== */

    this.leftLeg =
      this.makeLimb(
        0.25,
        0.72,
        dark
      );


    this.rightLeg =
      this.makeLimb(
        0.25,
        0.72,
        dark
      );


    this.leftLeg.position.set(
      -0.30,
      1.52,
      0
    );


    this.rightLeg.position.set(
      0.30,
      1.52,
      0
    );


    this.body.add(
      this.leftLeg,
      this.rightLeg
    );


    /* ========================================================
       SHINS
       ======================================================== */

    this.leftShin =
      this.makeLimb(
        0.21,
        0.72,
        suit
      );


    this.rightShin =
      this.makeLimb(
        0.21,
        0.72,
        suit
      );


    this.leftShin.position.y =
      -0.70;


    this.rightShin.position.y =
      -0.70;


    this.leftLeg.add(
      this.leftShin
    );


    this.rightLeg.add(
      this.rightShin
    );


    /* ========================================================
       BOOTS
       ======================================================== */

    this.leftFoot =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.38,
          0.22,
          0.65
        ),

        sole

      );


    this.rightFoot =
      this.leftFoot.clone();


    this.leftFoot.position.set(
      0,
      -0.42,
      0.12
    );


    this.rightFoot.position.set(
      0,
      -0.42,
      0.12
    );


    this.leftShin.add(
      this.leftFoot
    );


    this.rightShin.add(
      this.rightFoot
    );


    /* ========================================================
       BELT
       ======================================================== */

    const belt =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          1.0,
          0.16,
          0.64
        ),

        accent

      );


    belt.position.set(
      0,
      1.91,
      0
    );


    this.body.add(
      belt
    );


    this.resetPose();

  }


  /* ==========================================================
     LIMB CREATOR
     ========================================================== */

  makeLimb(
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
          radius * 1.05,
          length,
          10
        ),

        material

      );


    mesh.position.y =
      -length / 2;


    mesh.castShadow =
      true;


    pivot.add(
      mesh
    );


    return pivot;

  }


  /* ==========================================================
     RESET POSE
     ========================================================== */

  resetPose() {

    this.leftArm.rotation.set(
      0.18,
      0,
      0.15
    );


    this.rightArm.rotation.set(
      0.18,
      0,
      -0.15
    );


    this.leftForearm.rotation.set(
      0.1,
      0,
      0
    );


    this.rightForearm.rotation.set(
      0.1,
      0,
      0
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


    this.leftShin.rotation.set(
      0,
      0,
      0
    );


    this.rightShin.rotation.set(
      0,
      0,
      0
    );


    this.torso.rotation.set(
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


  /* ==========================================================
     MOVEMENT
     ========================================================== */

  move(
    direction
  ) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0 ||
      this.dashTime > 0
    ) {

      this.moveInput =
        0;

      return;

    }


    this.moveInput =
      THREE.MathUtils.clamp(
        direction,
        -1,
        1
      );

  }


  /* ==========================================================
     SMOOTH MOVEMENT
     ========================================================== */

  updateMovement(
    dt
  ) {

    const target =
      this.moveInput *
      (
        this.playerControlled
          ? PLAYER_SPEED
          : ENEMY_SPEED
      );


    const rate =
      Math.abs(target) >
      Math.abs(this.moveVelocity)
        ? MOVE_ACCEL
        : MOVE_DECEL;


    this.moveVelocity =
      THREE.MathUtils.damp(
        this.moveVelocity,
        target,
        rate,
        dt
      );


    if (
      Math.abs(
        this.moveVelocity
      ) > 0.02 &&
      !this.attacking &&
      !this.blocking
    ) {

      this.group.position.x +=
        this.moveVelocity *
        dt;

    }


    if (
      Math.abs(
        this.moveVelocity
      ) <= 0.02
    ) {

      this.moveVelocity =
        0;

    }

  }


  /* ==========================================================
     JUMP
     ========================================================== */

  jump() {

    if (
      !this.grounded ||
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;

    }


    this.velocity.y =
      JUMP_FORCE;


    this.grounded =
      false;


    particlesBurst(

      new THREE.Vector3(
        this.group.position.x,
        0.15,
        0
      ),

      this.accent,

      7,

      0.65

    );

  }


  /* ==========================================================
     DASH
     ========================================================== */

  dash() {

    if (
      this.dashTime > 0 ||
      this.hitStun > 0 ||
      this.attacking
    ) {

      return;

    }


    this.dashTime =
      0.18;


    this.invincible =
      true;


    this.moveVelocity =
      0;


    particlesBurst(

      new THREE.Vector3(
        this.group.position.x,
        1,
        0
      ),

      this.accent,

      10,

      1.2

    );

  }


  /* ==========================================================
     BLOCK
     ========================================================== */

  block(
    value
  ) {

    if (
      this.attacking ||
      this.hitStun > 0
    ) {

      this.blocking =
        false;

      return;

    }


    this.blocking =
      value;


    if (value) {

      this.moveVelocity =
        0;

    }

  }


  /* ==========================================================
     PHYSICS
     ========================================================== */

  physics(
    dt
  ) {

    if (
      !this.grounded
    ) {

      this.velocity.y -=
        GRAVITY *
        dt;


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


  /* ==========================================================
     ATTACK
     ========================================================== */

  startAttack(
    type
  ) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0
    ) {

      return;

    }


    this.attacking =
      true;


    this.attack =
      type;


    this.hitConfirmed =
      false;


    this.moveVelocity =
      0;


    this.attackTime =
      type === "punch"
        ? 0.42
        : type === "kick"
          ? 0.55
          : 1.15;

  }


  /* ==========================================================
     ATTACK UPDATE
     ========================================================== */

  updateAttack(
    dt,
    opponent
  ) {

    this.attackTime -=
      dt;


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
      progress > 0.30 &&
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
          ? 2.15
          : this.attack === "fury"
            ? 3.3
            : 1.75;


      if (
        distance <=
        range
      ) {

        let damage;


        if (
          this.attack ===
          "punch"
        ) {

          damage =
            7;

        }

        else if (
          this.attack ===
          "kick"
        ) {

          damage =
            10;

        }

        else {

          damage =
            15 +
            this.furyUsed *
            8;

        }


        opponent.takeDamage(
          damage,
          this
        );

      }

    }


    if (
      this.attackTime <=
      0
    ) {

      this.attacking =
        false;


      this.attack =
        null;


      this.attackTime =
        0;


      this.resetPose();

    }

  }


  /* ==========================================================
     DAMAGE
     ========================================================== */

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

      actual *=
        0.2;


      this.vitality =
        Math.max(

          0,

          this.vitality -
          damage * 0.15

        );

    }

    else {

      this.vitality =
        Math.max(

          0,

          this.vitality -
          damage * 0.08

        );


      this.hitStun =
        0.2;


      this.moveVelocity =
        attacker.facing *
        2;


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

        2.5 +
        this.group.position.y,

        0.5

      ),

      this.blocking
        ? 0xb76cff
        : 0xffbf3d,

      this.blocking
        ? 7
        : 12,

      this.blocking
        ? 0.7
        : 1

    );


    updateHUD();


    if (
      this.health <=
      0
    ) {

      this.health =
        0;


      checkWinner();

    }

  }


  /* ==========================================================
     FURY
     ========================================================== */

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


    this.fury =
      0;


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

        2.5 +
        this.group.position.y,

        0

      ),

      this.accent,

      35,

      1.5

    );


    updateHUD();

  }


  /* ==========================================================
     UPDATE
     ========================================================== */

  update(
    dt,
    opponent
  ) {

    if (
      this.hitStun > 0
    ) {

      this.hitStun -=
        dt;


      this.blocking =
        false;


      this.moveInput =
        0;


      this.updateMovement(
        dt
      );


      this.physics(
        dt
      );


      this.animateHit();


      this.limitPosition();


      return;

    }


    if (
      this.dashTime > 0
    ) {

      this.dashTime -=
        dt;


      this.group.position.x +=
        this.facing *
        13 *
        dt;


      this.invincible =
        true;

    }

    else {

      this.invincible =
        false;

    }


    if (
      this.attacking
    ) {

      this.updateAttack(
        dt,
        opponent
      );

    }


    this.updateMovement(
      dt
    );


    this.physics(
      dt
    );


    this.faceOpponent(
      opponent
    );


    this.animate();


    this.limitPosition();


    this.comboTimer -=
      dt;


    if (
      this.comboTimer <=
      0
    ) {

      this.combo =
        0;

    }


    this.moveInput =
      0;

  }


  /* ==========================================================
     ANIMATION
     ========================================================== */

  animate() {

    const t =
      performance.now() *
      0.008;


    /* BLOCK */

    if (
      this.blocking
    ) {

      this.leftArm.rotation.set(
        -0.95,
        0,
        0.55
      );


      this.rightArm.rotation.set(
        -0.95,
        0,
        -0.55
      );


      this.leftForearm.rotation.set(
        -0.2,
        0,
        -0.15
      );


      this.rightForearm.rotation.set(
        -0.2,
        0,
        0.15
      );


      return;

    }


    /* ATTACK */

    if (
      this.attacking
    ) {

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


      const swing =
        Math.sin(
          progress *
          Math.PI
        );


      /* PUNCH */

      if (
        this.attack ===
        "punch"
      ) {

        const arm =
          this.facing === 1
            ? this.rightArm
            : this.leftArm;


        const forearm =
          this.facing === 1
            ? this.rightForearm
            : this.leftForearm;


        arm.rotation.x =
          -1.55 *
          swing;


        forearm.rotation.x =
          -0.65 *
          swing;

      }


      /* KICK */

      else if (
        this.attack ===
        "kick"
      ) {

        const leg =
          this.facing === 1
            ? this.rightLeg
            : this.leftLeg;


        const shin =
          this.facing === 1
            ? this.rightShin
            : this.leftShin;


        leg.rotation.x =
          -1.15 *
          swing;


        shin.rotation.x =
          -0.65 *
          swing;

      }


      /* FURY */

      else {

        const pulse =
          1 +
          Math.sin(
            t * 4
          ) *
          0.08;


        this.body.scale.set(
          pulse,
          pulse,
          pulse
        );


        this.leftArm.rotation.x =
          -1.35;


        this.rightArm.rotation.x =
          -1.35;


        this.leftForearm.rotation.x =
          -0.5;


        this.rightForearm.rotation.x =
          -0.5;

      }


      return;

    }


    /* JUMP */

    if (
      !this.grounded
    ) {

      this.leftLeg.rotation.x =
        -0.28;


      this.rightLeg.rotation.x =
        0.28;


      this.leftShin.rotation.x =
        0.18;


      this.rightShin.rotation.x =
        0.18;


      return;

    }


    /* WALK */

    const walking =
      Math.abs(
        this.moveVelocity
      ) > 0.08;


    const swing =
      walking
        ? Math.sin(
            t * 2.6
          )
        : 0;


    this.leftArm.rotation.x =
      swing * 0.22;


    this.rightArm.rotation.x =
      -swing * 0.22;


    this.leftLeg.rotation.x =
      -swing * 0.18;


    this.rightLeg.rotation.x =
      swing * 0.18;


    this.leftShin.rotation.x =
      Math.max(
        0,
        swing
      ) * 0.12;


    this.rightShin.rotation.x =
      Math.max(
        0,
        -swing
      ) * 0.12;


    if (
      !walking
    ) {

      this.leftArm.rotation.z =
        0.15;


      this.rightArm.rotation.z =
        -0.15;

    }

  }


  /* ==========================================================
     HIT ANIMATION
     ========================================================== */

  animateHit() {

    this.torso.rotation.z =
      0.18 *
      this.facing;


    this.leftArm.rotation.z =
      0.45;


    this.rightArm.rotation.z =
      -0.45;

  }


  /* ==========================================================
     FACE OPPONENT
     ========================================================== */

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


  /* ==========================================================
     ARENA LIMIT
     ========================================================== */

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

/*
   THIS IS WHERE WE WILL EVENTUALLY
   CREATE DIFFERENT CHARACTERS.

   Example:

   new Fighter(
      "CHARACTER NAME",
      suit color,
      accent color,
      player controlled,
      skin color
   );
*/


const player =
  new Fighter(

    "IRON FURY",

    0x263b46,

    0x28d7ff,

    true,

    0xc88968

  );


const enemy =
  new Fighter(

    "RIVAL",

    0x4a2029,

    0xff4057,

    false,

    0x9f624c

  );


player.group.position.set(
  -3.8,
  0,
  0
);


enemy.group.position.set(
  3.8,
  0,
  0
);


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

      Math.round(

        (
          fighter.fury +
          (
            damage >= 8
              ? 0.16
              : 0.1
          )
        ) *
        10

      ) / 10

    );

}


/* ============================================================
   PLAYER UPDATE
   ============================================================ */

function updatePlayer() {

  let direction =
    0;


  if (
    stick.x < -0.2 ||
    input.left
  ) {

    direction -=
      1;

  }


  if (
    stick.x > 0.2 ||
    input.right
  ) {

    direction +=
      1;

  }


  player.move(
    direction
  );

}


/* ============================================================
   ENEMY AI
   ============================================================ */

let aiTimer =
  0;


function updateEnemy(
  dt
) {

  aiTimer -=
    dt;


  if (
    aiTimer > 0
  ) {

    return;

  }


  aiTimer =
    0.15 +
    Math.random() *
    0.2;


  const distance =
    player.group.position.x -
    enemy.group.position.x;


  const absolute =
    Math.abs(
      distance
    );


  if (
    absolute > 2.1
  ) {

    enemy.move(
      Math.sign(
        distance
      )
    );


    return;

  }


  enemy.move(
    0
  );


  const choice =
    Math.random();


  if (
    choice < 0.35
  ) {

    enemy.startAttack(
      "punch"
    );

  }

  else if (
    choice < 0.55
  ) {

    enemy.startAttack(
      "kick"
    );

  }

  else if (
    choice < 0.72
  ) {

    enemy.block(
      true
    );


    setTimeout(
      () => {

        enemy.block(
          false
        );

      },
      350
    );

  }

  else if (
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
      distance *
      0.35,

      11,
      16

    );


  let shakeX =
    0;


  let shakeY =
    0;


  if (
    game.cameraShake > 0
  ) {

    shakeX =
      (
        Math.random() -
        0.5
      ) *
      game.cameraShake;


    shakeY =
      (
        Math.random() -
        0.5
      ) *
      game.cameraShake;


    game.cameraShake *=
      0.88;

  }


  camera.position.x +=
    (
      center +
      shakeX -
      camera.position.x
    ) *
    0.08;


  camera.position.y +=
    (
      4.7 +
      shakeY -
      camera.position.y
    ) *
    0.08;


  camera.position.z +=
    (
      targetZ -
      camera.position.z
    ) *
    0.08;


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
    player.health +
    "%";


  enemyHealth.style.width =
    enemy.health +
    "%";


  playerVitality.style.width =
    player.vitality +
    "%";


  enemyVitality.style.width =
    enemy.vitality +
    "%";


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


  [
    fury1,
    fury2,
    fury3
  ].forEach(
    (slot, index) => {

      slot.classList.toggle(
        "active",
        index <
        playerFury
      );


      slot.classList.toggle(
        "ready",
        playerFury === 3
      );

    }
  );


  [
    enemyFury1,
    enemyFury2,
    enemyFury3
  ].forEach(
    (slot, index) => {

      slot.classList.toggle(
        "active",
        index <
        enemyFury
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
      Math.ceil(
        game.time
      )
    );

}


/* ============================================================
   DAMAGE UI
   ============================================================ */

function showDamage(
  amount
) {

  damageNumber.textContent =
    Math.round(
      amount
    );


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
   MESSAGE
   ============================================================ */

let messageTimer =
  null;


function showMessage(
  title,
  subtitle = "",
  duration = 1000
) {

  message.textContent =
    title;


  subMessage.textContent =
    subtitle;


  message.style.opacity =
    "1";


  subMessage.style.opacity =
    "1";


  clearTimeout(
    messageTimer
  );


  messageTimer =
    setTimeout(
      () => {

        message.style.opacity =
          "0";


        subMessage.style.opacity =
          "0";

      },
      duration
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
   FURY FINISH
   ============================================================ */

finishButton.addEventListener(
  "click",
  () => {

    finishOverlay.classList.add(
      "hidden"
    );


    game.ended =
      true;


    particlesBurst(

      new THREE.Vector3(

        enemy.group.position.x,

        2.5,

        0

      ),

      0x28d7ff,

      50,

      1.8

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
   RESET FIGHTER
   ============================================================ */

function resetFighter(
  fighter,
  x
) {

  fighter.health =
    MAX_HEALTH;


  fighter.vitality =
    MAX_VITALITY;


  fighter.fury =
    0;


  fighter.combo =
    0;


  fighter.comboTimer =
    0;


  fighter.furyUsed =
    0;


  fighter.damageDone =
    0;


  fighter.attacking =
    false;


  fighter.attack =
    null;


  fighter.attackTime =
    0;


  fighter.blocking =
    false;


  fighter.hitStun =
    0;


  fighter.dashTime =
    0;


  fighter.invincible =
    false;


  fighter.moveInput =
    0;


  fighter.moveVelocity =
    0;


  fighter.velocity.set(
    0,
    0,
    0
  );


  fighter.grounded =
    true;


  fighter.group.position.set(
    x,
    0,
    0
  );


  fighter.group.rotation.y =
    fighter.playerControlled
      ? 0
      : Math.PI;


  fighter.resetPose();

}


/* ============================================================
   RESTART
   ============================================================ */

function restartGame() {

  game.running =
    true;


  game.paused =
    false;


  game.ended =
    false;


  game.time =
    ROUND_TIME;


  game.round =
    1;


  game.maxCombo =
    0;


  game.totalDamage =
    0;


  game.cameraShake =
    0;


  resetFighter(
    player,
    -3.8
  );


  resetFighter(
    enemy,
    3.8
  );


  resultOverlay.classList.add(
    "hidden"
  );


  pauseMenu.classList.add(
    "hidden"
  );


  finishOverlay.classList.add(
    "hidden"
  );


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

  if (
    game.ended
  ) {

    return;

  }


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

    setPaused(
      false
    );

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
  up = () => {}
) {

  element.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();


      element.setPointerCapture?.(
        event.pointerId
      );


      element.classList.add(
        "pressed"
      );


      down();

    },
    {
      passive: false
    }
  );


  const release =
    event => {

      event.preventDefault?.();


      element.classList.remove(
        "pressed"
      );


      up();

    };


  element.addEventListener(
    "pointerup",
    release,
    {
      passive: false
    }
  );


  element.addEventListener(
    "pointercancel",
    release,
    {
      passive: false
    }
  );


  element.addEventListener(
    "lostpointercapture",
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
  () => player.jump()
);


pressButton(
  dashButton,
  () => player.dash()
);


pressButton(
  punchButton,
  () => player.startAttack(
    "punch"
  )
);


pressButton(
  kickButton,
  () => player.startAttack(
    "kick"
  )
);


pressButton(
  blockButton,
  () => player.block(true),
  () => player.block(false)
);


pressButton(
  furyButton,
  () => player.useFury()
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

      input.left =
        true;

    }


    if (
      event.code === "ArrowRight" ||
      event.code === "KeyD"
    ) {

      input.right =
        true;

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

      player.block(
        true
      );

    }


    if (
      event.code === "KeyF" &&
      !event.repeat
    ) {

      player.useFury();

    }


    if (
      event.code === "Escape" &&
      !event.repeat
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

      input.left =
        false;

    }


    if (
      event.code === "ArrowRight" ||
      event.code === "KeyD"
    ) {

      input.right =
        false;

    }


    if (
      event.code === "KeyL"
    ) {

      player.block(
        false
      );

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
    x -
    centerX;


  let dy =
    y -
    centerY;


  const radius =
    rect.width *
    0.34;


  const distance =
    Math.hypot(
      dx,
      dy
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
    dx /
    radius;


  stick.y =
    dy /
    radius;


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


  stick.x =
    0;


  stick.y =
    0;


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


joystick.addEventListener(
  "lostpointercapture",
  resetStick
);


/* ============================================================
   TIMER
   ============================================================ */

function updateTimer(
  dt
) {

  game.time -=
    dt;


  if (
    game.time <=
    0
  ) {

    game.time =
      0;


    if (
      player.health >=
      enemy.health
    ) {

      endGame(
        true,
        "TIME VICTORY"
      );

    }

    else {

      endGame(
        false,
        "TIME DEFEAT"
      );

    }

  }

}


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
   MAIN LOOP
   ============================================================ */

let previous =
  performance.now();


function loop(
  now
) {

  requestAnimationFrame(
    loop
  );


  const dt =
    Math.min(

      0.05,

      (
        now -
        previous
      ) /
      1000

    );


  previous =
    now;


  if (
    game.running &&
    !game.paused &&
    !game.ended
  ) {

    updatePlayer();


    updateEnemy(
      dt
    );


    player.update(
      dt,
      enemy
    );


    enemy.update(
      dt,
      player
    );


    updateTimer(
      dt
    );


    updateHUD();

  }


  updateParticles(
    dt
  );


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


  let progress =
    0;


  const interval =
    setInterval(
      () => {

        progress +=
          10;


        if (
          progress >= 30
        ) {

          loadingText.textContent =
            "BUILDING 3D ARENA";

        }


        if (
          progress >= 55
        ) {

          loadingText.textContent =
            "BUILDING FIGHTER MODELS";

        }


        if (
          progress >= 75
        ) {

          loadingText.textContent =
            "ARMING COMBAT SYSTEM";

        }


        if (
          progress >= 90
        ) {

          loadingText.textContent =
            "CALIBRATING MOVEMENT";

        }


        loadingProgress.style.width =
          progress +
          "%";


        if (
          progress >= 100
        ) {

          clearInterval(
            interval
          );


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

        }

      },
      70
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

}

catch (
  error
) {

  console.error(
    "IRON FURY STARTUP ERROR:",
    error
  );


  loadingText.textContent =
    "ENGINE ERROR";


  loadingProgress.style.width =
    "100%";

}
