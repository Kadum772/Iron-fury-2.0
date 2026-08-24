// ============================================
// IRON FURY - SAFE ENGINE START
// ============================================

"use strict";

console.log("IRON FURY: game.js started");

// Wait until the page is completely loaded
window.addEventListener("load", function () {

    console.log("IRON FURY: page loaded");

    try {console.log("IRON FURY: entered initialization");

        // ----------------------------------------
        // GET HTML ELEMENTS
        // ----------------------------------------

        const canvas = document.getElementById("gameCanvas");
        const loadingScreen = document.getElementById("loadingScreen");
        const loadingProgress = document.getElementById("loadingProgress");
        const loadingText = document.getElementById("loadingText");

        if (!canvas) {
            throw new Error("gameCanvas was not found");
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas could not start");
        }

        console.log("IRON FURY: canvas ready");


        // ----------------------------------------
        // CANVAS SIZE
        // ----------------------------------------

        function resizeCanvas() {

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

        }

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);


        // ----------------------------------------
        // GAME STATE
        // ----------------------------------------

        let player = {
            x: canvas.width * 0.30,
            y: canvas.height * 0.70,
            width: 70,
            height: 130,
            health: 100,
            fury: 0
        };

        let enemy = {
            x: canvas.width * 0.70,
            y: canvas.height * 0.70,
            width: 70,
            height: 130,
            health: 100,
            fury: 0
        };


        // ----------------------------------------
        // LOADING
        // ----------------------------------------

        let progress = 0;

        const loadingInterval = setInterval(function () {

            progress += 5;

            if (progress > 100) {
                progress = 100;
            }

            if (loadingProgress) {
                loadingProgress.style.width = progress + "%";
            }

            if (loadingText) {

                if (progress < 30) {
                    loadingText.textContent = "LOADING ENGINE";
                } else if (progress < 60) {
                    loadingText.textContent = "LOADING FIGHTERS";
                } else if (progress < 90) {
                    loadingText.textContent = "PREPARING ARENA";
                } else {
                    loadingText.textContent = "READY";
                }

            }

            if (progress >= 100) {

                clearInterval(loadingInterval);

                setTimeout(function () {

                    if (loadingScreen) {
                        loadingScreen.classList.add("hidden");
                    }

                    console.log("IRON FURY: ENGINE READY");

                }, 300);

            }

        }, 40);


        // ----------------------------------------
        // DRAW
        // ----------------------------------------

        function drawBackground() {

            ctx.fillStyle = "#071016";
            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            // Ground

            const groundY = canvas.height * 0.72;

            ctx.fillStyle = "#111b22";

            ctx.fillRect(
                0,
                groundY,
                canvas.width,
                canvas.height - groundY
            );


            // Grid

            ctx.strokeStyle = "rgba(80,150,180,0.18)";
            ctx.lineWidth = 1;

            for (
                let x = 0;
                x < canvas.width;
                x += 50
            ) {

                ctx.beginPath();

                ctx.moveTo(x, groundY);

                ctx.lineTo(
                    canvas.width / 2 +
                    (x - canvas.width / 2) * 1.5,
                    canvas.height
                );

                ctx.stroke();

            }

            for (
                let y = groundY;
                y < canvas.height;
                y += 35
            ) {

                ctx.beginPath();

                ctx.moveTo(0, y);

                ctx.lineTo(canvas.width, y);

                ctx.stroke();

            }

        }


        // ----------------------------------------
        // DRAW FIGHTER
        // ----------------------------------------

        function drawFighter(fighter, isEnemy) {

            const x = fighter.x;
            const ground = fighter.y;

            ctx.save();

            ctx.translate(x, ground);

            // Shadow

            ctx.fillStyle = "rgba(0,0,0,0.5)";

            ctx.beginPath();

            ctx.ellipse(
                0,
                5,
                55,
                12,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Body

            ctx.fillStyle = isEnemy
                ? "#a91f35"
                : "#168aaa";

            ctx.fillRect(
                -25,
                -100,
                50,
                65
            );


            // Head

            ctx.fillStyle = "#d6a27c";

            ctx.beginPath();

            ctx.arc(
                0,
                -120,
                20,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Hair / helmet

            ctx.fillStyle = "#111";

            ctx.beginPath();

            ctx.arc(
                0,
                -128,
                21,
                Math.PI,
                Math.PI * 2
            );

            ctx.fill();


            // Left arm

            ctx.strokeStyle = isEnemy
                ? "#c83b50"
                : "#21b7dd";

            ctx.lineWidth = 14;
            ctx.lineCap = "round";

            ctx.beginPath();

            ctx.moveTo(-22, -90);

            ctx.lineTo(-48, -55);

            ctx.stroke();


            // Right arm

            ctx.beginPath();

            ctx.moveTo(22, -90);

            ctx.lineTo(48, -55);

            ctx.stroke();


            // Legs

            ctx.strokeStyle = "#202830";

            ctx.lineWidth = 18;

            ctx.beginPath();

            ctx.moveTo(-14, -35);

            ctx.lineTo(-22, 0);

            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(14, -35);

            ctx.lineTo(22, 0);

            ctx.stroke();


            ctx.restore();

        }


        // ----------------------------------------
        // DRAW GAME
        // ----------------------------------------

        function draw() {

            drawBackground();

            drawFighter(player, false);

            drawFighter(enemy, true);

        }


        // ----------------------------------------
        // GAME LOOP
        // ----------------------------------------

        function gameLoop() {

            draw();

            requestAnimationFrame(gameLoop);

        }

        gameLoop();


        // ----------------------------------------
        // BUTTON TESTS
        // ----------------------------------------

        function setupButton(id, action) {

            const button = document.getElementById(id);

            if (!button) return;

            button.addEventListener("pointerdown", function (event) {

                event.preventDefault();

                action();

            });

        }


        setupButton("punchButton", function () {

            enemy.health = Math.max(
                0,
                enemy.health - 5
            );

            updateHUD();

        });


        setupButton("kickButton", function () {

            enemy.health = Math.max(
                0,
                enemy.health - 8
            );

            updateHUD();

        });


        setupButton("furyButton", function () {

            if (player.fury >= 3) {

                enemy.health = Math.max(
                    0,
                    enemy.health - 25
                );

                player.fury = 0;

                updateHUD();

            }

        });


        // ----------------------------------------
        // HUD
        // ----------------------------------------

        function updateHUD() {

            const playerHealth =
                document.getElementById("playerHealth");

            const enemyHealth =
                document.getElementById("enemyHealth");

            const playerHealthText =
                document.getElementById("playerHealthText");

            const enemyHealthText =
                document.getElementById("enemyHealthText");

            const playerFuryText =
                document.getElementById("playerFuryText");


            if (playerHealth) {
                playerHealth.style.width =
                    player.health + "%";
            }

            if (enemyHealth) {
                enemyHealth.style.width =
                    enemy.health + "%";
            }

            if (playerHealthText) {
                playerHealthText.textContent =
                    Math.round(player.health);
            }

            if (enemyHealthText) {
                enemyHealthText.textContent =
                    Math.round(enemy.health);
            }

            if (playerFuryText) {
                playerFuryText.textContent =
                    player.fury + " / 3";
            }

        }


        updateHUD();

        console.log("IRON FURY: GAME RUNNING");


    } catch (error) {

        console.error(
            "IRON FURY ENGINE ERROR:",
            error
        );

        // Show a readable error instead of getting
        // permanently stuck on the loading screen.

        if (loadingText) {
            loadingText.textContent =
                "ENGINE ERROR - CHECK GAME.JS";
        }

    }

});
