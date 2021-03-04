class DeckSerializer < ActiveModel::Serializer
  attributes :id, :title
  has_many :cards
end
