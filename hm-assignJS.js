//Hide log history and DELETE button on load
window.addEventListener('load', function () {
    document.getElementById('assessment-one-container').style.display = 'none';
    document.getElementById('log').style.display = 'none';	
	
	// Get the modal, button and close element
	var modal = document.getElementById("responseModal");
	var btn = document.getElementById("surveyMonkeyLink");
	var span = document.getElementsByClassName("close")[0];

	// Display modal when user clicks link 
	btn.onclick = function() {
		modal.style.display = "block";
	}

	// close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
});

//Close modal & dropdoen list on click on document
document.addEventListener("click", function () {
    closeAllLists();
});

//Pass values as params to construct an HTML, displaying search history
function log(message, dateStamp) {

    $("<div class='result-row disp-inline-flex' id='row'>").html('<div class="message camel-case-text">' + message + '</div>' + '<div class="date-time">' + dateStamp + '</div>').prependTo("#log");

    document.getElementById('no-history-container').style.display = 'none';
    document.getElementById('log').style.display = 'block';

    //Append to each search history row
    document.getElementById('row').innerHTML += '<button name="delete" value="delete" class="delete-btn delete-row-btn">X</button>';
    $(".delete-row-btn").on("click", function (event) {
        $(this).parent().remove();
        //Check whether any rows remains, if so remove it 
        if ($('.result-row') && $('.result-row').length == 0) {
            document.getElementById('no-history-container').style.display = 'block';
            document.getElementById('log').style.display = 'none';
        }
    });
    $("#log").scrollTop(0);
}

//clear all history from view
function clearAllSearch() {
    localStorage.clear();
    document.getElementById('no-history-container').style.display = 'block';
    document.getElementById('log').style.display = 'none';
    $('.result-row').remove();
    alert("Search history cleared successfully !!");
}

//Hide show Questionnaire 3 
function showAssessmentOne() {
    $(".assessment-one-container").slideToggle(500);
}

//Call API only if entered text length is greater than 1
function getUserInput(val) {
    if (!val || val.length == 1) {
        return
    }    
    getCitiesFromAPI(val);
}

//Invoke a public API fetching liast of cities in Sweden
function getCitiesFromAPI(term) {

    //Check whether the term is already searched for from localstorage, if yes load it from cache
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        if (localStorage.key(i) == term) {
            populateList(JSON.parse(localStorage.getItem(term)));
            return;
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.myjson.com/bins/uaro7?term=" + term, true);
    xhr.onload = function () {
        //console.log(xhr.responseText);
        var data = JSON.parse(xhr.responseText);
        if (Object.keys(data).length == 0) {
            alert("Empty response !!");
        }
        else {
            //Filter the response data based on user input and narrow it down
            let matches = [] = data.filter(s => s.includes(term));
            //console.log(matches);
            //Store the result in localstorage
            localStorage.setItem(term, JSON.stringify(matches));
            populateList(matches);

        }

    };
    xhr.send();
}

//Populate list data from response/localstorage
function populateList(matches) {
    var res = '<ul>';

    //Close any already open lists 
    closeAllLists();

    //Create UL element that will contain the values
    a = document.createElement("UL");
    a.setAttribute("id", "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    //Append the UL element as a child of the container:
    document.getElementById("cities").parentNode.appendChild(a);
    for (const [index, element] of matches.entries()) {
        //Create a LIST element with current value
        b = document.createElement("LI");
        b.innerHTML = "<span>" + element + "</span>";
        b.innerHTML += "<input type='hidden' value='" + element + "'>";
        //Function to invoke action when user clicks on the item value 
        b.addEventListener("click", function (e) {
            //Insert the value for the text field
            var selectedCity = this.getElementsByTagName("input")[0].value;
            document.getElementById('cities').value = selectedCity;

            //Create timestamp
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            //Pass constructed date text and selected value
            log(selectedCity, dateTime);
            //Close the list of when user selects value   
            closeAllLists();
        });
        a.appendChild(b);

    }
}

// close all open lists in the document
function closeAllLists(element) {
    var elem = document.querySelector('.autocomplete-items');
    if (elem && elem.parentNode)
        elem.parentNode.removeChild(elem);
}

