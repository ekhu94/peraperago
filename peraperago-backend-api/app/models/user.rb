class User < ApplicationRecord
    has_many :cards
    has_many :decks, through: :cards
    validates :username, uniqueness: true
end
