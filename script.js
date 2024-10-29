const APIURL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

// Fetch user data
async function getuser(username) {
    try {
        const { data } = await axios(APIURL + username);
        createusercard(data);
        getrepos(username); // Fetch repos after user data is fetched
    } catch (err) {
        if (err.response.status == 404) {
            createErrorCard("No profile with this username");
        }
    }
}

// Fetch repos data
async function getrepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created');
        createreposcard(data); // Pass the fetched repos to the card
    } catch (err) {
        createErrorCard("No repos found");
    }
}

// Create user card
function createusercard(user) {
    const cardHTML = `        
    <div class="card">
        <div>
            <img class="image" src="${user.avatar_url}" alt="${user.name}">
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>
            <ul>
                <li>${user.followers}<strong> Followers</strong></li>
                <li>${user.following}<strong> Following</strong></li>
                <li>${user.public_repos}<strong> Repositories</strong></li>
            </ul>
            <div id="repos"></div>
        </div>
    </div>`;

    main.innerHTML = cardHTML; // Display user info
}

// Create repos card
function createreposcard(repos) {
    const reposEl = document.getElementById("repos");
    repos.forEach(repo => {
        const repoLink = document.createElement("a");
        repoLink.classList.add("repos");
        repoLink.href = repo.html_url;
        repoLink.target = "_blank";
        repoLink.innerText = repo.name;

        reposEl.appendChild(repoLink); // Append repo link to repos element
    });
}

// Handle errors by creating an error card
function createErrorCard(msg) {
    const cardHTML = `        
    <div class="card">
        <h1>${msg}</h1>
    </div>`;

    main.innerHTML = cardHTML;
}


form.addEventListener("submit", (e) => {
    e.preventDefault()
    const user = search.value
    if (user) {
        getuser(user)
        search.value = ""
    }
})

