(function() {
  "use strict";

	// Initialize Firebase
	let firebaseAppName = "brodies-blog";
	let firebaseKey = "AIzaSyCyyvnwHtzeH10Sf6yOqJ99tNhjfYyROBU";

	let config = {
	  apiKey: firebaseKey,
		authDomain: `${firebaseAppName}.firebaseapp.com`,
		databaseURL: `https://${firebaseAppName}.firebaseio.com`,
		storageBucket: `${firebaseAppName}.appspot.com`,
	};
	firebase.initializeApp(config);

	let commentsListContainer = document.querySelector('.comments-list');
	let state = {
		list: {}
	};

	// Whenever a new value is received from Firebase
	firebase.database().ref('tasks/').on('value', (snapshot) => {

		// Pull the list value from firebase
		state.list = snapshot.val();

		if (!state.list) {
			state.list = {};
		}

		renderCommentsList(commentsListContainer, state);
	});

	// Clicking to add a new comment
	document.getElementById("comment-post-btn").addEventListener("click", (event) => {
		
		// Get the user comment
		let comment = document.getElementById("comment-post-text").value;

		// Remove whitespace from start and end of input
		comment = comment.trim();

		// Store the first commenting container element
		let textContainer = document.getElementsByClassName("comment-insert-container")[0];
		
		// Get the user id
		let userId = document.getElementById("userId").value;
		
		// Get the user name
		let userName = document.getElementById("userName").value;

		// Nothing entered, return early from this function
		if (!comment) {

			// Set the commenting container border to red
			textContainer.style.border = "1px solid #ff0000";
			return;

		} else {

			// Reset the commenting container border back to default
			textContainer.style.border = "1px solid #e1e1e1";

			// Write the comment into firebase 
			firebase.database().ref('tasks/').push({
	     		name: userName,
	     		title: comment,
	      	done: false 
	    	});
		}

		// Reset the comment value to none so it's ready for a new comment
		document.getElementById("comment-post-text").value = "";
	})

	function renderCommentsList(into, state) {

	 	// Iterate over each element in the object
	  into.innerHTML = Object.keys(state.list).map((key) => {
	  		return `
				<ul class="comments-holder-ul">
					<li data-id="${key}" class="comment-holder">
						<div class="user-img">
							<img src="images/photo.jpg" class="user-img-pic" />
						</div>
					<div class="comment-body">
						<h3 class="username-field">
							${state.list[key].name}						
						</h3>
					</div>
					<div class="comment-text">
						${state.list[key].title}
					</div>
					<div class="comment-buttons-holder">
						<ul>
							<li class="delete-btn">X</li>
						</ul>
					</div>
					</li>
				</ul>
			`;
		}).join("");
	}

	  // Clicking to delete a comment
	  delegate('.comments-list', 'click', '.delete-btn', (event) => {

	    let key = getKeyFromClosestElement(event.delegateTarget);

	    // Remove that particular key
	    firebase.database().ref(`tasks/${key}/`).remove();
	  });

	  // Get the comment with relevant `data-id` attribute
	  function getKeyFromClosestElement(element) {

	    // Search for the closest parent that has an attribute `data-id`, which is the div with class "comments-list"
	    var closestItemWithId = closest(event.delegateTarget, '[data-id]');

	    if (!closestItemWithId) {
	      throw new Error('Unable to find element with expected data key');
	    }

	    // Extract and return that attribute
	    return closestItemWithId.getAttribute('data-id');
	  }
})();



















