const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {

  class Trainer {
    constructor(params) {
      this.id = params.id
      this.name = params.name
      this.pokemons = params.pokemons
    }

    get html() {
      return(`
        <div class="card" data-id="${this.id}"><p>${this.name}</p>
          <button id="add" data-trainer-id="${this.id}">Add Pokemon</button>
          <ul>${this.renderPokeLis()}</ul>
        </div>
      `)
    }

    renderPokeLis() {
      return this.pokemons.map (pokemon => {
        return `<li>${pokemon.nickname}<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
      }).join('')
    }

    static renderLi(p) {
      return `<li>${p.nickname}<button class="release" data-pokemon-id="${p.id}">Release</button></li>`
    }
  }

  class TrainerAdapter {

    static async fetchTrainers() {
      const res = await fetch(TRAINERS_URL)
      const json = await res.json()
      return json
    }

    static async fetchNewPokemon(trainerID) {
      const res = await fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({trainer_id: trainerID})
      })
      const json = await res.json()
      return json
    }
  }

  class PageManager {

    constructor() {
      this.container = document.querySelector('main')
      this.adapter = TrainerAdapter
      this.trainers = []
      this.fetchAndLoadTrainers()
      this.container.addEventListener("click", this.trainerActions.bind(this))
    }

    async fetchAndLoadTrainers() {
      const trainerJSON = await this.adapter.fetchTrainers()
      this.trainers = trainerJSON.map(t => new Trainer(t))
      this.render()
    }

    render(){
      this.container.innerHTML = this.trainers.map(t => t.html).join('')
    }

    async trainerActions(e) {
      if (e.target.id === "add") {
        const trainerID = e.target.dataset.trainerId
        if (e.target.parentNode.childNodes[4].childNodes.length === 6) {
          alert("Sorry! This team is full!")
        } else {
          const pokemonJSON = await this.adapter.fetchNewPokemon(trainerID)
          e.target.parentNode.childNodes[4].innerHTML += Trainer.renderLi(pokemonJSON)
        }
      } else if (e.target.classList.value === "release") {
        const pokeID = e.target.dataset.pokemonId
        const pokeLI = e.target.parentNode
        const res = await fetch(`${POKEMONS_URL}/${pokeID}`, {
          method: 'DELETE'
        })
        e.target.parentNode.parentNode.removeChild(pokeLI)
      }
    }
  }

new PageManager()
})