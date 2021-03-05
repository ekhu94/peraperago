class CardSerializer < ActiveModel::Serializer
  attributes :id, :a_side, :b_side, :new, :study_date
  has_one :deck
end
