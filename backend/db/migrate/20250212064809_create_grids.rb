class CreateGrids < ActiveRecord::Migration[7.1]
  def change
    create_table :grids do |t|
      t.json :cells
      t.integer :width
      t.integer :height
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
