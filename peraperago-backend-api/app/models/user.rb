class User < ApplicationRecord
    has_many :cards
    has_many :decks, through: :cards
    has_secure_password
    validates :username, uniqueness: true
end
