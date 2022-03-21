let answer;
let playerAnswer;
let score = 0;
const WINNINGSCORE = 10;

const buildImgElement = (src, id = "", className = "", data = "", alt = "") => {
  const element = document.createElement("img");
  if (id) {
    element.id = id;
  }
  if (className) {
    element.classList = className;
  }
  if (data) {
    element.dataset.value = data;
  }
  if (alt) {
    element.alt = alt;
  }

  element.src = src;

  return element;
};

const randomiseKanjiButtons = () => {
  const numbers = [
    { value: 0, alt: "〇" },
    { value: 1, alt: "一" },
    { value: 2, alt: "二" },
    { value: 3, alt: "三" },
    { value: 4, alt: "四" },
    { value: 5, alt: "五" },
    { value: 6, alt: "六" },
    { value: 7, alt: "七" },
    { value: 8, alt: "八" },
    { value: 9, alt: "九" },
    { value: 10, alt: "十" },
  ];

  return numbers.sort(() => Math.random() - 0.5);
};

const buildKanjiDisplay = (randomisedKanji) => {
  const foodElement = document.getElementById("food");

  while (foodElement.children.length > 1) {
    foodElement.firstChild.remove();
  }

  randomisedKanji.forEach((k) => {
    const kanjiImage = buildImgElement(
      `images/food-${k.value}.png`,
      undefined,
      "food",
      k.value.toString(),
      k.alt
    );
    foodElement.insertBefore(
      kanjiImage,
      foodElement.children[foodElement.children.length - 1]
    );
  });

  addKanjiButtonEventListeners();
};

const buildCaterpillar = () => {
  const caterpillarTail = buildImgElement("images/kemushi-tail.png");
  const caterpillarBody = buildImgElement("images/kemushi-body-segment1.png");
  const caterpillarHead = buildImgElement("images/kemushi-head.png");
  document
    .getElementById("caterpiller")
    .append(caterpillarTail, caterpillarBody, caterpillarHead);
};

const growCaterpiller = () => {
  const caterpillarBodyNewSegment = buildImgElement(
    "images/kemushi-body-segment1.png"
  );
  const caterpillerDiv = document.getElementById("caterpiller");

  caterpillerDiv.insertBefore(
    caterpillarBodyNewSegment,
    caterpillerDiv.children[caterpillerDiv.children.length - 1]
  );
  caterpillerDiv.children[caterpillerDiv.children.length - 3].src =
    "images/kemushi-body.png";

  if (caterpillerDiv.children[0].src !== "images/kemushi-head.png") {
    caterpillerDiv.children[caterpillerDiv.children.length - 1].src =
      "images/kemushi-head.png";
  }

  if (document.getElementById("sound").checked === true) {
    new Audio("sounds/yum.mp3").play();
  }
};

const shrinkCaterpiller = () => {
  const caterpillerDiv = document.getElementById("caterpiller");

  if (caterpillerDiv.children.length > 3) {
    caterpillerDiv.removeChild(
      caterpillerDiv.children[caterpillerDiv.children.length - 2]
    );
    caterpillerDiv.children[caterpillerDiv.children.length - 2].src =
      "images/kemushi-body-segment1.png";
  }

  if (caterpillerDiv.children[0].src !== "images/kemushi-head-sad.png") {
    caterpillerDiv.children[caterpillerDiv.children.length - 1].src =
      "images/kemushi-head-sad.png";
  }

  if (document.getElementById("sound").checked === true) {
    new Audio("sounds/boohoo.mp3").play();
  }
};

const generateRandomNo = (minNum, maxNum) => {
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
};

const generateQuestion = () => {
  let firstNumber = generateRandomNo(0, 10);
  let secondNumber = generateRandomNo(0, 10);
  let plusorminus = generateRandomNo(1, 2);
  if (plusorminus === 1) {
    while (firstNumber + secondNumber > 10) {
      firstNumber = generateRandomNo(0, 10);
      secondNumber = generateRandomNo(0, 10);
    }
  } else {
    while (firstNumber - secondNumber < 0) {
      firstNumber = generateRandomNo(0, 10);
      secondNumber = generateRandomNo(0, 10);
    }
  }

  const firstNumberImg = "images/scoreNumbers-" + firstNumber + ".png";
  const secondNumberImg = "images/scoreNumbers-" + secondNumber + ".png";
  let operatorImg;
  if (plusorminus === 1) {
    operatorImg = "images/plus-sign.png";
  } else {
    operatorImg = "images/minus-sign.png";
  }

  const randomisedKanji = randomiseKanjiButtons();
  buildKanjiDisplay(randomisedKanji);

  return {
    firstNumber,
    firstNumberImg,
    secondNumber,
    secondNumberImg,
    plusorminus,
    operatorImg,
  };
};

const changeImage = (e, searchText) => {
  const src = e.target.src;
  const updatedsrc = src.replace(".png", `${searchText}.png`);
  e.target.src = updatedsrc;
};

const restoreImage = (e, searchText) => {
  const src = e.target.src;
  const updatedsrc = src.replace(`${searchText}.png`, ".png");
  e.target.src = updatedsrc;
};

const handleFoodButtonClick = (e) => {
  const answerImg = document.querySelector(".questionContainer img:last-child");
  answerImg.src = e.target.src;
  playerAnswer = e.target.dataset.value;
};

const buildNewQuestion = (question) => {
  const questionContainer = document.querySelector(".questionContainer");
  questionContainer.children[0].src = question.firstNumberImg;
  questionContainer.children[1].src = question.operatorImg;
  questionContainer.children[2].src = question.secondNumberImg;
  questionContainer.children[4].src = "images/question-mark.png";
};

const resetGame = () => {
  const question = generateQuestion();
  score = 0;
  const scoreImg = "images/scoreNumbers-" + score + ".png";
  document.getElementById("keepingScore").src = scoreImg;
  playerAnswer = undefined;
  buildNewQuestion(question);
  answer =
    question.plusorminus === 1
      ? question.firstNumber + question.secondNumber
      : question.firstNumber - question.secondNumber;
  const caterpillerDiv = document.getElementById("caterpiller");
  while (caterpillerDiv.firstChild) {
    caterpillerDiv.firstChild.remove();
  }

  buildCaterpillar();

  document.getElementById("questions").style.display = "block";
  document.getElementById("pupate").style.display = "none";
};

const hatchButterfly = () => {
  if (score !== WINNINGSCORE) return;
  const butterflySelector = generateRandomNo(1, 3);
  const butterflyElement = buildImgElement(
    `images/butterfly${butterflySelector}.png`
  );
  const butterflies = document.getElementById("butterflies");
  butterflies.appendChild(butterflyElement);
  butterflies.style.display = "block";

  resetGame();
};

const pupate = () => {
  document.getElementById("questions").style.display = "none";
  document.getElementById("pupate").style.display = "block";
};

const handleFeedButtonClick = () => {
  if (answer == playerAnswer) {
    score += 1;
    growCaterpiller();
  } else {
    if (score > 0) {
      score -= 1;
    }
    shrinkCaterpiller();
  }

  const scoreImg = "images/scoreNumbers-" + score + ".png";
  document.getElementById("keepingScore").src = scoreImg;

  if (score === WINNINGSCORE) {
    pupate();
  } else {
    const question = generateQuestion();
    buildNewQuestion(question);
    answer =
      question.plusorminus === 1
        ? question.firstNumber + question.secondNumber
        : question.firstNumber - question.secondNumber;
  }
};

const addEventListeners = () => {
  const feedButton = document.getElementById("feedButton");
  feedButton.addEventListener("mouseover", (e) => changeImage(e, "-hover"));
  feedButton.addEventListener("mouseout", (e) => restoreImage(e, "-hover"));
  feedButton.addEventListener("click", () => handleFeedButtonClick());

  const butterflyButton = document.getElementById("butterflyButton");
  butterflyButton.addEventListener("mouseover", (e) =>
    changeImage(e, "-hover")
  );
  butterflyButton.addEventListener("mouseout", (e) =>
    restoreImage(e, "-hover")
  );
  butterflyButton.addEventListener("click", () => hatchButterfly());
};

const addKanjiButtonEventListeners = () => {
  const foodButtons = document.querySelectorAll(".food");
  foodButtons.forEach((b) => {
    b.addEventListener("mouseover", (e) => changeImage(e, "-hover"));
  });
  foodButtons.forEach((b) => {
    b.addEventListener("mouseout", (e) => restoreImage(e, "-hover"));
  });
  foodButtons.forEach((b) => {
    b.addEventListener("click", (e) => handleFoodButtonClick(e));
  });
};

const buildQuestion = (question) => {
  const firstNumberImg = buildImgElement(question.firstNumberImg);
  const operatorImg = buildImgElement(question.operatorImg);
  const secondNumberImg = buildImgElement(question.secondNumberImg);
  const equalsImg = buildImgElement("images/equals-sign.png");
  const questionMarkImg = buildImgElement(
    "images/question-mark.png",
    undefined,
    "bordered"
  );

  document
    .querySelector(".questionContainer")
    .append(
      firstNumberImg,
      operatorImg,
      secondNumberImg,
      equalsImg,
      questionMarkImg
    );
};

const playGame = () => {
  const question = generateQuestion();

  answer =
    question.plusorminus === 1
      ? question.firstNumber + question.secondNumber
      : question.firstNumber - question.secondNumber;
  buildQuestion(question);
};

const setup = () => {
  buildCaterpillar();

  const scoreImage = buildImgElement(
    "images/scoreNumbers-0.png",
    "keepingScore"
  );
  document.getElementById("score").appendChild(scoreImage);

  addEventListeners();

  playGame();
};

setup();
