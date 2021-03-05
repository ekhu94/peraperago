class CardsController < ApplicationController

    def index
        cards = Card.all
        render json: cards
    end

    def show
        card = Card.find_by(id: params[:id])
        render json: card
    end

    def update
        card = Card.find_by(id: params[:id])
        card.update(new: params[:card][:new], study_date: DateTime.now)
        render json: card
    end

    private

    def card_params
        params.require(:card).permit(:a_side, :b_side, :new, :deck_id)
    end

end
