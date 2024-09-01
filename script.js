import { isCollide, randomColor } from "./utils.js";

const speedDash = document.querySelector(".speedDash");
const scoreDash = document.querySelector(".scoreDash");
const lifeDash = document.querySelector(".lifeDash");
const container = document.getElementById("container");
const btnStart = document.querySelector(".btnStart");

let animationGame;
let gameIsPlaying = false;
let player;
let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

btnStart.addEventListener("click", startGame);
document.addEventListener("keydown", pressKeyOn);
document.addEventListener("keyup", pressKeyOff);
function resetBoard() {
  container.innerHTML = "";
  btnStart.style.display = "none";
}
function startGame() {
  resetBoard();
  gameIsPlaying = true;
  resetPlayer();
  startBoard();
  setupBadGuy(10);
  animationGame = requestAnimationFrame(playGame);
}

function resetPlayer() {
  let div = document.createElement("div");
  div.setAttribute("class", "playerCar");
  div.x = 250;
  div.y = 500;
  container.appendChild(div);
  player = {
    e: div,
    speed: 0,
    lives: 3,
    score: 0,
    gameScore: 0,
    roadwidth: 250,
    numcars: 2, //تعداد ماشبین هایی که باید رد کنیم تا برنده شویم
    gameEndCounter: 0, //شمارنده بازی
  };
}

//ایجاد جاده
function startBoard() {
  for (let x = 0; x < 13; x++) {
    let div = document.createElement("div");
    div.setAttribute("class", "road");
    div.style.top = x * 50 + "px";
    div.style.width = player.roadwidth + "px";
    container.appendChild(div);
  }
}

//ایجاد ماشین ها رقیب
function setupBadGuy(num) {
  for (let x = 0; x < num; x++) {
    let div = document.createElement("div");
    div.innerHTML = x + 1;
    div.setAttribute("class", "baddy");

    div.style.backgroundColor = randomColor();
    makeBad(div);
    container.appendChild(div);
  }
}
//تابع ساخت ویژگی ها ماشین رقیب
function makeBad(e) {
  let tempRoad = document.querySelector(".road");
  e.style.left =
    tempRoad.offsetLeft +
    Math.ceil(Math.random() * tempRoad.offsetWidth) -
    30 +
    "px";
  e.style.top = Math.ceil(Math.random() * -400) + "px";
  e.speed = Math.ceil(Math.random() * 17) + 2;
}

function pressKeyOn(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function pressKeyOff(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function updateDash() {
  scoreDash.innerHTML = player.score;
  lifeDash.innerHTML = player.lives;
  speedDash.innerHTML = Math.round(player.speed * 13);
}
//تابع حرکت جاده
function moveRoad() {
  let tempRoad = document.querySelectorAll(".road");

  let previousRoad = tempRoad[0].offsetLeft;
  let previouswidth = tempRoad[0].offsetWidth;
  const pSpeed = Math.floor(player.speed);

  for (const element of tempRoad) {
    let num = element.offsetTop + pSpeed;
    if (num > 600) {
      num = num - 650;
      let mover = previousRoad + (Math.floor(Math.random() * 6) - 3);
      let roadwidth = Math.floor(Math.random() * 11) - 5 + previouswidth;
      if (roadwidth < 200) roadwidth = 200;
      if (roadwidth > 400) roadwidth = 400;
      if (mover < 100) mover = 100;
      if (mover > 600) mover = 600;
      element.style.left = mover + "px";
      element.style.width = roadwidth + "px";
      previousRoad = element.offsetLeft;
      previouswidth = element.offsetWidth;
    }
    element.style.top = num + "px";
  }

  return {
    width: previouswidth,
    left: previousRoad,
  };
}
//حرکت ماشین رقیب
function moveBadGuys() {
  let tempBaddy = document.querySelectorAll(".baddy");
  for (let i = 0; i < tempBaddy.length; i++) {
    for (let ii = 0; ii < tempBaddy.length; ii++) {
      if (i != ii && isCollide(tempBaddy[ii], tempBaddy[i])) {
        tempBaddy[ii].style.top = tempBaddy[ii].offsetTop + 50 + "px";
        tempBaddy[i].style.top = tempBaddy[i].offsetTop - 50 + "px";
        tempBaddy[ii].style.left = tempBaddy[ii].offsetLeft - 50 + "px";
        tempBaddy[i].style.left = tempBaddy[i].offsetLeft + 50 + "px";
      }
    }
    let y = tempBaddy[i].offsetTop + player.speed - tempBaddy[i].speed;
    if (y > 2000 || y < -2000) {
      //ماشین ریست شود
      if (y > 2000) {
        player.score++;
        if (player.score > player.numcars) {
          gameOver();
        }
      }
      makeBad(tempBaddy[i]);
    } else {
      tempBaddy[i].style.top = y + "px";
      let hitCar = isCollide(tempBaddy[i], player.e);

      if (hitCar) {
        player.speed = 0;
        player.lives--;
        if (player.lives < 1) {
          player.gameEndCounter = 1;
        }

        makeBad(tempBaddy[i]);
      }
    }
  }
}

function gameOver() {
  let div = document.createElement("div");
  div.setAttribute("class", "road");
  div.style.top = "0px";
  div.style.width = "250px";
  div.style.backgroundColor = "red";
  div.innerHTML = "پایان";
  div.style.fontSize = "3em";
  container.appendChild(div);
  player.speed = 0;
  player.gameEndCounter = 1;
}

//فانکشن شروع بازی
function playGame() {
  if (gameIsPlaying) {
    updateDash();
    //طراحی بازی
    let roadPara = moveRoad();
    moveBadGuys();
    if (keys.ArrowUp) {
      if (player.e.y > 400) {
        player.e.y += -1;
      }
      player.speed = player.speed < 20 ? player.speed + 0.05 : 20;
    }
    if (keys.ArrowDown) {
      if (player.e.y < 500) {
        player.e.y -= -1;
      }

      player.speed = player.speed > 0 ? player.speed - 0.2 : 1;
    }
    if (keys.ArrowRight) {
      player.e.x += player.speed / 4;
    }
    if (keys.ArrowLeft) {
      player.e.x -= player.speed / 4;
    }
    //چک کردن در جاده بودن
    if (
      player.e.x + 40 < roadPara.left ||
      player.e.x > roadPara.left + roadPara.width
    ) {
      if (player.e.y < 500) {
        player.e.y += 1;
      }
      player.speed = player.speed > 0 ? player.speed - 0.2 : 5;

      console.log("exit road");
    }
    //حرکت ماشین
    player.e.style.top = player.e.y + "px";
    player.e.style.left = player.e.x + "px";
  }
  animationGame = requestAnimationFrame(playGame);
  if (player.gameEndCounter > 0) {
    player.gameEndCounter--;
    player.y = player.y > 60 ? player.y - 30 : 60;
    if (player.gameEndCounter == 0) {
      gameIsPlaying = false;
      cancelAnimationFrame(animationGame);
      btnStart.style.display = "block";
    }
  }
}

let logger = () => {
  console.log("logger");
};

const x = requestAnimationFrame(logger);
