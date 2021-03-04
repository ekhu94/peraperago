class CardSerializer < ActiveModel::Serializer
  attributes :id, :a_side, :b_side, :new
  has_one :user
  has_one :deck
end
