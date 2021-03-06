class CreateCards < ActiveRecord::Migration[6.1]
  def change
    create_table :cards do |t|
      t.string :a_side
      t.string :b_side
      t.boolean :new
      t.datetime :study_date
      t.boolean :japanese
      t.references :deck, null: false, foreign_key: true

      t.timestamps
    end
  end
end
