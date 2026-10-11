"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcomeScreen");
    const surpriseScreen = document.getElementById("surpriseScreen");
    const startButton = document.getElementById("startButton");
    const progressBar = document.getElementById("progressBar");

    const stages = [
        document.getElementById("stage1"),
        document.getElementById("stage2"),
        document.getElementById("stage3"),
        document.getElementById("stage4"),
        document.getElementById("stage5")
    ];

    const stage1Result = document.getElementById("stage1Result");
    const stage2Result = document.getElementById("stage2Result");
    const stage3Result = document.getElementById("stage3Result");
    const stage4Result = document.getElementById("stage4Result");

    const envelope = document.getElementById("envelope");
    const openLetterButton = document.getElementById("openLetterButton");
    const letterText = document.getElementById("letterText");
    const letterCursor = document.getElementById("letterCursor");
    const letterStatus = document.getElementById("letterStatus");

    let currentStage = 0;
    let started = false;
    let letterOpened = false;
    let letterFinished = false;

    let wrongAttempts = 0;
    let stage4Completed = false;
    let stage3Completed = false;
    let stage2Completed = false;
    let stage1Completed = false;

    const letterMessage =
        "حقیقتا خیلی دلم میخواست روز دخترو یجور دیگه تبریک بگم بهت و کاری که دلم میخواست رو برات بکنم\n" +
        "اما خیلی درگیر بودم\n" +
        "با عموم رفتیم کارای مرخصیه بابامو انجام بدیم و یه داستانایی که اصلا عجیب درگیر بودم\n" +
        "گفتم امروزو  یه کار خیلی کوچیک بکنم که خودم اعصابم خورد نشه و در اینده بتونم جبران کنم برات\n\n" +
        "           روزت مبارک دورت بگردم🤍";


    function showStage(index) {
        if (index < 0 || index >= stages.length) {
            return;
        }

        stages.forEach((stage) => {
            stage.classList.add("hidden");
            stage.classList.remove("stage-enter");
        });

        currentStage = index;

        const activeStage = stages[index];

        activeStage.classList.remove("hidden");

        void activeStage.offsetWidth;

        activeStage.classList.add("stage-enter");

        progressBar.style.width = `${((index + 1) / stages.length) * 100}%`;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    function createResult(message, buttonText, onContinue) {
        const card = document.createElement("div");
        card.className = "result-card";

        const paragraph = document.createElement("p");
        paragraph.className = "result-message";
        paragraph.textContent = message;

        card.appendChild(paragraph);

        if (buttonText && typeof onContinue === "function") {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "button";
            button.textContent = buttonText;

            button.addEventListener("click", onContinue);

            card.appendChild(button);
        }

        return card;
    }


    function showResult(slot, message, buttonText, onContinue) {
        slot.replaceChildren(
            createResult(message, buttonText, onContinue)
        );
    }


    function goToNextStage(index) {
        if (index < 1 || index > 4) {
            return;
        }

        showStage(index);
    }


    function enableNextButton(stageElement) {
        const nextButton = stageElement.querySelector(".next-button");

        if (!nextButton) {
            return;
        }

        nextButton.classList.remove("hidden");
    }


    function markSelected(button) {
        const group = button.closest(".options");

        if (!group) {
            return;
        }

        group.querySelectorAll(".option-button").forEach((option) => {
            option.classList.remove("selected");
            option.setAttribute("aria-pressed", "false");
        });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
    }


    function lockOptions(stageElement) {
        stageElement.querySelectorAll(".option-button").forEach((button) => {
            button.disabled = true;
        });
    }


    function unlockOptions(stageElement) {
        stageElement.querySelectorAll(".option-button").forEach((button) => {
            button.disabled = false;
        });
    }


    function resetStageResult(slot) {
        slot.replaceChildren();
    }


    /* شروع سایت */


    startButton.addEventListener("click", () => {
        if (started) {
            return;
        }

        started = true;

        welcomeScreen.classList.add("hidden");
        surpriseScreen.classList.remove("hidden");

        showStage(0);
    });


    /* دکمه‌های ادامه */


    document.querySelectorAll("[data-next]").forEach((button) => {
        button.addEventListener("click", () => {
            const nextIndex = Number(button.dataset.next);

            if (!Number.isInteger(nextIndex)) {
                return;
            }

            if (nextIndex === 2 && !stage1Completed) {
                return;
            }

            if (nextIndex === 3 && !stage2Completed) {
                return;
            }

            if (nextIndex === 4 && !stage3Completed) {
                return;
            }

            if (nextIndex === 5 && !stage4Completed) {
                return;
            }

            showStage(nextIndex - 1);
        });
    });


    /* مرحله اول: روز دختره */


    stages[0].querySelectorAll("[data-answer]").forEach((button) => {
        button.addEventListener("click", () => {
            const answer = button.dataset.answer;

            markSelected(button);

            resetStageResult(stage1Result);

            const nextButton = stages[0].querySelector(".next-button");

            if (nextButton) {
                nextButton.classList.add("hidden");
            }

            if (answer === "yes") {
                stage1Completed = true;

                showResult(
                    stage1Result,
                    "عمو امروز به اسم و مناسبت روز توعه\n" +
                    "ولی روزی که واقعا برای تو باشه هنوز انتخاب نشده (روز فرشته داریم؟)"
                );

                enableNextButton(stages[0]);

                unlockOptions(stages[0]);

                return;
            }

            stage1Completed = true;

            showResult(
                stage1Result,
                "عمو امروز روز دختره\n" +
                "شاید بخاطر این احساسش نمیکنی که روز مهربون ترین دختر هنوز تعیین نشده"
            );

            enableNextButton(stages[0]);

            unlockOptions(stages[0]);
        });
    });


    /* مرحله دوم: جنگل، دریا، آسمون، آینه */


    const stage2Messages = {
        forest:
            "بیخیال جنگل که همه ش یه مشت درخته و علفه یه گزینه دیگه رو انتخاب کن",

        sea:
            "اونم که تا وقتی انعکاس خودتو توش نبینی قشنگ نیست که یکی دیگه رو امتحان کن",

        sky:
            "اون که ماهش فیکه شما خواستی ماهو ببینی دوربین سلفی گوشیتو استفاده کن",

        mirror:
            "خیلی خود شیفته ای😂"
    };


    stages[1].querySelectorAll("[data-answer]").forEach((button) => {
        button.addEventListener("click", () => {
            const answer = button.dataset.answer;

            markSelected(button);

            const message = stage2Messages[answer];

            if (!message) {
                return;
            }

            resetStageResult(stage2Result);

            const nextButton = stages[1].querySelector(".next-button");

            if (answer === "mirror") {
                stage2Completed = true;

                showResult(stage2Result, message);

                enableNextButton(stages[1]);

                unlockOptions(stages[1]);

                return;
            }

            stage2Completed = false;

            if (nextButton) {
                nextButton.classList.add("hidden");
            }

            showResult(stage2Result, message);

            unlockOptions(stages[1]);
        });
    });


    /* مرحله سوم: سؤال خاورمیانه */


    const stage3Messages = {
        me:
            "روز دختر پایه و اساسش رو شما میچرخه نزن این حرفو یه انتخاب دیگه رو امتحان کن",

        you:
            "چی بگم والا ناراحت که نشدم منطقی داری حرف میزنی\n" +
            "ولی یه گزینه دیگه رو انتخاب کن",

        unknown:
            "معلومه دیگه خره\n" +
            "اخه کی دلش میاد فقط یه روز تو سالو اختصاص بده به دختری مثل تو؟"
    };


    stages[2].querySelectorAll("[data-answer]").forEach((button) => {
        button.addEventListener("click", () => {
            const answer = button.dataset.answer;

            const message = stage3Messages[answer];

            if (!message) {
                return;
            }

            markSelected(button);

            resetStageResult(stage3Result);

            const nextButton = stages[2].querySelector(".next-button");

            if (answer === "unknown") {
                stage3Completed = true;

                showResult(stage3Result, message);

                enableNextButton(stages[2]);

                unlockOptions(stages[2]);

                return;
            }

            stage3Completed = false;

            if (nextButton) {
                nextButton.classList.add("hidden");
            }

            showResult(stage3Result, message);

            unlockOptions(stages[2]);
        });
    });


    /* مرحله چهارم: مقایسه عکس‌ها */


    function completeStage4(message, automatic) {
        if (stage4Completed) {
            return;
        }

        stage4Completed = true;

        lockOptions(stages[3]);

        let buttonText = "";

        if (automatic) {
            buttonText = "اگه بحث نمیکنی کلیک کن";
        } else {
            buttonText = "کلیک کن از خود راضی😌";
        }

        showResult(
            stage4Result,
            message,
            buttonText,
            () => {
                showStage(4);
            }
        );
    }


    stages[3].querySelectorAll("[data-answer]").forEach((button) => {
        button.addEventListener("click", () => {
            if (stage4Completed) {
                return;
            }

            const answer = button.dataset.answer;

            markSelected(button);

            if (answer === "correct") {
                completeStage4(
                    "شبیه‌شی ولی مثل که خودشیفته ام هستی🫣",
                    false
                );

                return;
            }

            wrongAttempts += 1;

            if (wrongAttempts === 1) {
                resetStageResult(stage4Result);

                showResult(stage4Result, "غلط");

                unlockOptions(stages[3]);

                return;
            }

            if (wrongAttempts >= 2) {
                resetStageResult(stage4Result);

                showResult(
                    stage4Result,
                    "میگم غلط دیگه"
                );

                lockOptions(stages[3]);

                window.setTimeout(() => {
                    const correctButton = stages[3].querySelector(
                        '[data-answer="correct"]'
                    );

                    if (correctButton) {
                        correctButton.classList.add("selected");
                    }

                    completeStage4(
                        "بحث نکن دیگه، شبیه‌شی🤣",
                        true
                    );
                }, 850);
            }
        });
    });


    /* مرحله پنجم: نامه */


    function typeLetter() {
        const characters = Array.from(letterMessage);

        let index = 0;

        letterText.textContent = "";

        letterCursor.classList.remove("hidden");

        letterFinished = false;

        function typeNextCharacter() {
            if (index >= characters.length) {
                letterCursor.classList.add("hidden");

                letterFinished = true;

                letterStatus.textContent = "";

                return;
            }

            letterText.textContent += characters[index];

            index += 1;

            const character = characters[index - 1];

            let delay = 28;

            if (character === "\n") {
                delay = 160;
            } else if ("،.!؟".includes(character)) {
                delay = 210;
            } else if (character === " ") {
                delay = 18;
            }

            const content = letterText.parentElement;

            if (content) {
                content.scrollTop = content.scrollHeight;
            }

            window.setTimeout(typeNextCharacter, delay);
        }

        typeNextCharacter();
    }


    openLetterButton.addEventListener("click", () => {
        if (letterOpened) {
            return;
        }

        letterOpened = true;

        openLetterButton.disabled = true;

        openLetterButton.classList.add("hidden");

        envelope.classList.add("opening");

        letterStatus.textContent = "";

        window.setTimeout(() => {
            envelope.classList.add("leaving");
        }, 1100);

        window.setTimeout(() => {
            envelope.classList.add("hidden");

            const scene = document.querySelector(".envelope-scene");

            if (scene) {
                scene.style.minHeight = "0";
                scene.style.padding = "0";
            }

            letterText.parentElement.style.height = "auto";
            letterText.parentElement.style.overflow = "visible";

            const paper = document.getElementById("letterPaper");

            paper.style.position = "relative";
            paper.style.top = "auto";
            paper.style.left = "auto";
            paper.style.width = "100%";
            paper.style.height = "auto";
            paper.style.minHeight = "180px";
            paper.style.opacity = "1";
            paper.style.transform = "none";
            paper.style.overflow = "visible";
            paper.style.padding = "23px 19px";
            paper.style.borderRadius = "12px";

            paper.style.boxShadow =
                "0 12px 30px rgba(77, 48, 34, 0.12)";

            paper.style.display = "block";

            paper.parentElement.style.width = "100%";

            const sceneParent = document.querySelector(".envelope-scene");

            if (sceneParent) {
                sceneParent.appendChild(paper);
            }

            paper.classList.add("stage-enter");

            typeLetter();
        }, 1750);
    });


    /* وضعیت اولیه */


    surpriseScreen.classList.add("hidden");

    stages.forEach((stage) => {
        stage.classList.add("hidden");
    });

    progressBar.style.width = "0%";

});