const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const container = document.querySelector('main')

document.addEventListener('DOMContentLoaded', () => {

  fetchAndLoadTrainers()

  async function fetchAndLoadTrainers() {
    const res = await fetch(TRAINERS_URL)
    const trainersJSON = await res.json()
    trainersJSON.forEach(trainer => container.appendChild(renderTrainer(trainer)))
  }

  function renderTrainer(trainer) {
    const trainerCard = document.createElement('div')
    trainerCard.classList = "card"
    trainerCard.setAttribute('data-id', `${trainer.id}`)
    let name = document.createElement('p')
    name.innerText = trainer.name
    trainerCard.appendChild(name)
    trainerCard.appendChild(addPokeBtn(trainer.id))
    trainerCard.appendChild(pokemonList(trainer))
    return trainerCard
  }

  function addPokeBtn(id) {
    const btn = document.createElement('button')
    btn.setAttribute('data-trainer-id', `${id}`)
    btn.innerText = "Add Pokemon"
    btn.addEventListener('click', (e) => {
      addPokemon(e.target.dataset.trainerId)
    })
    return btn
  }

  function pokemonList(trainer) {
    const list = document.createElement('ul')
    trainer.pokemons.forEach(p => list.appendChild(renderPokemonLI(p)))
    return list
  }

  function renderPokemonLI(p) {
    const li = document.createElement('li')
      li.innerText = p.nickname
      const btn = document.createElement('button')
      btn.classList.add('release')
      btn.setAttribute('data-pokemon-id', `${p.id}`)
      btn.innerText = "Release"
      btn.addEventListener('click', (e) => {
        removePokemon(e.target.dataset.pokemonId)
      })
    li.appendChild(btn)
    return li
  }

  async function addPokemon(id) {
    const trainerCard = document.querySelector(`[data-id="${id}"]`)
    if (trainerCard.lastChild.childNodes.length === 6) {
      alert("Sorry! This team is full!")
    } else {
      const res = await fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({trainer_id: id})
      })
      const pokemonJSON = await res.json()
      trainerCard.lastChild.appendChild(renderPokemonLI(pokemonJSON))
    }
  }

  async function removePokemon(id) {
    const pokemonLi = document.querySelector(`[data-pokemon-id="${id}"]`).parentNode
    const res = await fetch(`${POKEMONS_URL}/${id}`, {
      method: 'DELETE'
    })
    pokemonLi.parentNode.removeChild(pokemonLi)
  }

})