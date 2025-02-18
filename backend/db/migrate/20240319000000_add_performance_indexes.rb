class AddPerformanceIndexes < ActiveRecord::Migration[7.1]
  def change
    # Indici per games
    add_index :games, :user_id, if_not_exists: true
    add_index :games, [:user_id, :created_at], if_not_exists: true
    
    # Indici per users
    add_index :users, :email, unique: true, if_not_exists: true
    add_index :users, :created_at, if_not_exists: true
    add_index :users, :jti, unique: true, if_not_exists: true  # Per JWT authentication
  end
end 