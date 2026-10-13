function showMessage() {
    alert("Welcome to SkillTrack! Let's build your future.");
}

// Common skills used to check spelling
const commonSkills = [
    "Python", "Java", "JavaScript", "HTML", "CSS",
    "SQL", "MySQL", "C", "C++", "PHP",
    "React", "Node.js", "Flask", "Django",
    "Git", "GitHub", "Machine Learning"
];

// Calculate how different two words are
function editDistance(a, b) {
    let dp = Array.from(
        { length: a.length + 1 },
        () => Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) {
        dp[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            let cost = a[i - 1] === b[j - 1] ? 0 : 1;

            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[a.length][b.length];
}

function addSkill() {
    let input = document.getElementById("skillInput");
    let skill = input.value.trim();

    if (skill === "") {
        alert("Please enter a skill!");
        return;
    }

    // Look for the closest common skill spelling
    let typed = skill.toLowerCase();
    let bestMatch = null;
    let smallestDistance = Infinity;

    for (let item of commonSkills) {
        let distance = editDistance(typed, item.toLowerCase());

        if (distance < smallestDistance) {
            smallestDistance = distance;
            bestMatch = item;
        }
    }

    // Suggest a correction only when the words are close
    let maxDistance = typed.length <= 4 ? 1 : 2;

    if (
        bestMatch &&
        typed !== bestMatch.toLowerCase() &&
        smallestDistance <= maxDistance
    ) {
        let useSuggestion = confirm(
            "Did you mean " + bestMatch + "?\n\n" +
            "Press OK to use " + bestMatch +
            ", or Cancel to keep your original spelling."
        );

        if (useSuggestion) {
            skill = bestMatch;
        }
    } else {
        // Use standard capitalization for exact matches
        let exactMatch = commonSkills.find(
            item => item.toLowerCase() === typed
        );

        if (exactMatch) {
            skill = exactMatch;
        }
    }

    // Check duplicates without considering capitalization
    let skillKey = skill.toLowerCase();

    let existingSkills = document.querySelectorAll("#skillList li");

    for (let item of existingSkills) {
        if (item.dataset.skill === skillKey) {
            alert("This skill has already been added!");
            input.value = "";
            return;
        }
    }

    // Create the skill item
    let li = document.createElement("li");
    li.dataset.skill = skillKey;
    li.appendChild(document.createTextNode(skill + " "));

    // Create its Remove button
    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";

    removeButton.onclick = function () {
        li.remove();
    };

    li.appendChild(removeButton);

    document.getElementById("skillList").appendChild(li);

    input.value = "";
}

// Allow Enter to add a skill
document.getElementById("skillInput").addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addSkill();
        }
    }
);
