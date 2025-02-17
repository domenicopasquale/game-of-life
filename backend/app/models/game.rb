class Game < ApplicationRecord
  belongs_to :user
  
  validates :name, presence: true
  validates :width, presence: true, numericality: { greater_than: 0 }
  validates :height, presence: true, numericality: { greater_than: 0 }
  validates :speed, presence: true, numericality: { greater_than: 0 }
  validate :valid_initial_state_format, if: :initial_state_changed?

  attribute :initial_state, :jsonb

  before_save :ensure_initial_state_array

  private

  def valid_initial_state_format
    return if initial_state.nil?
    
    unless initial_state.is_a?(Array) && 
           initial_state.all? { |row| row.is_a?(Array) && 
           row.all? { |cell| [true, false].include?(cell) } }
      errors.add(:initial_state, "deve essere una matrice 2D di booleani")
    end

    unless initial_state.length == height && 
           initial_state.all? { |row| row.length == width }
      errors.add(:initial_state, "le dimensioni devono corrispondere a larghezza e altezza")
    end
  end

  def ensure_initial_state_array
    # Assicura che initial_state sia sempre un array anche se è nil
    self.initial_state ||= Array.new(height) { Array.new(width, false) }
    
    # Converti esplicitamente i valori in booleani
    self.initial_state = initial_state.map do |row|
      row.map { |cell| !!cell } # Doppia negazione per assicurare valori booleani
    end
  end
end 