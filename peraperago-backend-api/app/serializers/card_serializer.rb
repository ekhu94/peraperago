class CardSerializer < ActiveModel::Serializer
  attributes :id, :a_side, :b_side, :new, :study_date, :created_at
  has_one :deck
end
