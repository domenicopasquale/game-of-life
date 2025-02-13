module GraphqlAuthenticatable
  extend ActiveSupport::Concern

  private

  def current_user_from_token
    header = request.headers['Authorization']
    return nil if header.blank?

    token = header.split(' ').last
    return nil if token.blank?

    begin
      decoded = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key)[0]
      User.find(decoded['id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      nil
    end
  end
end 