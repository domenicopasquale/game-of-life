class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :grids

  def generate_jwt
    JWT.encode(
      { 
        id: id,
        exp: 60.days.from_now.to_i 
      },
      Rails.application.credentials.devise_jwt_secret_key
    )
  end
end
