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
  validate :valid_initial_state_format, if: :initial_state_changed?

  attribute :initial_state, :jsonb

  private

  def valid_initial_state_format
    return if initial_state.nil?
    
    unless initial_state.is_a?(Array) && 
           initial_state.all? { |row| row.is_a?(Array) && 
           row.all? { |cell| [true, false].include?(cell) } }
      errors.add(:initial_state, "must be a 2D array of booleans")
    end

    unless initial_state.length == height && 
           initial_state.all? { |row| row.length == width }
      errors.add(:initial_state, "dimensions must match width and height")
    end
  end
end 