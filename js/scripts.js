let pokemonRepository = (function () {
  const pokemonList = [];
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  async function loadList() {
    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      json.results.forEach(function (item) {
        const pokemon = {
          name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          height: item.height,
          weight: item.weight,
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    } catch (e) {
      console.error(e);
    }
  }

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "height" in pokemon &&
      "weight" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }
  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let pokemonRow = document.getElementById("pokemonRow");
    let pokemonCard = document.createElement("div");
    let button = document.createElement("button");
    pokemonCard.classList.add(
      "col-lg-3",
      "col-md-4",
      "col-sm-6",
      "mb-3",
      "pokemon-card"
    );
    button.innerText = pokemon.name;
    button.classList.add("btn", "btn-primary", "w-100");
    button.setAttribute("data-target", "#modal-container");
    button.setAttribute("data-toggle", "modal");
    pokemonCard.appendChild(button);
    pokemonRow.appendChild(pokemonCard);
    button.addEventListener("click", () => {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function (item) {
      const modalContainer = document.getElementById("modal-container");
      const modalTitle = document.getElementById("pokedex-modal");
      const modalHeight = document.getElementById("modal-height");
      const modalImage = document.getElementById("modal-image");
      const modalClose = document.getElementById("modal-close");

      modalTitle.textContent = "Name: " + item.name;
      modalHeight.textContent =
        "Height: " + (item.height * 0.328084).toFixed(2) + " ft"; // Convert height to ft
      modalHeight.style.marginTop = "10px"; // Add margin top
      modalHeight.insertAdjacentHTML(
        "beforeend",
        "<br>Weight: " + (item.weight * 0.220462).toFixed(2) + " lbs"
      ); // Convert weight to lbs

      modalImage.setAttribute("src", item.imageUrl);
      modalImage.setAttribute("alt", item.name);

      modalClose.addEventListener("click", function () {
        modalContainer.style.display = "none";
      });

      modalContainer.style.display = "block";
    });
  }

  async function loadDetails(pokemon) {
    let apiUrl = pokemon.detailsUrl;
    try {
      const response = await fetch(apiUrl);
      const details = await response.json();
      // Now we add the details to the item
      pokemon.imageUrl = details.sprites.front_default;
      (pokemon.weight = details.weight), (pokemon.height = details.height);
      pokemon.types = details.types;
    } catch (e) {
      console.error(e);
    }
    return pokemon;
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

pokemonRepository.loadList().then(function () {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
