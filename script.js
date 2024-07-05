document.addEventListener('DOMContentLoaded', () => setupStep(currentStep));

let currentStep = 0;
const userData = {};

const steps = [
    {
        question: "Do you have some time?",
        options: ["In a hurry", "I've time"],
        answerType: "single",
    },
    {
        question: "How do you feel?",
        options: ["Happy", "Tired", "Sick", "Sad"],
        answerType: "single",
    },
    {
        question: "Which budget?",
        options: ["Low", "Medium", "High"],
        answerType: "single",
    },
    {
        question: "Do you have some allergies?",
        hint: "Separate each allergy with a semicolon (;)",
        answerType: "input",
    },
    {
        question: "Which kind of food you don't want to have?",
        options: ["Fish", "Shellfish", "Meat", "Pork", "Onions", "Fry food", "Pepperonis", "Gluten", "Eggs"],
        answerType: "multiple",
    },
    {
        question: "Which equipment do you want to include?",
        options: ["Pan", "Fryer", "Steam Cook", "Oven", "Microwave", "BBQ", "Cooking Fireplace"],
        answerType: "multiple",
    }
];

function setupStep(stepIndex) {
    const app = document.getElementById('app');
    app.innerHTML = `<h1>${steps[stepIndex].question}</h1>`;

    if (steps[stepIndex].answerType === "input") {
        const input = document.createElement('input');
        input.placeholder = "Enter your allergies";
        input.id = "userInput";
        app.appendChild(input);

        const hint = document.createElement('p');
        hint.textContent = steps[stepIndex].hint;
        app.appendChild(hint);
    } else {
        steps[stepIndex].options?.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'choiceButton';
            button.addEventListener('click', (event) => handleAnswer(stepIndex, option, event));
            app.appendChild(button);
        });
    }

    if (stepIndex < steps.length - 1 || stepIndex === 5) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.id = 'nextButton';
        nextButton.addEventListener('click', () => {
            if (stepIndex === 5) {
                const input = document.getElementById('userInput');
                if (input) {
                    userData[stepIndex] = input.value;
                }
            }

            if (stepIndex === steps.length - 1) finish(); // Check if it's the last step to finish
            else {
                currentStep++;
                setupStep(currentStep);
            }
        });
        app.appendChild(nextButton);
    }
}

function handleAnswer(stepIndex, answer, event) {
    if (steps[stepIndex].answerType === "single") {
        userData[stepIndex] = answer; // Save single answer
        const buttons = document.querySelectorAll('.choiceButton');
        buttons.forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
    } else if (steps[stepIndex].answerType === "multiple") {
        if (!userData[stepIndex]) userData[stepIndex] = [];
        const index = userData[stepIndex].indexOf(answer);
        if (index === -1) {
            userData[stepIndex].push(answer);
            event.target.classList.add('selected');
        } else {
            userData[stepIndex].splice(index, 1);
            event.target.classList.remove('selected');
        }
    }
}

async function finish() {
    console.log('All steps completed. User data:', userData);
    const app = document.getElementById('app');
    app.innerHTML = '<p>Thanks for completing the questions. Generating your recipe...</p>';

    try {
        const response = await fetch('http://127.0.0.1:5000/generate-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const recipe = await response.json();
            app.innerHTML = `<h2>Your Recipe</h2><p>${recipe}</p>`;
        } else {
            app.innerHTML = `<p>Error: ${response.status}</p>`;
        }
    } catch (error) {
        app.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
