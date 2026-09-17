async function connectToJava() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/hello"
        );

        const data = await response.text();
        //show java responce on webpage
        document.getElementById("message").innerText = data;
        console.log("java says:"+data);

        // show message if meesage element is exist
        const message = document.getElementById("message");
        if(message){
            message.innerText = data;

        }


    } catch (error) {
        
        console.log("Error connecting to Java:",error);

    }
}

//GET SKILLS FROM JAVA

async function loadSkills(){
    try{
        const response = await fetch(
            "http://localhost:8080/api/skills"
        );
        const skills = await response.json();
        console.log("Skills from Java:",skills);
    
    const container = document.getElementById("skills-container");
    if(!container){
        console.log("skills container not found");
        return;
    }

    //clear old content

    container.innerHTML = "";
    // create cards

    skills.forEach(function(skill){
        const card = document.createElement("div");
        card.className = "skill-card";
        card.innerHTML = ` <h3>${skill.name}</h3>

                <p>
                    Industry Demand:
                    <strong>${skill.demand}%</strong>
                </p>

                <p>
                    ${skill.level}
                </p>`;

                container.appendChild(card);
    })
    
}catch(error){
        console.log("error form java:",error);
    }
} 

//GET JOBS FROM JAVA
async function loadJobs(){
    try{
        const response = await fetch(
            "http://localhost:8080/api/jobs"
        );
        const jobs = await response.json();
        console.log("Jobs from Java:",jobs);

        const container = document.getElementById("jobs-container");

        if(!container){
            console.log("jobs-container not found");
            return;
        }

        container.innerHTML ="";
        jobs.forEach(function(job){
            const card = document.createElement("div");
            card.className = "job-card";
            card.innerHTML =  `<h3>${job.title}</h3>

                <p>
                Required Skills
                    
                    <strong>${job.title}%</strong>
                </p>

                <p>
                    ${job.skills}
                </p>`;
                container.appendChild(card);
        });
    }catch(error){
        console.log("error form java:",error);
    }
}

// GET PROGRAMS FROM JAVA

async function loadPrograms(){
    try{
        const response = await fetch(
            "http://localhost:8080/api/programs"
        );
        const programs = await response.json();
        console.log("Programs from java:",programs);

        const container = document.getElementById("programs-container");
        if(!container){
            console.log("programs-container not found");
            return;
        }
        container.innerHTML = "";
        programs.forEach(function(program){
        const card = document.createElement("div");
        card.className = "program-card";
        card.innerHTML = ` <h3>${program.name}</h3>

                <p>
                    Skill:
                    <strong>${program.skill}%</strong>
                </p>

                <p>
                Duration:
                    ${program.duration}
                </p>`;
                container.appendChild(card);
        });

    } catch(error){
        console.log("error form java",error);
    }
        
}



// =====================================
// JOB STATISTICS CIRCLE ANIMATION
// =====================================

function animateJobStatistics() {

    const percentages =
        document.querySelectorAll(".percentage");


    percentages.forEach(function(element) {

        const target =
            Number(element.getAttribute("data-value"));

        let current = 0;


        const circle =
            element.closest(".circle");


        const interval =
            setInterval(function() {

                current++;


                // Update percentage text

                element.innerText =
                    current + "%";


                // Convert percentage to degrees

                const degrees =
                    current * 3.6;


                // Update circle

                circle.style.background =
                    `conic-gradient(
                        #4f46e5 ${degrees}deg,
                        #e5e7eb ${degrees}deg
                    )`;


                // Stop animation

                if (current >= target) {

                    clearInterval(interval);

                }

            }, 20);

    });

}


// Start circle animation

animateJobStatistics();


//start everthing

connectToJava();
loadSkills();
loadJobs();
loadPrograms();