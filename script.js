/* =====================================================
   NAVIGATION
===================================================== */

function exploreSkills() {
    const section = document.getElementById("skills");
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

function exploreJobs() {
    const section = document.getElementById("jobs");
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

function login() {
    alert("Login feature will be connected to the user system later.");
}


/* =====================================================
   MOBILE MENU
===================================================== */

function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    if (navLinks) {
        navLinks.classList.toggle("open");
    }
}


/* =====================================================
   HERO CHART
===================================================== */

function animateChart() {
    const bars = document.querySelectorAll(".chart-bar");

    bars.forEach(function (bar, index) {
        const width = bar.getAttribute("data-width");
        setTimeout(function () {
            bar.style.width = width;
        }, 250 + (index * 150));
    });
}


/* =====================================================
   SKILLS API
===================================================== */

async function loadSkills() {
    const container = document.getElementById("skillsContainer");
    const message = document.getElementById("message");

    if (!container) return;

    try {
        const response = await fetch("http://localhost:8080/api/skills");
        if (!response.ok) throw new Error("Server returned an error");

        const skills = await response.json();
        container.innerHTML = "";

        skills.forEach(function (skill) {
            const card = document.createElement("div");
            card.className = "data-card";
            card.innerHTML = `
                <div class="card-icon">💻</div>
                <h3>${skill.name}</h3>
                <p>Industry demand:</p>
                <div class="demand">${skill.demand}</div>
                <br>
                <span class="tag">${skill.level}</span>
            `;
            container.appendChild(card);
        });

        if (message) {
            message.textContent = "✓ Connected to Java backend";
            message.style.color = "#16803c";
        }
    } catch (error) {
        console.error("Skills error:", error);
        if (message) {
            message.textContent = "⚠ Cannot connect to Java backend. Start index.java first.";
            message.style.color = "#c62828";
        }
    }
}


/* =====================================================
   JOBS API
===================================================== */

async function loadJobs() {
    const container = document.getElementById("jobsContainer");
    if (!container) return;

    try {
        const response = await fetch("http://localhost:8080/api/jobs");
        if (!response.ok) throw new Error("Server returned an error");

        const jobs = await response.json();
        container.innerHTML = "";

        jobs.forEach(function (job) {
            const card = document.createElement("div");
            card.className = "data-card";

            card.innerHTML = `
                <div class="card-icon">🚀</div>
                <h3>${job.title}</h3>
                <p>Skills required:</p>
                <span class="tag">${job.skills}</span>
                <a class="card-arrow" href="detail.html?type=job&key=${encodeURIComponent(job.title)}" aria-label="View ${job.title} details">→</a>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Jobs error:", error);
        container.innerHTML = `
            <div class="data-card">
                <h3>Unable to load jobs</h3>
                <p>Please start the Java backend and refresh the page</p>
            </div>
        `;
    }
}


/* =====================================================
   PROGRAMS API
===================================================== */

let allPrograms = [];

async function loadPrograms() {
    const container = document.getElementById("programsContainer");
    if (!container) return;

    try {
        const response = await fetch("http://localhost:8080/api/programs");
        if (!response.ok) throw new Error("Server returned an error");

        allPrograms = await response.json();
        displayPrograms(allPrograms);
    } catch (error) {
        console.error("Programs error:", error);
        container.innerHTML = `
            <div class="data-card">
                <h3>Unable to load programs</h3>
                <p>Please start the Java backend.</p>
            </div>
        `;
    }
}

function displayPrograms(programs) {
    const container = document.getElementById("programsContainer");
    if (!container) return;

    container.innerHTML = "";

    if (programs.length === 0) {
        container.innerHTML = `
            <div class="data-card">
                <h3>No matching program</h3>
                <p>Try selecting another skill.</p>
            </div>
        `;
        return;
    }

    programs.forEach(function (program) {
        const card = document.createElement("div");
        card.className = "data-card";
        card.innerHTML = `
            <div class="card-icon">🎓</div>
            <h3>${program.name}</h3>
            <p>Skill: ${program.skill}</p>
            <span class="tag">${program.duration}</span>
            <a class="card-arrow" href="detail.html?type=program&key=${encodeURIComponent(program.name)}" aria-label="View ${program.name} details">→</a>
        `;
        container.appendChild(card);
    });
}

function findPrograms() {
    const select = document.getElementById("skillSelect");
    const result = document.getElementById("result");

    if (!select || !result) return;

    const selectedSkill = select.value.toLowerCase().trim();

    if (selectedSkill === "") {
        result.textContent = "Please select a skill first.";
        displayPrograms(allPrograms);
        return;
    }

    const filteredPrograms = allPrograms.filter(function (program) {
        return programMatchesSkill(program, selectedSkill);
    });

    if (filteredPrograms.length > 0) {
        result.textContent = filteredPrograms.length + " program(s) found for " + select.options[select.selectedIndex].text;
    } else {
        result.textContent = "No program found for this skill.";
    }

    displayPrograms(filteredPrograms);
}















/* =====================================================
   RICH DETAIL CONTENT
   Add a new entry here (key = normalized name) and the
   detail page will automatically show rich content for
   that job role / program. If an entry is missing, the
   page falls back to the simple basic card.
===================================================== */

/* Turns "Cyber Scurity" / "AI & ML Engineer" etc. into
   one canonical key so backend typos still match. */
function normalizeKey(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/scurity/g, "security")
        .replace(/sequrity/g, "security")
        .replace(/genrative/g, "generative")
        .replace(/oparting/g, "operating")
        .replace(/prating/g, "prating")
        .replace(/data base/g, "database")
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

const JOB_DETAILS = {
    "full stack developer": {
        description: "A Full Stack Developer builds complete web applications end to end — the user-facing front end, the server-side logic behind it, and the database that stores the data. It is one of the most in-demand roles in the Indian tech market because startups and enterprises alike need engineers who can own a feature from UI to deployment.",
        salary: "Typically \u20b94\u201312 LPA at entry level in India (varies by city, company and skills).",
        highlights: [
            "Build responsive, interactive user interfaces with HTML, CSS and JavaScript",
            "Design and consume REST APIs using Java and Spring Boot",
            "Model, query and manage relational databases with SQL",
            "Connect the front end to the back end and handle authentication, validation and errors",
            "Use Git for version control and collaborate in a team workflow",
            "Deploy and maintain applications on servers or the cloud"
        ],
        skills: ["HTML & CSS", "JavaScript", "Java", "Spring Boot", "SQL", "REST APIs", "Git"],
        roadmap: [
            { title: "Front-end basics", text: "HTML, CSS, responsive layout, and core JavaScript (DOM, events, fetch). Build 3\u20134 small UI projects." },
            { title: "Core Java", text: "OOP, collections, exception handling, and clean coding practices." },
            { title: "Back-end with Spring Boot", text: "REST controllers, services, Spring Data JPA, validation and security basics." },
            { title: "Databases", text: "SQL queries, joins, normalization, and connecting MySQL/PostgreSQL to your app." },
            { title: "Build & ship projects", text: "Combine everything into 2\u20133 full projects (e.g. job portal, e-commerce) and deploy them." }
        ],
        research: [
            { label: "Full Stack Developer Roadmap", url: "https://roadmap.sh/full-stack" },
            { label: "MDN Web Docs (HTML/CSS/JS)", url: "https://developer.mozilla.org" },
            { label: "Spring Boot official guides", url: "https://spring.io/projects/spring-boot" },
            { label: "NPTEL programming courses", url: "https://nptel.ac.in" }
        ],
        youtube: [
            { label: "Java Full Stack Development course", url: "https://www.youtube.com/results?search_query=java+full+stack+development+full+course" },
            { label: "Spring Boot tutorial for beginners", url: "https://www.youtube.com/results?search_query=spring+boot+tutorial+for+beginners" },
            { label: "HTML CSS JavaScript full course", url: "https://www.youtube.com/results?search_query=html+css+javascript+full+course" },
            { label: "SQL full course", url: "https://www.youtube.com/results?search_query=sql+full+course" }
        ]
    },

    "python developer": {
        description: "Python Developers write the server-side logic, scripts, data pipelines and APIs that power modern applications. Python's simplicity and huge ecosystem (FastAPI, Django, pandas, and AI libraries) make it the most flexible first language — and one of the most requested skills in Indian job postings.",
        salary: "Typically \u20b94\u201310 LPA at entry level in India (higher in product companies and data-focused roles).",
        highlights: [
            "Write clean, well-tested Python code following OOP and functional patterns",
            "Build and document REST APIs with FastAPI or Django",
            "Query and manage databases using SQL and Python ORMs",
            "Automate repetitive tasks: file handling, web scraping, report generation",
            "Work with data using pandas and NumPy",
            "Integrate third-party APIs and deploy Python services"
        ],
        skills: ["Python", "SQL", "FastAPI", "REST APIs", "Git", "Pandas / NumPy basics"],
        roadmap: [
            { title: "Python fundamentals", text: "Syntax, data structures, functions, OOP, error handling and virtual environments." },
            { title: "SQL & databases", text: "SELECT/JOIN/aggregate queries, indexes, and connecting Python to MySQL or PostgreSQL." },
            { title: "Build APIs with FastAPI", text: "Routes, request validation, authentication, and automatic docs." },
            { title: "Practical tooling", text: "Git/GitHub, unit testing with pytest, logging, and project structure." },
            { title: "Portfolio projects", text: "Build 2\u20133 back-end projects (e.g. URL shortener, expense API) and host them." }
        ],
        research: [
            { label: "Official Python documentation", url: "https://docs.python.org/3/" },
            { label: "Python Developer Roadmap", url: "https://roadmap.sh/python" },
            { label: "FastAPI official docs", url: "https://fastapi.tiangolo.com" },
            { label: "Real Python tutorials", url: "https://realpython.com" }
        ],
        youtube: [
            { label: "Python full course for beginners", url: "https://www.youtube.com/results?search_query=python+full+course+for+beginners" },
            { label: "FastAPI tutorial", url: "https://www.youtube.com/results?search_query=fastapi+tutorial" },
            { label: "SQL for Python developers", url: "https://www.youtube.com/results?search_query=sql+course+for+python+developers" },
            { label: "Python projects with source code", url: "https://www.youtube.com/results?search_query=python+projects+with+source+code" }
        ]
    },

    "data analyst": {
        description: "Data Analysts turn raw business data into decisions. They collect and clean data, explore it with SQL and Python, build dashboards, and present insights that help companies understand customers, operations and trends. It is the most common entry point into the wider data careers (data science, analytics engineering, BI leadership).",
        salary: "Typically \u20b93.5\u20139 LPA at entry level in India; grows quickly with SQL and dashboarding skills.",
        highlights: [
            "Write SQL queries to extract, join and aggregate data from databases",
            "Clean and explore datasets with Python (pandas) or Excel",
            "Build interactive dashboards in Power BI or Excel",
            "Apply statistics: averages, distributions, correlation, A/B test basics",
            "Tell a clear story with data visualizations and presentations",
            "Work with stakeholders to define metrics and KPIs"
        ],
        skills: ["SQL", "Python", "Excel", "Power BI", "Statistics", "Data Visualization"],
        roadmap: [
            { title: "Excel & statistics foundation", text: "Pivot tables, lookup functions, descriptive statistics and chart types." },
            { title: "SQL deep dive", text: "Joins, GROUP BY, window functions on real datasets (practice on SQLBolt / PGExercises)." },
            { title: "Python for analysis", text: "pandas and matplotlib to clean, explore and visualize data." },
            { title: "Dashboards", text: "Build 2\u20133 Power BI or Excel dashboards on public datasets." },
            { title: "Portfolio & communication", text: "Publish case studies (Kaggle notebooks / GitHub) explaining the business insight, not just the code." }
        ],
        research: [
            { label: "Data Analyst Roadmap", url: "https://roadmap.sh/data-analyst" },
            { label: "Kaggle Learn (free micro-courses)", url: "https://www.kaggle.com/learn" },
            { label: "SQLBolt (interactive SQL)", url: "https://sqlbolt.com" },
            { label: "NPTEL data analytics courses", url: "https://nptel.ac.in" }
        ],
        youtube: [
            { label: "Data Analyst full course", url: "https://www.youtube.com/results?search_query=data+analyst+full+course" },
            { label: "SQL full course", url: "https://www.youtube.com/results?search_query=sql+full+course" },
            { label: "Power BI tutorial for beginners", url: "https://www.youtube.com/results?search_query=power+bi+tutorial+for+beginners" },
            { label: "pandas Python tutorial", url: "https://www.youtube.com/results?search_query=pandas+python+tutorial" }
        ]
    },

    "cyber security": {
        description: "Cyber Security professionals protect systems, networks and data from attacks. The field spans network security, web application security, operating system hardening, and incident response. With India's digital economy expanding and CERT-In reporting lakhs of security incidents every year, demand for entry-level security analysts, SOC analysts and penetration testers keeps rising.",
        salary: "Typically \u20b94\u201312 LPA at entry level in India; certification and hands-on lab experience matter more than degrees.",
        highlights: [
            "Understand networking fundamentals: TCP/IP, DNS, routing, firewalls, VPNs",
            "Harden and monitor operating systems, especially Linux",
            "Test web applications against the OWASP Top 10 (injection, XSS, broken access control and more)",
            "Run network security scans and analyse traffic with tools like Nmap, Wireshark and Burp Suite",
            "Detect, respond to and document security incidents",
            "Automate security checks and log analysis with Python"
        ],
        skills: ["Networking", "Linux", "Operating Systems", "Web Application Security", "Network Security", "Python", "SIEM tools"],
        roadmap: [
            { title: "Networking fundamentals", text: "OSI/TCP-IP model, subnetting, common ports and protocols. Practice with Wireshark and Cisco Packet Tracer." },
            { title: "Operating systems & Linux", text: "File permissions, processes, users, logs and hardening basics on Linux." },
            { title: "Web & application security", text: "OWASP Top 10, SQL injection, XSS, authentication flaws. Practice legally on PortSwigger Web Security Academy and TryHackMe." },
            { title: "Network security & tools", text: "Nmap scanning, firewall rules, IDS/IPS concepts, SIEM dashboards." },
            { title: "Certify & specialize", text: "CompTIA Security+ or CEH, then choose a track: SOC analyst, penetration testing, or security engineering." }
        ],
        research: [
            { label: "Cyber Security Roadmap", url: "https://roadmap.sh/cybersecurity" },
            { label: "OWASP (Top 10 & standards)", url: "https://owasp.org" },
            { label: "TryHackMe (hands-on labs)", url: "https://tryhackme.com" },
            { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
            { label: "CERT-In (Govt. of India)", url: "https://www.cert-in.org.in" }
        ],
        youtube: [
            { label: "Cyber Security full course", url: "https://www.youtube.com/results?search_query=cyber+security+full+course+for+beginners" },
            { label: "Complete networking course", url: "https://www.youtube.com/results?search_query=complete+computer+networking+course" },
            { label: "OWASP Top 10 explained", url: "https://www.youtube.com/results?search_query=owasp+top+10+explained" },
            { label: "Linux for ethical hackers", url: "https://www.youtube.com/results?search_query=linux+for+ethical+hackers" },
            { label: "TryHackMe room walkthroughs", url: "https://www.youtube.com/results?search_query=tryhackme+walkthrough" }
        ]
    },

    "ai and ml engineer": {
        description: "AI & ML Engineers build systems that learn from data — from classic machine-learning models to modern LLM-powered applications. The role combines strong Python skills, understanding of ML algorithms, and increasingly, working with large language models, prompt engineering and AI APIs. It is currently the fastest-growing and highest-paying entry-level tech role in India.",
        salary: "Typically \u20b96\u201315 LPA at entry level in India; LLM/GenAI skills command a premium.",
        highlights: [
            "Train and evaluate machine learning models (regression, classification, clustering)",
            "Handle real datasets: cleaning, feature engineering, validation",
            "Build applications on top of large language models (LLMs) via APIs",
            "Use prompt engineering and RAG (retrieval-augmented generation) patterns",
            "Deploy models as REST APIs so other applications can use them",
            "Evaluate model quality, bias and safety"
        ],
        skills: ["Python", "Machine Learning", "SQL", "LLMs", "Prompt Engineering", "REST APIs", "NumPy / pandas / scikit-learn"],
        roadmap: [
            { title: "Python + data skills", text: "Solid Python, then NumPy, pandas and matplotlib for data handling." },
            { title: "Core machine learning", text: "Supervised/unsupervised algorithms, evaluation metrics, scikit-learn projects." },
            { title: "SQL & data pipelines", text: "Pull and prepare training data from databases." },
            { title: "LLMs & GenAI", text: "Prompt engineering, embeddings, RAG, and calling LLM APIs from Python." },
            { title: "Deploy & showcase", text: "Wrap a model behind a FastAPI endpoint and publish 2\u20133 end-to-end projects." }
        ],
        research: [
            { label: "AI / Data Scientist Roadmap", url: "https://roadmap.sh/ai-data-scientist" },
            { label: "Kaggle Learn & competitions", url: "https://www.kaggle.com/learn" },
            { label: "Hugging Face courses (LLMs)", url: "https://huggingface.co/learn" },
            { label: "Machine Learning Specialization (Andrew Ng)", url: "https://www.coursera.org/specializations/machine-learning-introduction" }
        ],
        youtube: [
            { label: "Machine Learning full course", url: "https://www.youtube.com/results?search_query=machine+learning+full+course" },
            { label: "LLMs and Generative AI course", url: "https://www.youtube.com/results?search_query=large+language+models+course" },
            { label: "Prompt engineering tutorial", url: "https://www.youtube.com/results?search_query=prompt+engineering+tutorial" },
            { label: "AI projects with Python", url: "https://www.youtube.com/results?search_query=ai+projects+with+python+source+code" }
        ]
    }
};

const PROGRAM_DETAILS = {
    "java full stack development": {
        description: "A 6-month program that takes you from web fundamentals to a complete, deployable full-stack application using Java. You will learn the front end (HTML, CSS, JavaScript), the back end (Java, Spring Boot) and the database layer (SQL), finishing with a capstone project you can show to recruiters.",
        highlights: [
            "Build structured, responsive web pages with HTML5 and CSS3",
            "Add interactivity with core JavaScript",
            "Write object-oriented Java and use collections, streams and exception handling",
            "Create production-style REST APIs with Spring Boot and Spring Data JPA",
            "Design and query relational databases with SQL",
            "Complete a capstone full-stack project with Git version control"
        ],
        skills: ["HTML & CSS", "JavaScript", "Java", "Spring Boot", "SQL", "Git"],
        roadmap: [
            { title: "Month 1\u20132: Front-end foundations", text: "HTML, CSS layout (flexbox/grid), JavaScript basics and DOM manipulation." },
            { title: "Month 3: Core Java", text: "OOP, collections, generics, exception handling and clean code practices." },
            { title: "Month 4: Spring Boot", text: "REST controllers, services, repositories, validation and Spring Data JPA." },
            { title: "Month 5: Databases", text: "SQL schema design, joins, indexing and connecting MySQL/PostgreSQL." },
            { title: "Month 6: Capstone project", text: "Plan, build, test and deploy a complete full-stack application." }
        ],
        research: [
            { label: "Spring Boot guides", url: "https://spring.io/projects/spring-boot" },
            { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
            { label: "Full Stack Roadmap", url: "https://roadmap.sh/full-stack" },
            { label: "NPTEL Java courses", url: "https://nptel.ac.in" }
        ],
        youtube: [
            { label: "Java Full Stack course", url: "https://www.youtube.com/results?search_query=java+full+stack+development+full+course" },
            { label: "Spring Boot for beginners", url: "https://www.youtube.com/results?search_query=spring+boot+tutorial+for+beginners" },
            { label: "JavaScript crash course", url: "https://www.youtube.com/results?search_query=javascript+crash+course" }
        ]
    },

    "python programming and database management": {
        description: "A 4-month program focused on the two most reusable skills in tech: Python programming and database management with SQL. Ideal for roles like Python Developer, Data Analyst or as a foundation before moving into data science or AI.",
        highlights: [
            "Master Python syntax, data structures, functions and OOP",
            "Read, write and automate file and data processing tasks",
            "Design normalized relational databases",
            "Write SQL queries: joins, aggregations, subqueries and indexes",
            "Connect Python to MySQL/PostgreSQL and build small data apps",
            "Use Git and virtual environments like a professional developer"
        ],
        skills: ["Python", "SQL", "Database Design", "MySQL / PostgreSQL", "Git"],
        roadmap: [
            { title: "Month 1: Python core", text: "Variables, loops, functions, data structures and error handling." },
            { title: "Month 2: Python deep dive", text: "OOP, modules, file handling, standard library and testing basics." },
            { title: "Month 3: SQL & databases", text: "Schema design, joins, aggregation and practice on SQLBolt / PGExercises." },
            { title: "Month 4: Python + database projects", text: "Build data-driven apps (CRUD apps, report generators) connecting Python to a database." }
        ],
        research: [
            { label: "Official Python docs", url: "https://docs.python.org/3/" },
            { label: "SQLBolt (interactive SQL)", url: "https://sqlbolt.com" },
            { label: "PGExercises (PostgreSQL practice)", url: "https://pgexercises.com" },
            { label: "Real Python tutorials", url: "https://realpython.com" }
        ],
        youtube: [
            { label: "Python full course", url: "https://www.youtube.com/results?search_query=python+full+course+for+beginners" },
            { label: "SQL full course", url: "https://www.youtube.com/results?search_query=sql+full+course" },
            { label: "Python database projects", url: "https://www.youtube.com/results?search_query=python+mysql+project" }
        ]
    },

    "cloud engineering": {
        description: "A 5-month program on designing, deploying and operating applications in the cloud. You will work with at least one major provider (AWS, Azure or GCP), learn Linux and networking basics, containers, and infrastructure-as-code — the skills behind Cloud Engineer and DevOps roles.",
        highlights: [
            "Understand cloud service models: IaaS, PaaS, SaaS",
            "Configure compute, storage, networking and identity services",
            "Work confidently on the Linux command line",
            "Deploy applications in containers with Docker",
            "Automate infrastructure with scripts and infrastructure-as-code",
            "Monitor, secure and control cloud costs"
        ],
        skills: ["Cloud (AWS / Azure / GCP)", "Linux", "Networking basics", "Docker", "CI/CD basics", "Scripting"],
        roadmap: [
            { title: "Month 1: Cloud fundamentals", text: "Shared responsibility model, global infrastructure, core services and free-tier accounts." },
            { title: "Month 2: Linux & networking", text: "Shell commands, users, permissions, DNS, TCP/IP and load balancers." },
            { title: "Month 3: Core cloud services", text: "Virtual machines, object storage, VPCs, IAM roles — on AWS or Azure." },
            { title: "Month 4: Containers & automation", text: "Docker images, containers, and a basic CI/CD pipeline." },
            { title: "Month 5: Capstone deployment", text: "Deploy a real application to the cloud with monitoring and security configured." }
        ],
        research: [
            { label: "AWS Training (free courses)", url: "https://aws.amazon.com/training" },
            { label: "Microsoft Azure training", url: "https://learn.microsoft.com/training/" },
            { label: "Google Cloud training", url: "https://cloud.google.com/learn/training" },
            { label: "DevOps / Cloud Roadmap", url: "https://roadmap.sh/devops" }
        ],
        youtube: [
            { label: "Cloud Computing full course", url: "https://www.youtube.com/results?search_query=cloud+computing+full+course" },
            { label: "AWS tutorial for beginners", url: "https://www.youtube.com/results?search_query=aws+tutorial+for+beginners" },
            { label: "Docker tutorial", url: "https://www.youtube.com/results?search_query=docker+tutorial+for+beginners" },
            { label: "Linux command line course", url: "https://www.youtube.com/results?search_query=linux+command+line+full+course" }
        ]
    },

    "data analytics": {
        description: "A 5-month program that teaches you to clean, analyze and present data — the full workflow from raw dataset to business decision. You will use Excel, SQL, Python (pandas) and a dashboarding tool like Power BI, and graduate with portfolio case studies.",
        highlights: [
            "Perform analysis and reporting in Excel (pivot tables, lookups)",
            "Extract and join data from databases with SQL",
            "Clean and explore datasets with Python and pandas",
            "Apply descriptive statistics and spot misleading metrics",
            "Design interactive dashboards in Power BI",
            "Present findings as clear, actionable business recommendations"
        ],
        skills: ["Excel", "SQL", "Python", "pandas", "Power BI", "Statistics", "Data Visualization"],
        roadmap: [
            { title: "Month 1: Excel & statistics", text: "Pivot tables, charts, averages, distributions and correlation." },
            { title: "Month 2: SQL", text: "Joins, GROUP BY, window functions and practice datasets." },
            { title: "Month 3: Python for data", text: "pandas dataframes, cleaning missing values, grouping and visualization." },
            { title: "Month 4: Dashboards", text: "Power BI data models, DAX basics and publishing reports." },
            { title: "Month 5: Case studies", text: "Analyze 2\u20133 public datasets end to end and document your insights." }
        ],
        research: [
            { label: "Data Analyst Roadmap", url: "https://roadmap.sh/data-analyst" },
            { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
            { label: "SQLBolt", url: "https://sqlbolt.com" },
            { label: "NPTEL analytics courses", url: "https://nptel.ac.in" }
        ],
        youtube: [
            { label: "Data Analytics full course", url: "https://www.youtube.com/results?search_query=data+analytics+full+course" },
            { label: "Power BI tutorial", url: "https://www.youtube.com/results?search_query=power+bi+tutorial+for+beginners" },
            { label: "Excel for data analysis", url: "https://www.youtube.com/results?search_query=excel+for+data+analysis" },
            { label: "pandas tutorial", url: "https://www.youtube.com/results?search_query=pandas+python+tutorial" }
        ]
    },

    "ai and ml engineer": {
        description: "A 5-month program covering machine learning fundamentals through to modern generative AI. You will train and evaluate classic ML models with Python, work with real datasets and SQL, and finish with LLMs — prompt engineering, APIs and retrieval-augmented applications.",
        highlights: [
            "Use Python, NumPy, pandas and matplotlib for ML workloads",
            "Train regression, classification and clustering models with scikit-learn",
            "Evaluate models with the right metrics and avoid overfitting",
            "Prepare data with SQL for training pipelines",
            "Work with large language models: prompting, embeddings and RAG",
            "Deploy a model as a REST API"
        ],
        skills: ["Python", "Machine Learning", "scikit-learn", "SQL", "LLMs", "Prompt Engineering", "REST APIs"],
        roadmap: [
            { title: "Month 1: Python for ML", text: "NumPy, pandas, matplotlib and data cleaning workflows." },
            { title: "Month 2: Machine learning core", text: "Supervised learning, model evaluation and scikit-learn projects." },
            { title: "Month 3: Advanced ML + SQL", text: "Unsupervised learning, feature engineering and pulling training data from databases." },
            { title: "Month 4: LLMs & GenAI", text: "Prompt engineering, LLM APIs, embeddings and building a RAG application." },
            { title: "Month 5: Capstone", text: "Build and deploy an end-to-end AI application (API + front-end)." }
        ],
        research: [
            { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
            { label: "Hugging Face courses", url: "https://huggingface.co/learn" },
            { label: "ML Specialization (Andrew Ng)", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
            { label: "AI / Data Scientist Roadmap", url: "https://roadmap.sh/ai-data-scientist" }
        ],
        youtube: [
            { label: "Machine Learning full course", url: "https://www.youtube.com/results?search_query=machine+learning+full+course" },
            { label: "Generative AI course", url: "https://www.youtube.com/results?search_query=generative+ai+course" },
            { label: "Prompt engineering", url: "https://www.youtube.com/results?search_query=prompt+engineering+tutorial" },
            { label: "scikit-learn tutorial", url: "https://www.youtube.com/results?search_query=scikit-learn+tutorial" }
        ]
    },

    "cyber security": {
        description: "A 10-month, in-depth program covering the full security stack: networking, operating systems, web & application security, and network security. The longer duration reflects how much foundation cyber security requires — by the end you will be prepared for entry-level SOC analyst and security testing roles and ready for certifications like CompTIA Security+.",
        highlights: [
            "Networking: TCP/IP, routing, switching, DNS, VPNs and firewalls",
            "Operating systems: Linux administration, permissions, processes and log analysis",
            "Web & application security: the OWASP Top 10, injection, XSS, broken authentication",
            "Network security: vulnerability scanning, IDS/IPS and traffic analysis with Wireshark and Nmap",
            "Hands-on practice in safe lab environments (TryHackMe, PortSwigger Academy)",
            "Incident response basics and security documentation"
        ],
        skills: ["Networking", "Linux", "Operating Systems", "Web Application Security", "Network Security", "Wireshark / Nmap / Burp Suite", "Python"],
        roadmap: [
            { title: "Months 1\u20133: Networking", text: "OSI and TCP/IP models, subnetting, protocols, and practice with Cisco Packet Tracer and Wireshark." },
            { title: "Months 4\u20135: Operating systems", text: "Linux command line, users and permissions, services, and reading system logs." },
            { title: "Months 6\u20137: Web & application security", text: "OWASP Top 10 vulnerabilities, exploitation in legal labs, and secure coding basics." },
            { title: "Months 8\u20139: Network security", text: "Scanning with Nmap, firewall configuration, SIEM concepts and incident handling." },
            { title: "Month 10: Capstone & certification prep", text: "Complete a security audit project and prepare for CompTIA Security+ or CEH." }
        ],
        research: [
            { label: "Cyber Security Roadmap", url: "https://roadmap.sh/cybersecurity" },
            { label: "OWASP Top 10", url: "https://owasp.org" },
            { label: "TryHackMe labs", url: "https://tryhackme.com" },
            { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
            { label: "CERT-In (Govt. of India)", url: "https://www.cert-in.org.in" },
            { label: "NIELIT / FutureSkills Prime", url: "https://www.futureskillsprime.in" }
        ],
        youtube: [
            { label: "Cyber Security full course", url: "https://www.youtube.com/results?search_query=cyber+security+full+course+for+beginners" },
            { label: "Complete networking course", url: "https://www.youtube.com/results?search_query=complete+computer+networking+course" },
            { label: "Linux for security", url: "https://www.youtube.com/results?search_query=linux+for+ethical+hackers" },
            { label: "OWASP Top 10", url: "https://www.youtube.com/results?search_query=owasp+top+10+explained" },
            { label: "Nmap and Wireshark tutorials", url: "https://www.youtube.com/results?search_query=nmap+wireshark+tutorial" }
        ]
    }
};

function findRichDetail(type, name) {
    const key = normalizeKey(name);
    const map = type === "job" ? JOB_DETAILS : PROGRAM_DETAILS;
    return map[key] || null;
}

function buildRichDetailHTML(type, match, rich) {
    const isJob = type === "job";
    const icon = isJob ? "\uD83D\uDE80" : "\uD83C\uDF93";

    document.title = (isJob ? match.title : match.name) + " \u2013 Tech Explorer";

    const subtitle = isJob
        ? "Skills from the industry dataset: " + match.skills
        : "Core skills: " + match.skill + " \u2022 Duration: " + match.duration;

    const skillChips = (rich.skills || [])
        .map(function (s) { return `<span class="tag detail-chip">${s}</span>`; })
        .join("");

    const highlights = (rich.highlights || [])
        .map(function (h) { return `<li>${h}</li>`; })
        .join("");

    const roadmap = (rich.roadmap || [])
        .map(function (r, i) {
            return `<div class="roadmap-step">
                <div class="roadmap-number">${i + 1}</div>
                <div class="roadmap-text"><strong>${r.title}</strong><p>${r.text}</p></div>
            </div>`;
        })
        .join("");

    const research = (rich.research || [])
        .map(function (r) {
            return `<a class="resource-link" href="${r.url}" target="_blank" rel="noopener">${r.label} \u2197</a>`;
        })
        .join("");

    const youtube = (rich.youtube || [])
        .map(function (y) {
            return `<a class="resource-link youtube" href="${y.url}" target="_blank" rel="noopener">\u25B6 ${y.label}</a>`;
        })
        .join("");

    const salary = rich.salary ? `
        <div class="detail-callout"><strong>Indicative salary:</strong> ${rich.salary}</div>` : "";

    return `
        <div class="detail-card rich">
            <div class="detail-hero">
                <div class="card-icon">${icon}</div>
                <div>
                    <span class="detail-type">${isJob ? "JOB ROLE" : "LEARNING PROGRAM"}</span>
                    <h2>${isJob ? match.title : match.name}</h2>
                    <p>${subtitle}</p>
                </div>
            </div>

            <div class="detail-columns">
                <div class="detail-col">
                    <h3 class="detail-heading">About</h3>
                    <p class="detail-desc">${rich.description}</p>
                    ${salary}

                    <h3 class="detail-heading">${isJob ? "What this role involves" : "What you will learn"}</h3>
                    <ul class="detail-list">${highlights}</ul>
                </div>

                <div class="detail-col">
                    <h3 class="detail-heading">Key skills</h3>
                    <div class="chip-row">${skillChips}</div>

                    <h3 class="detail-heading">${isJob ? "How to become one" : "Learning roadmap"}</h3>
                    <div class="roadmap">${roadmap}</div>
                </div>
            </div>

            <h3 class="detail-heading">Research & reading</h3>
            <div class="resource-grid">${research}</div>

            <h3 class="detail-heading">YouTube courses</h3>
            <div class="resource-grid">${youtube}</div>
        </div>
    `;
}


/* =====================================================
   SKILL ALIASES (handles backend spellings so the
   program finder still matches, e.g. "Cyber Scurity")
===================================================== */

const SKILL_ALIASES = {
    "cyber security": ["cyber scurity", "networking", "web & application security", "network security", "operating systems", "oparting systems"]
};

function programMatchesSkill(program, selectedSkill) {
    const haystack = (program.skill + " " + program.name).toLowerCase();
    if (haystack.includes(selectedSkill)) return true;

    const aliases = SKILL_ALIASES[selectedSkill] || [];
    return aliases.some(function (alias) {
        return haystack.includes(alias);
    });
}

async function loadDetailPage() {
    const container = document.getElementById("detailContainer");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const key = params.get("key");

    if (!type || !key) {
        container.innerHTML = `
            <div class="detail-card">
                <h2>Item not found</h2>
                <p>This link is missing information about what to show.</p>
            </div>
        `;
        return;
    }

    const endpoint = type === "job" ? "jobs" : "programs";

    try {
        const response = await fetch(`http://localhost:8080/api/${endpoint}`);
        if (!response.ok) throw new Error("Server returned an error");

        const items = await response.json();
        const match = items.find(function (item) {
            const name = type === "job" ? item.title : item.name;
            return name === key;
        });

        if (!match) {
            container.innerHTML = `
                <div class="detail-card">
                    <h2>Not found</h2>
                    <p>We couldn't find that ${type === "job" ? "job role" : "program"}.</p>
                </div>
            `;
            return;
        }

        const rich = findRichDetail(type, type === "job" ? match.title : match.name);
        if (rich) {
            container.innerHTML = buildRichDetailHTML(type, match, rich);
        } else if (type === "job") {
            container.innerHTML = `
                <div class="detail-card">
                    <div class="card-icon">🚀</div>
                    <h2>${match.title}</h2>
                    <p>Skills required for this role:</p>
                    <span class="tag">${match.skills}</span>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="detail-card">
                    <div class="card-icon">🎓</div>
                    <h2>${match.name}</h2>
                    <p>Core skill(s) covered: ${match.skill}</p>
                    <span class="tag">${match.duration}</span>
                </div>
            `;
        }
    } catch (error) {
        console.error("Detail error:", error);
        container.innerHTML = `
            <div class="detail-card">
                <h2>Unable to load details</h2>
                <p>Please start the Java backend and refresh the page.</p>
            </div>
        `;
    }
}






/* =====================================================
   ROLE BAR ANIMATION & COUNTER
===================================================== */

function animateDemandBars() {
    const items = document.querySelectorAll(".demand-item");

    items.forEach(function (item, index) {
        const fill = item.querySelector(".demand-fill");
        const counter = item.querySelector(".counter");

        if (!fill || !counter) return;

        const value = Number(item.getAttribute("data-value"));
        const width = fill.getAttribute("data-width");

        setTimeout(function () {
            fill.style.width = width;
            animateCounter(counter, value, 1000);
        }, 250 + (index * 120));
    });
}

function animateCounter(element, target, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);

        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


/* =====================================================
   2D CIRCLE ANIMATION CHART
===================================================== */

const SKILL_DISTRIBUTION = [
  { label: 'AI & ML Engineering', percent: 40, color: '#8b5cf6' },
  { label: 'Full Stack Developer', percent: 30, color: '#635bff' },
  { label: 'Python + DB Mgmt', percent: 20, color: '#10b981' },
  { label: 'Data Analysis', percent: 10, color: '#f59e0b' }
];

let chartProgress = 0;
let hoveredIndex = -1;

function initCircleChart() {
  const canvas = document.getElementById('skillsChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const outerRadius = 110;
  const innerRadius = 65;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function drawChart(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = -Math.PI / 2;

    SKILL_DISTRIBUTION.forEach((item, index) => {
      const sliceAngle = (item.percent / 100) * (Math.PI * 2) * easeOutCubic(progress);
      const endAngle = startAngle + sliceAngle;

      const isHovered = index === hoveredIndex;
      const currentOuterRadius = isHovered ? outerRadius + 6 : outerRadius;

      // Draw Arc Segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentOuterRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      startAngle = endAngle;
    });

    // Draw Center Hole
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Center Text Info
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (hoveredIndex !== -1) {
      ctx.fillStyle = SKILL_DISTRIBUTION[hoveredIndex].color;
      ctx.font = 'bold 22px Arial';
      ctx.fillText(`${SKILL_DISTRIBUTION[hoveredIndex].percent}%`, centerX, centerY - 8);

      ctx.fillStyle = '#66667a';
      ctx.font = 'bold 11px Arial';
      ctx.fillText(SKILL_DISTRIBUTION[hoveredIndex].label, centerX, centerY + 14);
    } else {
      ctx.fillStyle = '#635bff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('100%', centerX, centerY - 6);

      ctx.fillStyle = '#77778a';
      ctx.font = '600 11px Arial';
      ctx.fillText('Skill Share', centerX, centerY + 14);
    }
  }

  function animate() {
    if (chartProgress < 1) {
      chartProgress += 0.02;
      drawChart(chartProgress);
      requestAnimationFrame(animate);
    } else {
      drawChart(1);
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    const distanceFromCenter = Math.sqrt(x * x + y * y);

    if (distanceFromCenter >= innerRadius && distanceFromCenter <= outerRadius + 10) {
      let angle = Math.atan2(y, x) + Math.PI / 2;
      if (angle < 0) angle += Math.PI * 2;

      let accumulatedAngle = 0;
      let found = -1;

      for (let i = 0; i < SKILL_DISTRIBUTION.length; i++) {
        const sliceAngle = (SKILL_DISTRIBUTION[i].percent / 100) * (Math.PI * 2);
        if (angle >= accumulatedAngle && angle <= accumulatedAngle + sliceAngle) {
          found = i;
          break;
        }
        accumulatedAngle += sliceAngle;
      }

      if (hoveredIndex !== found) {
        hoveredIndex = found;
        drawChart(1);
      }
    } else if (hoveredIndex !== -1) {
      hoveredIndex = -1;
      drawChart(1);
    }
  });

  canvas.addEventListener('mouseleave', () => {
    if (hoveredIndex !== -1) {
      hoveredIndex = -1;
      drawChart(1);
    }
  });

  animate();
}


/* =====================================================
   SCROLL INTERSECTION OBSERVER
===================================================== */

function setupInsightAnimation() {
  const section = document.querySelector(".insights-section");
  if (!section) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateDemandBars();
        initCircleChart();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupMenuLinks() {
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(function (link) {
        link.addEventListener("click", function () {
            const navLinks = document.getElementById("navLinks");
            if (navLinks) {
                navLinks.classList.remove("open");
            }
        });
    });
}


/* =====================================================
   START EVERYTHING
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    animateChart();
    loadSkills();
    loadJobs();
    loadPrograms();
    loadDetailPage();
    setupInsightAnimation();
    setupMenuLinks();
});