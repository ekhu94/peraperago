class Deck < ApplicationRecord
    has_many :cards, dependent: :destroy
    has_many :users, through: :cards
    validates :title, presence: true
end
