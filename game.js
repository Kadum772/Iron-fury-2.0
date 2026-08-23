import * as THREE from "three";

/* =========================================================
   IRON FURY
   CORE GAME ENGINE
   ========================================================= */

/* =========================================================
   DOM
   ========================================================= */

const canvas = document.getElementById("gameCanvas");

const loadingScreen = document.getElementById("loadingScreen");
const loadingProgress = document.getElementById("loadingProgress");
const loadingText = document.getElementById("loadingText");

const playerHealth = document.getElementById("playerHealth");
const enemyHealth = document.getElementById("enemyHealth");

const playerHealthText = document.getElementById("playerHealthText");
const enemyHealthText = document.getElementById("enemyHealthText");

const playerVitality = document.getElementById("playerVitality");
const enemyVitality = document.getElementById("enemyVitality");

const playerVitalityText =
  document.getElementById("playerVitalityText");

const enemyVitalityText =
  document.getElementById("enemyVitalityText");

const furySlots = [
  document.getElementById("fury1"),
  document.getElementById("fury2"),
  document.getElementById("fury3")
];

const enemyFurySlots = [
  document.getElementById("enemyFury1"),
  document.getElementById("enemyFury2"),
  document.getElementById("enemyFury3")
];

const playerFuryText =
  document.getElementById("playerFuryText");

const enemyFuryText =
  document.getElementById("enemyFuryText");

const timerElement =
  document.getElementById("timer");

const roundNumber =
  document.getElementById("roundNumber");

const messageElement =
  document.getElementById("message");

const subMessageElement =
  document.getElementById("subMessage");

const comboCounter =
  document.getElementById("comboCounter");

const comboNumber =
  document.getElementById("comboNumber");

const damageNumber =
  document.getElementById("damageNumber");

const damageFlash =
  document.getElementById("damageFlash");

const furyFlash =
  document.getElementById("furyFlash");

const pauseButton =
  document.getElementById("pauseButton");

const pauseMenu =
  document.getElementById("pauseMenu");

const resumeButton =
  document.getElementById("resumeButton");

const pauseRestartButton =
  document.getElementById("pauseRestartButton");

const restartButton =
  document.getElementById("restartButton");

const resultOverlay =
  document.getElementById("resultOverlay");

const resultTitle =
  document.getElementById("resultTitle");

const resultDescription =
  document.getElementById("resultDescription");

const resultCombo =
  document.getElementById("resultCombo");

const resultDamage =
  document.getElementById("resultDamage");

const resultFury =
  document.getElementById("resultFury");

const finishOverlay =
  document.getElementById("finishOverlay");

const finishButton =
  document.getElementById("finishButton");

const finishTitle =
  document.getElementById("finishTitle");

const finishSubtitle =
  document.getElementById("finishSubtitle");

const joystick =
  document.getElementById("joystick");

const joystickKnob =
  document.getElementById("joystickKnob");

const jumpButton =
  document.getElementById("jumpButton");

const dashButton =
  document.getElementById("dashButton");

const punchButton =
  document.getElementById("punchButton");

const kickButton =
  document.getElementById("kickButton");

const blockButton =
  document.getElementById("blockButton");

const furyButton =
  document.getElementById("furyButton");

/* =========================================================
   GAME CONSTANTS
   ========================================================= */

const ARENA_WIDTH = 18;
const FLOOR_Y = 0;

const MAX_HEALTH = 100;
const MAX_VITALITY = 100;

const MAX_FURY = 3;

const ROUND_TIME = 60;

const PLAYER_SPEED = 5.2;
const ENEMY_SPEED = 3.6;

const GRAVITY = 20;

const JUMP_FORCE = 8.5;

const DASH_SPEED = 15;
const DASH_TIME = 0.18;

const COMBO_TIMEOUT = 1.15;

const FIXED_STEP = 1 / 60;

/* =========================================================
   GAME STATE
   ========================================================= */

const state = {

  running: false,

  paused: false,

  finished: false,

  round: 1,

  time: ROUND_TIME,

  accumulator: 0,

  lastTime: performance.now(),

  shake: 0,

  playerDamage: 0,

  enemyDamage: 0,

  totalPlayerDamage: 0,

  totalEnemyDamage: 0,

  maxCombo: 0,

  lastHitTime: 0,

  finishReady: false

};

/* =========================================================
   INPUT
   ========================================================= */

const input = {

  left: false,

  right: false,

  up: false,

  down: false,

  jump: false,

  dash: false,

  punch: false,

  kick: false,

  block: false,

  fury: false

};

const joystickState = {

  active: false,

  pointerId: null,

  x: 0,

  y: 0

};

/* =========================================================
   THREE.JS
   ========================================================= */

const renderer = new THREE.WebGLRenderer({

  canvas,

  antialias: true,

  powerPreference: "high-performance"

});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio || 1, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

/* =========================================================
   SCENE
   ========================================================= */

const scene = new THREE.Scene();

scene.background =
  new THREE.Color(0x05080b);

scene.fog =
  new THREE.Fog(
    0x05080b,
    20,
    48
  );

/* =========================================================
   CAMERA
   ========================================================= */

const camera = new THREE.PerspectiveCamera(

  45,

  window.innerWidth /
    window.innerHeight,

  0.1,

  100

);

camera.position.set(
  0,
  5.2,
  14
);

camera.lookAt(
  0,
  2.4,
  0
);

/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight =
  new THREE.HemisphereLight(
    0x9fc7ff,
    0x101010,
    1.7
  );

scene.add(ambientLight);

const mainLight =
  new THREE.DirectionalLight(
    0xffffff,
    2.5
  );

mainLight.position.set(
  2,
  12,
  8
);

mainLight.castShadow = true;

mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;

mainLight.shadow.camera.left = -20;
mainLight.shadow.camera.right = 20;
mainLight.shadow.camera.top = 20;
mainLight.shadow.camera.bottom = -5;

scene.add(mainLight);

const rimLight =
  new THREE.DirectionalLight(
    0x38cfff,
    1.5
  );

rimLight.position.set(
  -10,
  6,
  -8
);

scene.add(rimLight);

/* =========================================================
   MATERIAL HELPERS
   ========================================================= */

function material(color, roughness = 0.65) {

  return new THREE.MeshStandardMaterial({

    color,

    roughness,

    metalness: 0.15

  });

}

/* =========================================================
   ARENA
   ========================================================= */

const arenaGroup =
  new THREE.Group();

scene.add(arenaGroup);

const floorMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x111820,

    roughness: 0.75,

    metalness: 0.3

  });

const floor =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      ARENA_WIDTH * 2,
      18
    ),

    floorMaterial

  );

floor.rotation.x =
  -Math.PI / 2;

floor.receiveShadow = true;

arenaGroup.add(floor);

/* =========================================================
   ARENA GRID
   ========================================================= */

const grid =
  new THREE.GridHelper(
    ARENA_WIDTH * 2,
    36,
    0x31404c,
    0x18232c
  );

grid.position.y = 0.015;

arenaGroup.add(grid);

/* =========================================================
   ARENA WALLS
   ========================================================= */

function createWall(x, z, width, depth) {

  const wall =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        3,
        depth
      ),

      material(0x101820, 0.8)

    );

  wall.position.set(
    x,
    1.5,
    z
  );

  wall.castShadow = true;

  wall.receiveShadow = true;

  arenaGroup.add(wall);

  return wall;
}

createWall(
  -ARENA_WIDTH,
  0,
  0.35,
  18
);

createWall(
  ARENA_WIDTH,
  0,
  0.35,
  18
);

/* =========================================================
   BACKDROP
   ========================================================= */

const backdrop =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      42,
      18
    ),

    new THREE.MeshStandardMaterial({

      color: 0x0a1016,

      roughness: 1,

      metalness: 0

    })

  );

backdrop.position.set(
  0,
  7,
  -6
);

scene.add(backdrop);

/* =========================================================
   ARENA LIGHTS
   ========================================================= */

function createArenaLight(
  x,
  z,
  color
) {

  const light =
    new THREE.PointLight(
      color,
      8,
      13
    );

  light.position.set(
    x,
    4,
    z
  );

  scene.add(light);

  return light;
}

createArenaLight(
  -9,
  -1,
  0x168cff
);

createArenaLight(
  9,
  -1,
  0xff304d
);

/* =========================================================
   PARTICLE SYSTEM
   ========================================================= */

const particles = [];

function spawnParticles(
  position,
  color,
  amount = 10,
  power = 3
) {

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const mesh =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.045,
          6,
          6
        ),

        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 1
        })

      );

    mesh.position.copy(position);

    scene.add(mesh);

    particles.push({

      mesh,

      velocity: new THREE.Vector3(

        (Math.random() - 0.5) *
          power,

        Math.random() *
          power,

        (Math.random() - 0.5) *
          power

      ),

      life:
        0.25 +
        Math.random() *
          0.45

    });

  }

}

function updateParticles(dt) {

  for (
    let i = particles.length - 1;
    i >= 0;
    i--
  ) {

    const p = particles[i];

    p.life -= dt;

    p.velocity.y -=
      8 * dt;

    p.mesh.position.addScaledVector(
      p.velocity,
      dt
    );

    p.mesh.material.opacity =
      Math.max(
        0,
        p.life * 2
      );

    if (
      p.life <= 0
    ) {

      scene.remove(
        p.mesh
      );

      p.mesh.geometry.dispose();

      p.mesh.material.dispose();

      particles.splice(
        i,
        1
      );

    }

  }

}

/* =========================================================
   FIGHTER CLASS
   ========================================================= */

class Fighter {

  constructor(options) {

    this.name =
      options.name;

    this.isPlayer =
      options.isPlayer;

    this.color =
      options.color;

    this.accent =
      options.accent;

    this.group =
      new THREE.Group();

    this.position =
      this.group.position;

    this.velocity =
      new THREE.Vector3();

    this.health =
      MAX_HEALTH;

    this.vitality =
      MAX_VITALITY;

    this.fury =
      0;

    this.grounded =
      true;

    this.facing =
      this.isPlayer
        ? 1
        : -1;

    this.blocking =
      false;

    this.attacking =
      false;

    this.attackType =
      null;

    this.attackTimer =
      0;

    this.attackDuration =
      0;

    this.attackHit =
      false;

    this.hitStun =
      0;

    this.dashTimer =
      0;

    this.invulnerable =
      false;

    this.aiTimer =
      0;

    this.combo =
      0;

    this.comboTimer =
      0;

    this.maxCombo =
      0;

    this.damageDealt =
      0;

    this.furyUsed =
      0;

    this.buildBody();

    scene.add(
      this.group
    );

  }

  /* =======================================================
     BODY
     ===================================================== */

  buildBody() {

    const skin =
      material(0xc98968);

    const suit =
      material(
        this.color,
        0.45
      );

    const accent =
      material(
        this.accent,
        0.35
      );

    const dark =
      material(
        0x10151b,
        0.5
      );

    /* ROOT */

    this.body =
      new THREE.Group();

    this.group.add(
      this.body
    );

    /* TORSO */

    const torso =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          1.15,
          1.65,
          0.62
        ),

        suit

      );

    torso.position.y =
      2.65;

    torso.castShadow = true;

    this.body.add(
      torso
    );

    this.torso =
      torso;

    /* CHEST ARMOR */

    const chest =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.85,
          0.48,
          0.66
        ),

        accent

      );

    chest.position.set(
      0,
      2.92,
      0.33
    );

    chest.castShadow = true;

    this.body.add(
      chest
    );

    /* HEAD */

    const head =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.48,
          18,
          14
        ),

        skin

      );

    head.position.y =
      4.05;

    head.castShadow = true;

    this.body.add(
      head
    );

    this.head =
      head;

    /* FACE VISOR */

    const visor =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.62,
          0.18,
          0.09
        ),

        dark

      );

    visor.position.set(
      0,
      4.08,
      0.44
    );

    this.body.add(
      visor
    );

    /* NECK */

    const neck =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          0.18,
          0.22,
          0.28,
          10
        ),

        skin

      );

    neck.position.y =
      3.55;

    neck.castShadow = true;

    this.body.add(
      neck
    );

    /* LIMBS */

    this.leftArm =
      this.createLimb(
        0.22,
        0.85,
        suit
      );

    this.rightArm =
      this.createLimb(
        0.22,
        0.85,
        suit
      );

    this.leftLeg =
      this.createLimb(
        0.3,
        1.05,
        dark
      );

    this.rightLeg =
      this.createLimb(
        0.3,
        1.05,
        dark
      );

    this.leftArm.position.set(
      -0.76,
      3.05,
      0
    );

    this.rightArm.position.set(
      0.76,
      3.05,
      0
    );

    this.leftLeg.position.set(
      -0.34,
      1.25,
      0
    );

    this.rightLeg.position.set(
      0.34,
      1.25,
      0
    );

    this.body.add(
      this.leftArm,
      this.rightArm,
      this.leftLeg,
      this.rightLeg
    );

    /* FISTS */

    this.leftFist =
      this.createFist(
        accent
      );

    this.rightFist =
      this.createFist(
        accent
      );

    this.leftFist.position.y =
      -0.5;

    this.rightFist.position.y =
      -0.5;

    this.leftArm.add(
      this.leftFist
    );

    this.rightArm.add(
      this.rightFist
    );

    /* FEET */

    this.leftFoot =
      this.createFoot(
        dark
      );

    this.rightFoot =
      this.createFoot(
        dark
      );

    this.leftFoot.position.y =
      -0.62;

    this.rightFoot.position.y =
      -0.62;

    this.leftLeg.add(
      this.leftFoot
    );

    this.rightLeg.add(
      this.rightFoot
    );

    /* INITIAL POSE */

    this.resetPose();

  }

  createLimb(
    radius,
    length,
    mat
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

        mat

      );

    mesh.position.y =
      -length / 2;

    mesh.castShadow = true;

    pivot.add(
      mesh
    );

    return pivot;

  }

  createFist(mat) {

    const fist =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.22,
          10,
          8
        ),

        mat

      );

    fist.castShadow = true;

    return fist;

  }

  createFoot(mat) {

    const foot =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.36,
          0.22,
          0.65
        ),

        mat

      );

    foot.position.z =
      0.2;

    foot.castShadow = true;

    return foot;

  }

  /* =======================================================
     POSE
     ===================================================== */

  resetPose() {

    this.leftArm.rotation.set(
      0.15,
      0,
      0.15
    );

    this.rightArm.rotation.set(
      0.15,
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

    this.torso.rotation.set(
      0,
      0,
      0
    );

  }

  /* =======================================================
     UPDATE
     ===================================================== */

  update(dt, opponent) {

    if (
      this.hitStun > 0
    ) {

      this.hitStun -= dt;

      this.blocking = false;

      this.applyPhysics(dt);

      this.animateHit(dt);

      return;

    }

    if (
      this.dashTimer > 0
    ) {

      this.dashTimer -= dt;

      this.position.x +=
        this.facing *
        DASH_SPEED *
        dt;

      this.invulnerable =
        true;

      if (
        this.dashTimer <= 0
      ) {

        this.invulnerable =
          false;

      }

    }

    this.updateAttack(dt);

    this.applyPhysics(dt);

    this.updateFacing(
      opponent
    );

    this.animate();

    this.keepInsideArena();

    this.comboTimer -= dt;

    if (
      this.comboTimer <= 0
    ) {

      this.combo = 0;

    }

  }

  /* =======================================================
     PHYSICS
     ======================================================= */

  applyPhysics(dt) {

    if (
      !this.grounded
    ) {

      this.velocity.y -=
        GRAVITY * dt;

      this.position.y +=
        this.velocity.y *
        dt;

      if (
        this.position.y <=
        FLOOR_Y
      ) {

        this.position.y =
          FLOOR_Y;

        this.velocity.y =
          0;

        this.grounded =
          true;

      }

    }

  }

  /* =======================================================
     FACING
     ======================================================= */

  updateFacing(
    opponent
  ) {

    if (
      this.attacking ||
      this.dashTimer > 0
    ) {

      return;

    }

    if (
      opponent.position.x >
      this.position.x
    ) {

      this.facing = 1;

    } else {

      this.facing = -1;

    }

    this.group.rotation.y =
      this.facing === 1
        ? 0
        : Math.PI;

  }

  /* =======================================================
     MOVEMENT
     ======================================================= */

  move(direction, dt) {

    if (
      this.attacking ||
      this.blocking ||
      this.hitStun > 0 ||
      this.dashTimer > 0
    ) {

      return;

    }

    const speed =
      this.isPlayer
        ? PLAYER_SPEED
        : ENEMY_SPEED;

    this.position.x +=
      direction *
      speed *
      dt;

  }

  jump() {

    if (
      !this.grounded ||
      this.attacking ||
      this.hitStun > 0
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
      this.dashTimer > 0 ||
      this.hitStun > 0
    ) {

      return;

    }

    this.dashTimer =
      DASH_TIME;

    this.invulnerable =
      true;

    spawnParticles(

      new THREE.Vector3(
        this.position.x,
        1,
        0
      ),

      this.accent,

      8,

      2

    );

  }

  /* =======================================================
     BLOCK
     ======================================================= */

  setBlocking(value) {

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

  }

  /* =======================================================
     ATTACK
     ======================================================= */

  attack(type) {

    if (
      this.attacking ||
      this.hitStun > 0 ||
      this.blocking
    ) {

      return;

    }

    this.attacking =
      true;

    this.attackType =
      type;

    this.attackHit =
      false;

    if (
      type === "punch"
    ) {

      this.attackDuration =
        0.42;

    } else {

      this.attackDuration =
        0.58;

    }

    this.attackTimer =
      this.attackDuration;

  }

  updateAttack(dt) {

    if (
      !this.attacking
    ) {

      return;

    }

    this.attackTimer -= dt;

    const progress =
      1 -
      this.attackTimer /
        this.attackDuration;

    const activeWindow =
      progress > 0.32 &&
      progress < 0.68;

    if (
      activeWindow &&
      !this.attackHit
    ) {

      this.attackHit =
        true;

      this.performHitCheck();

    }

    if (
      this.attackTimer <= 0
    ) {

      this.attacking =
        false;

      this.attackType =
        null;

      this.attackTimer =
        0;

    }

  }

  performHitCheck() {

    const opponent =
      this.isPlayer
        ? enemy
        : player;

    const distance =
      Math.abs(
        opponent.position.x -
        this.position.x
      );

    const range =
      this.attackType ===
      "punch"
        ? 1.65
        : 2.0;

    if (
      distance <= range
    ) {

      const baseDamage =
        this.attackType ===
        "punch"
          ? 7
          : 10;

      opponent.takeDamage(
        baseDamage,
        this
      );

    }

  }

  /* =======================================================
     DAMAGE
     ======================================================= */

  takeDamage(
    amount,
    attacker
  ) {

    if (
      this.invulnerable ||
      state.finished
    ) {

      return;

    }

    let damage =
      amount;

    if (
      this.blocking
    ) {

      damage *= 0.2;

      this.vitality =
        Math.max(
          0,
          this.vitality -
            amount * 0.18
        );

      spawnParticles(

        new THREE.Vector3(
          this.position.x,
          2.5,
          0.5
        ),

        0x9b65ff,

        7,

        2

      );

    } else {

      this.vitality =
        Math.max(
          0,
          this.vitality -
            amount * 0.08
        );

      this.hitStun =
        0.22;

      this.velocity.x =
        attacker.facing *
        2.5;

      spawnParticles(

        new THREE.Vector3(
          this.position.x,
          2.7,
          0.5
        ),

        0xffbd32,

        12,

        4

      );

      state.shake =
        Math.min(
          0.35,
          state.shake +
            0.12
        );

    }

    this.health =
      Math.max(
        0,
        this.health -
          damage
      );

    attacker.damageDealt +=
      damage;

    if (
      attacker.isPlayer
    ) {

      state.totalPlayerDamage +=
        damage;

      attacker.combo += 1;

      attacker.comboTimer =
        COMBO_TIMEOUT;

      attacker.maxCombo =
        Math.max(
          attacker.maxCombo,
          attacker.combo
        );

      state.maxCombo =
        Math.max(
          state.maxCombo,
          attacker.combo
        );

      gainFury(
        attacker,
        damage
      );

      showDamage(
        damage,
        this
      );

      state.lastHitTime =
        performance.now();

    }

    updateHUD();

    if (
      this.health <= 0
    ) {

      this.health = 0;

      checkDefeat();

    }

  }

  /* =======================================================
     FURY
     ======================================================= */

  useFury() {

    if (
      this.fury <= 0 ||
      this.attacking ||
      this.hitStun > 0
    ) {

      return;

    }

    const level =
      this.fury;

    this.fury = 0;

    this.furyUsed +=
      level;

    this.attacking =
      true;

    this.attackType =
      "fury";

    this.attackDuration =
      0.95 +
      level * 0.2;

    this.attackTimer =
      this.attackDuration;

    this.attackHit =
      false;

    furyFlash.classList.remove(
      "active"
    );

    void furyFlash.offsetWidth;

    furyFlash.classList.add(
      "active"
    );

    spawnParticles(

      new THREE.Vector3(
        this.position.x,
        2.5,
        0
      ),

      this.accent,

      30,

      6

    );

    if (
      this.isPlayer
    ) {

      furyButton.classList.remove(
        "ready"
      );

    }

  }

  /* =======================================================
     ANIMATION
     ======================================================= */

  animate() {

    const t =
      performance.now() *
      0.001;

    if (
      this.hitStun > 0
    ) {

      this.animateHit();

      return;

    }

    if (
      this.blocking
    ) {

      this.leftArm.rotation.z =
        -0.9;

      this.rightArm.rotation.z =
        0.9;

      this.leftArm.rotation.x =
        -0.6;

      this.rightArm.rotation.x =
        -0.6;

    } else if (
      this.attacking
    ) {

      this.animateAttack();

    } else {

      const walk =
        Math.sin(t * 7);

      this.leftArm.rotation.x =
        walk * 0.25;

      this.rightArm.rotation.x =
        -walk * 0.25;

      this.leftLeg.rotation.x =
        -walk * 0.22;

      this.rightLeg.rotation.x =
        walk * 0.22;

      this.torso.rotation.z =
        walk * 0.025;

    }

    if (
      !this.grounded
    ) {

      this.leftLeg.rotation.x =
        -0.35;

      this.rightLeg.rotation.x =
        0.35;

    }

  }

  animateAttack() {

    const progress =
      1 -
      this.attackTimer /
        this.attackDuration;

    if (
      this.attackType ===
      "punch"
    ) {

      const swing =
        Math.sin(
          Math.min(
            1,
            progress
          ) *
          Math.PI
        );

      if (
        this.facing === 1
      ) {

        this.rightArm.rotation.x =
          -1.7 * swing;

        this.rightArm.rotation.z =
          -0.35 * swing;

      } else {

        this.leftArm.rotation.x =
          -1.7 * swing;

        this.leftArm.rotation.z =
          0.35 * swing;

      }

    } else if (
      this.attackType ===
      "kick"
    ) {

      const swing =
        Math.sin(
          Math.min(
            1,
            progress
          ) *
          Math.PI
        );

      if (
        this.facing === 1
      ) {

        this.rightLeg.rotation.x =
          -1.45 * swing;

      } else {

        this.leftLeg.rotation.x =
          -1.45 * swing;

      }

    } else if (
      this.attackType ===
      "fury"
    ) {

      const pulse =
        1 +
        Math.sin(
          performance.now() *
            0.025
        ) *
        0.12;

      this.body.scale.set(
        pulse,
        pulse,
        pulse
      );

      this.leftArm.rotation.x =
        -1.3;

      this.rightArm.rotation.x =
        -1.3;

      this.leftLeg.rotation.x =
        -0.3;

      this.rightLeg.rotation.x =
        0.3;

      const opponent =
        this.isPlayer
          ? enemy
          : player;

      if (
        !this.attackHit &&
        progress > 0.45 &&
        progress < 0.65
      ) {

        this.attackHit =
          true;

        const distance =
          Math.abs(
            opponent.position.x -
            this.position.x
          );

        if (
          distance < 3.2
        ) {

          const furyLevel =
            Math.max(
              1,
              this.furyUsed
            );

          opponent.takeDamage(
            15 +
              furyLevel * 8,
            this
          );

        }

      }

      if (
        this.attackTimer <=
        0.05
      ) {

        this.body.scale.set(
          1,
          1,
          1
        );

      }

    }

  }

  animateHit() {

    this.torso.rotation.z =
      -0.18 *
      this.facing;

    this.head.rotation.z =
      0.12;

    this.leftArm.rotation.z =
      0.5;

    this.rightArm.rotation.z =
      -0.5;

  }

  /* =======================================================
     ARENA LIMIT
     ======================================================= */

  keepInsideArena() {

    this.position.x =
      THREE.MathUtils.clamp(
        this.position.x,
        -ARENA_WIDTH + 1,
        ARENA_WIDTH - 1
      );

  }

}

/* =========================================================
   FIGHTERS
   ========================================================= */

const player =
  new Fighter({

    name: "IRON FURY",

    isPlayer: true,

    color: 0x263642,

    accent: 0x28d7ff

  });

const enemy =
  new Fighter({

    name: "RIVAL",

    isPlayer: false,

    color: 0x4a2029,

    accent: 0xff3e55

  });

player.position.set(
  -4,
  0,
  0
);

enemy.position.set(
  4,
  0,
  0
);

/* =========================================================
   FURY
   ========================================================= */

function gainFury(
  fighter,
  amount
) {

  const gain =
    amount >= 8
      ? 0.16
      : 0.1;

  fighter.fury =
    Math.min(
      MAX_FURY,
      fighter.fury +
        gain
    );

  fighter.fury =
    Math.floor(
      fighter.fury *
        10
    ) / 10;

  updateHUD();

}

/* =========================================================
   PLAYER CONTROL
   ========================================================= */

function updatePlayerControl(dt) {

  if (
    state.paused ||
    state.finished
  ) {

    return;

  }

  let direction = 0;

  if (
    joystickState.x <
    -0.18 ||
    input.left
  ) {

    direction -= 1;

  }

  if (
    joystickState.x >
    0.18 ||
    input.right
  ) {

    direction += 1;

  }

  player.move(
    direction,
    dt
  );

}

/* =========================================================
   ENEMY AI
   ========================================================= */

function updateEnemyAI(dt) {

  if (
    state.paused ||
    state.finished
  ) {

    return;

  }

  enemy.aiTimer -= dt;

  const distance =
    player.position.x -
    enemy.position.x;

  const absDistance =
    Math.abs(distance);

  if (
    enemy.aiTimer > 0
  ) {

    return;

  }

  enemy.aiTimer =
    0.12 +
    Math.random() *
      0.18;

  if (
    absDistance > 2
  ) {

    enemy.move(
      Math.sign(distance),
      dt *
        3
    );

  } else {

    const choice =
      Math.random();

    if (
      choice < 0.28
    ) {

      enemy.attack(
        "punch"
      );

    } else if (
      choice < 0.48
    ) {

      enemy.attack(
        "kick"
      );

    } else if (
      choice < 0.63
    ) {

      enemy.setBlocking(
        true
      );

      setTimeout(
        () =>
          enemy.setBlocking(
            false
          ),
        350
      );

    } else if (
      choice < 0.73 &&
      enemy.fury >= 1
    ) {

      enemy.useFury();

    }

  }

}

/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera() {

  const centerX =
    (
      player.position.x +
      enemy.position.x
    ) / 2;

  const distance =
    Math.abs(
      player.position.x -
      enemy.position.x
    );

  const targetZ =
    THREE.MathUtils.clamp(
      13 +
        distance * 0.35,
      12,
      17
    );

  const shakeX =
    state.shake > 0
      ? (Math.random() - 0.5) *
        state.shake
      : 0;

  const shakeY =
    state.shake > 0
      ? (Math.random() - 0.5) *
        state.shake
      : 0;

  camera.position.x +=
    (
      centerX -
      camera.position.x +
      shakeX
    ) *
    0.08;

  camera.position.y +=
    (
      5.1 +
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
    centerX,
    2.3,
    0
  );

  state.shake =
    Math.max(
      0,
      state.shake -
        0.018
    );

}

/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

  playerHealth.style.width =
    `${player.health}%`;

  enemyHealth.style.width =
    `${enemy.health}%`;

  playerVitality.style.width =
    `${player.vitality}%`;

  enemyVitality.style.width =
    `${enemy.vitality}%`;

  playerHealthText.textContent =
    Math.ceil(player.health);

  enemyHealthText.textContent =
    Math.ceil(enemy.health);

  playerVitalityText.textContent =
    Math.ceil(player.vitality);

  enemyVitalityText.textContent =
    Math.ceil(enemy.vitality);

  const playerFuryLevel =
    Math.floor(player.fury);

  const enemyFuryLevel =
    Math.floor(enemy.fury);

  playerFuryText.textContent =
    `${playerFuryLevel} / 3`;

  enemyFuryText.textContent =
    `${enemyFuryLevel} / 3`;

  furySlots.forEach(
    (slot, index) => {

      slot.classList.toggle(
        "active",
        index <
          playerFuryLevel
      );

      slot.classList.toggle(
        "ready",
        playerFuryLevel ===
          3
      );

    }
  );

  enemyFurySlots.forEach(
    (slot, index) => {

      slot.classList.toggle(
        "active",
        index <
          enemyFuryLevel
      );

      slot.classList.toggle(
        "ready",
        enemyFuryLevel ===
          3
      );

    }
  );

  comboNumber.textContent =
    player.combo;

  comboCounter.classList.toggle(
    "visible",
    player.combo > 0
  );

  furyButton.classList.toggle(
    "ready",
    playerFury >= 1
  );

  timerElement.textContent =
    Math.max(
      0,
      Math.ceil(state.time)
    );

}

/* =========================================================
   DAMAGE DISPLAY
   ========================================================= */

function showDamage(
  damage,
  fighter
) {

  const projected =
    fighter.position.clone();

  projected.y +=
    3.8;

  projected.z =
    0.2;

  projected.project(
    camera
  );

  const x =
    (
      projected.x *
      0.5 +
      0.5
    ) *
    window.innerWidth;

  const y =
    (
      -projected.y *
      0.5 +
      0.5
    ) *
    window.innerHeight;

  damageNumber.style.left =
    `${x}px`;

  damageNumber.style.top =
    `${y}px`;

  damageNumber.textContent =
    Math.round(damage);

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

/* =========================================================
   MESSAGES
   ========================================================= */

function showMessage(
  title,
  subtitle = "",
  duration = 1000
) {

  messageElement.textContent =
    title;

  subMessageElement.textContent =
    subtitle;

  messageElement.style.opacity =
    "1";

  subMessageElement.style.opacity =
    "1";

  setTimeout(
    () => {

      messageElement.style.opacity =
        "0";

      subMessageElement.style.opacity =
        "0";

    },
    duration
  );

}

/* =========================================================
   ROUND TIMER
   ========================================================= */

function updateTimer(dt) {

  state.time -= dt;

  if (
    state.time <= 0
  ) {

    state.time = 0;

    endRoundByTime();

  }

  updateHUD();

}

function endRoundByTime() {

  if (
    state.finished
  ) {

    return;

  }

  state.finished =
    true;

  if (
    player.health >
    enemy.health
  ) {

    showResult(
      true,
      "TIME VICTORY"
    );

  } else if (
    enemy.health >
    player.health
  ) {

    showResult(
      false,
      "TIME DEFEAT"
    );

  } else {

    showResult(
      true,
      "DRAW — FURY PREVAILS"
    );

  }

}

/* =========================================================
   DEFEAT
   ========================================================= */

function checkDefeat() {

  if (
    player.health <= 0
  ) {

    showResult(
      false,
      "THE RIVAL WINS"
    );

    return;

  }

  if (
    enemy.health <= 0
  ) {

    state.finishReady =
      true;

    finishTitle.textContent =
      "FURY FINISH";

    finishSubtitle.textContent =
      "THE RIVAL IS DEFEATED";

    finishOverlay.classList.remove(
      "hidden"
    );

  }

}

/* =========================================================
   FINISH
   ========================================================= */

function performFinish() {

  finishOverlay.classList.add(
    "hidden"
  );

  state.finished =
    true;

  player.attacking =
    true;

  player.attackType =
    "fury";

  player.attackDuration =
    1.5;

  player.attackTimer =
    1.5;

  player.attackHit =
    false;

  state.shake =
    0.35;

  spawnParticles(

    new THREE.Vector3(
      enemy.position.x,
      2.5,
      0
    ),

    0xffbd32,

    55,

    8

  );

  showMessage(
    "FURY FINISH",
    "IRON FURY",
    1500
  );

  setTimeout(
    () => {

      showResult(
        true,
        "FURY FINISH"
      );

    },
    1300
  );

}

/* =========================================================
   RESULT
   ========================================================= */

function showResult(
  victory,
  description
) {

  state.finished =
    true;

  resultTitle.textContent =
    victory
      ? "VICTORY"
      : "DEFEAT";

  resultDescription.textContent =
    description;

  resultCombo.textContent =
    state.maxCombo;

  resultDamage.textContent =
    Math.round(
      state.totalPlayerDamage
    );

  resultFury.textContent =
    player.furyUsed;

  resultOverlay.classList.remove(
    "hidden"
  );

}

/* =========================================================
   RESTART
   ========================================================= */

function restartGame() {

  state.running =
    true;

  state.paused =
    false;

  state.finished =
    false;

  state.time =
    ROUND_TIME;

  state.maxCombo =
    0;

  state.totalPlayerDamage =
    0;

  state.totalEnemyDamage =
    0;

  state.shake =
    0;

  player.health =
    MAX_HEALTH;

  player.vitality =
    MAX_VITALITY;

  player.fury =
    0;

  player.combo =
    0;

  player.comboTimer =
    0;

  player.furyUsed =
    0;

  player.position.set(
    -4,
    0,
    0
  );

  player.velocity.set(
    0,
    0,
    0
  );

  player.grounded =
    true;

  player.attacking =
    false;

  player.blocking =
    false;

  enemy.health =
    MAX_HEALTH;

  enemy.vitality =
    MAX_VITALITY;

  enemy.fury =
    0;

  enemy.combo =
    0;

  enemy.furyUsed =
    0;

  enemy.position.set(
    4,
    0,
    0
  );

  enemy.velocity.set(
    0,
    0,
    0
  );

  enemy.grounded =
    true;

  enemy.attacking =
    false;

  enemy.blocking =
    false;

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

/* =========================================================
   PAUSE
   ========================================================= */

function setPaused(
  value
) {

  state.paused =
    value;

  pauseMenu.classList.toggle(
    "hidden",
    !value
  );

}

/* =========================================================
   BUTTON HELPERS
   ========================================================= */

function bindPress(
  element,
  onDown,
  onUp = () => {}
) {

  const down = event => {

    event.preventDefault();

    element.classList.add(
      "pressed"
    );

    onDown();

  };

  const up = event => {

    event.preventDefault();

    element.classList.remove(
      "pressed"
    );

    onUp();

  };

  element.addEventListener(
    "pointerdown",
    down,
    {
      passive: false
    }
  );

  element.addEventListener(
    "pointerup",
    up,
    {
      passive: false
    }
  );

  element.addEventListener(
    "pointercancel",
    up,
    {
      passive: false
    }
  );

  element.addEventListener(
    "pointerleave",
    up,
    {
      passive: false
    }
  );

}

/* =========================================================
   BUTTON BINDINGS
   ========================================================= */

bindPress(
  jumpButton,
  () => player.jump()
);

bindPress(
  dashButton,
  () => player.dash()
);

bindPress(
  punchButton,
  () => player.attack("punch")
);

bindPress(
  kickButton,
  () => player.attack("kick")
);

bindPress(
  blockButton,
  () =>
    player.setBlocking(true),
  () =>
    player.setBlocking(false)
);

bindPress(
  furyButton,
  () => player.useFury()
);

/* =========================================================
   PAUSE BUTTONS
   ========================================================= */

pauseButton.addEventListener(
  "click",
  () =>
    setPaused(
      !state.paused
    )
);

resumeButton.addEventListener(
  "click",
  () =>
    setPaused(false)
);

pauseRestartButton.addEventListener(
  "click",
  restartGame
);

restartButton.addEventListener(
  "click",
  restartGame
);

finishButton.addEventListener(
  "click",
  performFinish
);

/* =========================================================
   KEYBOARD
   ========================================================= */

window.addEventListener(
  "keydown",
  event => {

    switch (
      event.code
    ) {

      case "ArrowLeft":
      case "KeyA":
        input.left = true;
        break;

      case "ArrowRight":
      case "KeyD":
        input.right = true;
        break;

      case "ArrowUp":
      case "KeyW":
        input.up = true;
        break;

      case "ArrowDown":
      case "KeyS":
        input.down = true;
        break;

      case "Space":

        if (
          !event.repeat
        ) {

          player.jump();

        }

        break;

      case "KeyJ":

        if (
          !event.repeat
        ) {

          player.attack(
            "punch"
          );

        }

        break;

      case "KeyK":

        if (
          !event.repeat
        ) {

          player.attack(
            "kick"
          );

        }

        break;

      case "KeyL":

        player.setBlocking(
          true
        );

        break;

      case "KeyF":

        if (
          !event.repeat
        ) {

          player.useFury();

        }

        break;

      case "ShiftLeft":
      case "ShiftRight":

        if (
          !event.repeat
        ) {

          player.dash();

        }

        break;

      case "Escape":

        setPaused(
          !state.paused
        );

        break;

    }

  }
);

window.addEventListener(
  "keyup",
  event => {

    switch (
      event.code
    ) {

      case "ArrowLeft":
      case "KeyA":
        input.left = false;
        break;

      case "ArrowRight":
      case "KeyD":
        input.right = false;
        break;

      case "ArrowUp":
      case "KeyW":
        input.up = false;
        break;

      case "ArrowDown":
      case "KeyS":
        input.down = false;
        break;

      case "KeyL":

        player.setBlocking(
          false
        );

        break;

    }

  }
);

/* =========================================================
   JOYSTICK
   ========================================================= */

function updateJoystick(
  clientX,
  clientY
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
    clientX -
    centerX;

  let dy =
    clientY -
    centerY;

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
      (dx / distance) *
      radius;

    dy =
      (dy / distance) *
      radius;

  }

  joystickState.x =
    dx / radius;

  joystickState.y =
    dy / radius;

  joystickKnob.style.transform =
    `translate(
      calc(-50% + ${dx}px),
      calc(-50% + ${dy}px)
    )`;

}

joystick.addEventListener(
  "pointerdown",
  event => {

    event.preventDefault();

    joystickState.active =
      true;

    joystickState.pointerId =
      event.pointerId;

    joystick.setPointerCapture(
      event.pointerId
    );

    updateJoystick(
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
      !joystickState.active ||
      event.pointerId !==
        joystickState.pointerId
    ) {

      return;

    }

    event.preventDefault();

    updateJoystick(
      event.clientX,
      event.clientY
    );

  },
  {
    passive: false
  }
);

function resetJoystick() {

  joystickState.active =
    false;

  joystickState.pointerId =
    null;

  joystickState.x =
    0;

  joystickState.y =
    0;

  joystickKnob.style.transform =
    "translate(-50%, -50%)";

}

joystick.addEventListener(
  "pointerup",
  resetJoystick
);

joystick.addEventListener(
  "pointercancel",
  resetJoystick
);

/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    const width =
      window.innerWidth;

    const height =
      window.innerHeight;

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

  }
);

/* =========================================================
   FIXED UPDATE
   ========================================================= */

function fixedUpdate(dt) {

  if (
    state.paused ||
    state.finished
  ) {

    return;

  }

  updatePlayerControl(
    dt
  );

  updateEnemyAI(
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

  updateParticles(
    dt
  );

  updateCamera();

}

/* =========================================================
   RENDER LOOP
   ========================================================= */

function gameLoop(
  currentTime
) {

  requestAnimationFrame(
    gameLoop
  );

  const frameTime =
    Math.min(
      0.1,
      (
        currentTime -
        state.lastTime
      ) / 1000
    );

  state.lastTime =
    currentTime;

  state.accumulator +=
    frameTime;

  while (
    state.accumulator >=
    FIXED_STEP
  ) {

    fixedUpdate(
      FIXED_STEP
    );

    state.accumulator -=
      FIXED_STEP;

  }

  renderer.render(
    scene,
    camera
  );

}

/* =========================================================
   LOADING
   ========================================================= */

function startLoading() {

  let progress =
    0;

  const loadingInterval =
    setInterval(
      () => {

        progress +=
          Math.random() * 18;

        progress =
          Math.min(
            100,
            progress
          );

        loadingProgress.style.width =
          `${progress}%`;

        if (
          progress < 35
        ) {

          loadingText.textContent =
            "BUILDING ARENA...";

        } else if (
          progress < 70
        ) {

          loadingText.textContent =
            "LOADING FIGHTERS...";

        } else if (
          progress < 95
        ) {

          loadingText.textContent =
            "ARMING FURY SYSTEM...";

        } else {

          loadingText.textContent =
            "READY";

        }

        if (
          progress >= 100
        ) {

          clearInterval(
            loadingInterval
          );

          setTimeout(
            () => {

              loadingScreen.classList.add(
                "hidden"
              );

              state.running =
                true;

              restartGame();

            },
            350
          );

        }

      },
      90
    );

}

/* =========================================================
   START
   ========================================================= */

updateHUD();

gameLoop(
  performance.now()
);

startLoading();
