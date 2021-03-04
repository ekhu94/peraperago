class UserSerializer < ActiveModel::Serializer
  attributes :id, :username
  has_many :cards
  has_many :decks, through: :cards
end
