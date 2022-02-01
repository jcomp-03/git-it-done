
var userFormEl = document.querySelector("#user-form"); // grab the DOM element with id #user-form
var nameInputEl = document.querySelector("#username"); // grab the DOM element with id #username
var repoContainerEl = document.querySelector("#repos-container"); // grab the DOM element with id #repos-container
var repoSearchTerm = document.querySelector("#repo-search-term"); // grab the DOM element with id #repo-search term
var languageButtonsEl = document.querySelector("#language-buttons"); // grab the DOM element with id #language-buttons

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    // if the language exists, run getFeaturedRepos
    if (language) {
        getFeaturedRepos(language);
        // clear out old content in the repo container
        repoContainerEl.textContent = "";
    }
}


var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert ('Error: GitHub user not found')
        }
    });
  };


var getUserRepos = function(user) {
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayRepos(data, user);
          });
        } else {
          alert("Error: GitHub User Not Found");
        }
      })
      .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });
};


var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos. If not, inform the user
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over all the repos that came back
    for (var i = 0; i < repos.length; i++) {
        // format the repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        console.log(repoName);
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append the span to the div
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
        statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
        statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append the repo div to the repo container
        repoContainerEl.appendChild(repoEl);
    }
};


var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
    } else {
    alert("Please enter a GitHub username");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);
// when the div reference in languageButtonsEl is clicked, run
// the corresponding callback function buttonClickHandler
languageButtonsEl.addEventListener("click", buttonClickHandler);
