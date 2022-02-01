
var issueContainerEl = document.querySelector("#issues-container");

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
            });
        } else {
            alert("There was a problem with your request!");
        }
    });
};

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

// run an instance of function getRepoIssues for
// user facebook's repository react
getRepoIssues("jcomp-03/module-5-taskmaster-pro");