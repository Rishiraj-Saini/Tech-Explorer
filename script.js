// ===============================
// EXPLORE SKILLS
// ===============================

function exploreSkills() {
    document.getElementById("skills").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// EXPLORE JOBS
// ===============================

function exploreJobs() {
    document.getElementById("jobs").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// LOGIN
// ===============================

function login() {
    alert("Login feature will be added soon.");
}


// ===============================
// ANIMATE HERO GRAPH
// ===============================

function animateChart() {

    const bars = document.querySelectorAll(".chart-bar");

    bars.forEach(function(bar) {

        const width = bar.getAttribute("data-width");

        setTimeout(function() {
            bar.style.width = width;
        }, 300);

    });
}


// ===============================
// LOAD SKILLS
// ===============================

function loadSkills() {

    fetch("http://localhost:8080/api/skills")

        .then(function(response) {

            if (!response.ok) {
                throw new Error("Skills API error");
            }

            return response.json();
        })

        .then(function(data) {

            const container =
                document.getElementById("skills-container");

            const message =
                document.getElementById("message");

            container.innerHTML = "";

            data.forEach(function(skill) {

                const card =
                    document.createElement("div");

                card.className = "data-card";

                card.innerHTML = `
                    <h3>${skill.name}</h3>
                    <p>Demand: ${skill.demand}</p>
                    <span class="tag">
                        Level: ${skill.level}
                    </span>
                `;

                container.appendChild(card);

            });

            message.innerText =
                "Industry skills from Java backend";

        })

        .catch(function(error) {

            console.log(error);

            document.getElementById("message").innerText =
                "Java backend is not connected.";

        });
}


// ===============================
// LOAD JOBS
// ===============================

function loadJobs() {

    fetch("http://localhost:8080/api/jobs")

        .then(function(response) {

            if (!response.ok) {
                throw new Error("Jobs API error");
            }

            return response.json();
        })

        .then(function(data) {

            const container =
                document.getElementById("jobs-container");

            container.innerHTML = "";

            data.forEach(function(job) {

                const card =
                    document.createElement("div");

                card.className = "data-card";

                card.innerHTML = `
                    <h3>${job.title}</h3>
                    <p>Required skills:</p>
                    <span class="tag">
                        ${job.skills}
                    </span>
                `;

                container.appendChild(card);

            });

        })

        .catch(function(error) {

            console.log(error);

            document.getElementById("jobs-container").innerHTML = `
                <div class="data-card">
                    <h3>Java backend not connected</h3>
                    <p>
                        Start your Java server to load jobs.
                    </p>
                </div>
            `;

        });
}


// ===============================
// LOAD PROGRAMS
// ===============================

function loadPrograms() {

    fetch("http://localhost:8080/api/programs")

        .then(function(response) {

            if (!response.ok) {
                throw new Error("Programs API error");
            }

            return response.json();
        })

        .then(function(data) {

            displayPrograms(data);

        })

        .catch(function(error) {

            console.log(error);

            document.getElementById("programs-container").innerHTML = `
                <div class="data-card">
                    <h3>Java backend not connected</h3>
                    <p>
                        Start your Java server to load programs.
                    </p>
                </div>
            `;

        });
}


// ===============================
// DISPLAY PROGRAMS
// ===============================

function displayPrograms(programs) {

    const container =
        document.getElementById("programs-container");

    container.innerHTML = "";

    programs.forEach(function(program) {

        const card =
            document.createElement("div");

        card.className = "data-card";

        card.innerHTML = `
            <h3>${program.name}</h3>

            <p>
                Skill: ${program.skill}
            </p>

            <span class="tag">
                ${program.duration}
            </span>
        `;

        container.appendChild(card);

    });
}


// ===============================
// FIND PROGRAMS
// ===============================

function findPrograms() {

    const selectedSkill =
        document.getElementById("skillSelect").value;

    const result =
        document.getElementById("result");

    if (selectedSkill === "") {

        result.innerText =
            "Please select a skill.";

        return;
    }

    fetch("http://localhost:8080/api/programs")

        .then(function(response) {
            return response.json();
        })

        .then(function(programs) {

            const matchingPrograms =
                programs.filter(function(program) {

                    return program.skill
                        .toLowerCase()
                        .includes(selectedSkill.toLowerCase());

                });

            displayPrograms(matchingPrograms);

            result.innerText =
                matchingPrograms.length +
                " program(s) found.";

        })

        .catch(function(error) {

            console.log(error);

            result.innerText =
                "Please start the Java server.";

        });
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function() {

    animateChart();

    loadSkills();

    loadJobs();

    loadPrograms();

});
