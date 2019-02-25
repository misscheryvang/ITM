const app = angular.module("Candidate.App", []);

app.component("itmRoot", {
    controller: class {
        constructor() {
            this.candidates = [{ name: "Puppies", votes: 10 }, { name: "Kittens", votes: 12 }, { name: "Gerbils", votes: 7 }];
        }

        onVote(candidate) {
            console.log(`Vote for ${candidate.name}`);
            candidate.votes++;
        }

        onAddCandidate(candidate) {
            console.log(`Added candidate ${candidate.name}`); 
            this.candidates.push(angular.copy(candidate));
            console.log(this.candidates);
        }

        onRemoveCandidate(candidate) {
            console.log(`Removed candidate ${candidate.name}`);

            this.candidates = this.candidates.filter( nominee => nominee.name !== candidate.name );
            console.log(this.candidates);
              
        }
    },
    template: `
        <h1>Which candidate brings the most joy?</h1>
             
        <itm-results 
            candidates="$ctrl.candidates">
        </itm-results>

        <itm-vote 
            candidates="$ctrl.candidates"
            on-vote="$ctrl.onVote($candidate)">
        </itm-vote>

        <itm-management 
            candidates="$ctrl.candidates"
            on-add="$ctrl.onAddCandidate($candidate)"
            on-remove="$ctrl.onRemoveCandidate($candidate)">
        </itm-management>
    `
});

app.component("itmManagement", {
    bindings: {
        candidates: "<",
        onAdd: "&",
        onRemove: "&"
    },
    controller: class {
        constructor() {
            this.newCandidate = {
                name: "",
                votes: 0
            };
        }

        submitCandidate(candidate) {
                this.onAdd({ $candidate: candidate });
        }

        removeCandidate(candidate) {
            this.onRemove({ $candidate: candidate });
        }
        //Wanted to add a function here to check if candidate already exist by looping through the array but wasn't sure how to connect to ng-show in the template.
    },
    template: `
        <h2>Manage Candidates</h2>

        <h3>Add New Candidate</h3>
        <form name="form" ng-submit="$ctrl.submitCandidate($ctrl.newCandidate)" novalidate>

            <label>Candidate Name</label>
            <input type="text" name="candidateName" ng-model="$ctrl.newCandidate.name" ng-required="true" />
            <button type="submit" ng-disabled="form.candidateName.$invalid" class="btn btn-primary btn-med">Add</button>
            <br />
            <span ng-show="">Candidate already in the running!</span>

        </form>

        <h3>Remove Candidate</h3>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates">
                <span ng-bind="candidate.name"></span>
                <button type="button" ng-click="$ctrl.removeCandidate(candidate)"
                class="btn btn-danger btn-sm">X</button>
            </li>
        </ul>

    `
});

app.component("itmVote", {
    bindings: {
        candidates: "<",
        onVote: "&"
    },
    controller: class {},
    template: `
        <h2>Cast your vote!</h2>

        <button type="button"
            ng-repeat="candidate in $ctrl.candidates"
            ng-click="$ctrl.onVote({ $candidate: candidate })"
            class="btn btn-success btn-large">
            <span ng-bind="candidate.name"></span>
        </button>
    `
});

app.component("itmResults", {
    bindings: {
        candidates: "<"
    },
    controller: class {
        calPercentage(candidate, candidates) {
            let total = candidates.reduce((acc, numVotes) => acc + numVotes.votes, 0);
            return Math.floor((candidate/total) * 100) + "%";
        }
    },
    template: `
        <h2>Live Results</h2>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates | orderBy: '-votes'">
                <span ng-bind="candidate.name"></span>
                <strong ng-bind="candidate.votes"></strong>
                <strong ng-bind="$ctrl.calPercentage(candidate.votes, $ctrl.candidates)"></strong>
            </li>
        </ul>
    `
});


