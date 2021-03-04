class CardSerializer < ActiveModel::Serializer
  attributes :id, :a_side, :b_side
  has_one :user
  has_one :deck
end
