(function() {
	"use strict";

	const fetchOption = {
		headers: {
			"Content-Type": "application/json"
		}, 
		mode: "cors"
	}

	const flatten = (a, b) => [...a,...b];

	// Submitting two pokemon types
	document.getElementsByTagName("form")[0].addEventListener("submit", function(event) {
		event.preventDefault();

		// Remove spaces from the user input and output as an array
		let types = document.getElementById("poke-types").value.replace(/\s/g, "").split(",");
		
		// Map over pokemon types of the array 
		let trainerTypeCalls = types.map(element => {

			// Fetch based on the element(pokemon type) name and return an array of promosies 
			return fetch(`https://pokeapi.co/api/v2/type/${element}/`, fetchOption);
		});
		
		getPromiseData(trainerTypeCalls)

			// Get the two pokemon type obejcts
			.then(result => {
				getDoubleDamagePokemon(result);
			});
	});

	// Pass array of fetch calls 
	function getPromiseData(promisesArray) {

		// Use a new promise 
		return new Promise((resolve, reject) => {

			// Wait for array of fetch calls to be resolved 
			Promise.all(promisesArray)
				.then(results => {

					// Get the json objects
					return results.map(type => type.json());
				})

				// Callback
				.then(response => {
					Promise.all(response)
						.then(resolve);
				})
				.catch(reject);
		});
	}

	// Pass the two pokemon type objects
	function getDoubleDamagePokemon(pokemonTypes) {
		pokemonTypes = pokemonTypes

			// Get the array of double damage pokemons
			.map(types => {
				return types.damage_relations.double_damage_from
			})

			// Single array of objects
			.reduce(flatten, [])

			// Get specific pokemons
			.map(type => {
				return fetch(type.url, fetchOption)
			});

		getPromiseData(pokemonTypes)
			.then(results => {
				buildTeam(results);
			});
	}

	// Build a list of ten double damage pokemons
	function buildTeam(pokemons) {
		let team = [];

		// Iterate over each element 
		pokemons = pokemons.map(pokemon => {
			return pokemon.pokemon;
		})

		// Single array of objects
		.reduce(flatten, [])
		.map(pokemon => pokemon.pokemon);

		for (let i = 0; i < 10; i++) {
			team.push(getRandomPokemon(pokemons));
		}

		team = team.map(pokemon => {
			return fetch(pokemon.url, fetchOption);
		});

		getPromiseData(team)
			.then(pokemonData => {
				displayPokemon(pokemonData);
			});
	}

	// Generate random list of pokemons
	function getRandomPokemon(pokemonArray) {
		return pokemonArray[Math.floor(Math.random() * pokemonArray.length)];

	}

	// Display results on the page
	function displayPokemon(pokemon) {
		pokemon.forEach(poke => {

			// Create div elements
			var $container = $("<div>").addClass("pokemon");

			// Pokemon images in terms of their id
			var $image = $("<img>").attr("src", `https://pokeapi.co/media/img/${poke.id}.png`);
			
			// Pokemon names
			var $title = $("<h2>").text(poke.name);
			
			$container.append($image, $title);
			$(".poke-container").append($container);
		});
	}
})();


// Plain JS not working!

// function displayPokemon(pokemon) {
// 	pokemon.forEach(poke => {
// 	var container = document.createElement("div");
// 	container.className += "pokemon";
// 	console.log(container);

// 	console.log(poke.id);
// 	var pokemonImage = document.createElement("img");
// pokemonImage.setAttribute("src", `http://pokeapi.co/media/img/${poke.id}.png`);
// console.log(pokemonImage);

// var title = document.createElement("h2").createTextNode(poke.name);
// console.log(title);

// container.appendChild(pokemonImage);
// document.getElementsByClassName("poke-container")[0].appendChild(container);

// 	});
// }











