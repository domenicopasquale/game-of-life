class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.string :name, null: false
      t.integer :width, null: false
      t.integer :height, null: false
      t.integer :speed, null: false
      t.string :pattern
      t.jsonb :initial_state
      t.references :user, null: false, foreign_key: true, index: true

      t.timestamps
    end
    
    add_index :games, [:user_id, :created_at]
  end
end 