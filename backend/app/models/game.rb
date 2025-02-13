class Game < ApplicationRecord
  belongs_to :user
  
  validates :name, presence: true
  validates :width, :height, presence: true, 
            numericality: { greater_than_or_equal_to: 10, less_than_or_equal_to: 100 }
  validates :speed, presence: true, 
            numericality: { 
              greater_than_or_equal_to: 100, 
              less_than_or_equal_to: 1000 
            }

  attribute :initial_state, :jsonb
end 