class Game < ApplicationRecord
  belongs_to :user
  
  validates :name, presence: true
  validates :width, :height, presence: true, 
            numericality: { greater_than_or_equal_to: 10, less_than_or_equal_to: 50 }
  validates :speed, presence: true, inclusion: { in: [200, 500, 1000] }

  attribute :initial_state, :jsonb
end 