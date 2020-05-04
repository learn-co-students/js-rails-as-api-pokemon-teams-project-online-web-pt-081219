class TrainersController < ApplicationController

  def index 
    trainers = Trainer.all
    render json: trainers.to_json(:include => {:pokemons => {:except => [:created_at, :updated_at]}} , :only => [ :id, :name ])
  end 

end
