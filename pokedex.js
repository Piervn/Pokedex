const colours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const requestLog = (log) => {
  const div = document.createElement("div");
  div.classList.add("request-status__item");
  div.innerText = log;
  return div;
};

const getData = async () => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  document.querySelector(
    "#request-status"
  ).innerHTML = `<div class="request-status__item">GET Pokemon list: ${response.status}</div>`;
  const data = await response.json();

  document.querySelector("#pokemon-list").innerHTML = data.results
    .map((pokemon) => {
      return `<button class="pokemon-list__item">${pokemon.name}</button>`;
    })
    .join("");
};

const showPokemon = async (colors) => {
  const pokemonList = document.querySelectorAll(".pokemon-list__item");
  pokemonList.forEach((pokemon) => {
    pokemon.addEventListener("click", () => {
      previewPokemon(pokemon.innerHTML, colors);
    });
  });
};

const previewPokemon = async (pokemon) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  document.querySelector(
    "#request-status"
  ).innerHTML = `<div class="request-status__item">GET Pokemon details: ${response.status}</div>`;
  const data = await response.json();

  const response2 = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  document
    .querySelector("#request-status")
    .append(requestLog("GET Pokemon species: " + response2.status));
  const species = await response2.json();

  document.querySelector("#pokemon-preview").innerHTML = `
        <div class="pokemon-preview__image">
            <img src="${data.sprites.front_default}" alt="${data.name}">
        </div>
        <h3 class="pokemon-preview__name">${data.name}</h3>
        <div class="pokemon-preview__types">
            ${data.types
              .map((type) => {
                return `<div class="pokemon-preview__type">${type.type.name}</div>`;
              })
              .join(" ")}
        </div>
        <div class="pokemon-preview__description">
            ${species.flavor_text_entries[0].flavor_text}
        </div>
    `;
  document.querySelector("#pokemon-preview").style.visibility = "visible";
  const pokemonTypes = document.querySelectorAll(".pokemon-preview__type");
  pokemonTypes.forEach((type) => {
    type.style.backgroundColor = colours[type.innerHTML];
  });
};

(async function () {
  await getData();
  showPokemon();
})();
