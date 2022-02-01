
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

// use fetch API to get an individual repository's issues from GitHub API from a 
var getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
  
    fetch(apiUrl).then(function(response) {
        // request was succesful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function
                displayIssues(data);
                // check if api has paginated issues, i.e. more than 30 issues open
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }    
            });
        } else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};


// display the repository's issues to the webpage via dynamic HTML creation
var displayIssues = function(issues) {
    // if the repository selected has no issues, write that to the
    // issueContainerEl so the user knows so
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    // loop through the parameter issues, creating HTML elements
    // accordingly and displaying them in the #issues-container div
    for(var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append issue title to issue element
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        
        // append issue type to issue element
        issueEl.appendChild(typeEl);

        // append the issue element to the issue container
        issueContainerEl.appendChild(issueEl);
    }
};


var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    // create a link element which points to the repository's github issues page
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    // append the link element to warning container
    limitWarningEl.appendChild(linkEl);
};


var getRepoName = function() {
    // grab the repo name from the url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    
    // check if the repo name exists and if so, assign the
    // span's textContent to it and run function getRepoIssues
    if(repoName) {
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        // else go back to the homepage
        document.location.replace("./index.html");
    }
}

// run an instance of function getRepoName to
// retrieve info from query string
getRepoName();