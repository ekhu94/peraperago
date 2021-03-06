class CardsController < ApplicationController

    def index
        cards = Card.all
        render json: cards
    end

    def show
        card = Card.find_by(id: params[:id])
        render json: card
    end

    def create
        card = Card.create(card_params)
        render json: card
    end

    def update
        card = Card.find_by(id: params[:id])
        card.update(card_params)
        render json: card
    end

    def destroy
        card = Card.find_by(id: params[:id])
        card.destroy
        render json: card
    end

    private

    def card_params
        params.require(:card).permit(:a_side, :b_side, :new, :deck_id, :study_date, :study_lang)
    end

end
