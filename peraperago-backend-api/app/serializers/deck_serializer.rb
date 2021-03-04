class DeckSerializer < ActiveModel::Serializer
  attributes :id, :title
  has_many :cards
  has_many :users, through: :cards
end
