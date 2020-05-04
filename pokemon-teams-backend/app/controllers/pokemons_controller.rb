class PokemonsController < ApplicationController

  def create
    name = Faker::Name.first_name
    species = Faker::Games::Pokemon.name
    pokemon = Pokemon.new(nickname: name, species: species, trainer_id: params[:trainer_id])
    pokemon.save 
    render json: pokemon.to_json(:except => [:created_at, :updated_at])
  end 

  def destroy
    pokemon = Pokemon.find(params[:id])
    pokemon.destroy
  end 

end
