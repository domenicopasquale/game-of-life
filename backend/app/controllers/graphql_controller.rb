# frozen_string_literal: true

class GraphqlController < ActionController::API
  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks,
  # but you'll have to authenticate your user separately
  def execute
    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      current_user: current_user_from_token,
    }
    
    Rails.logger.info("GraphQL Query: #{query}")
    Rails.logger.info("GraphQL Variables: #{variables}")
    
    result = BackendSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    render json: result
  rescue StandardError => e
    Rails.logger.error("GraphQL Error: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    render json: { errors: [{ message: e.message }] }, status: 500
  end

  private

  def current_user_from_token
    header = request.headers['Authorization']
    return nil if header.blank?

    token = header.split(' ').last
    return nil if token.blank?

    begin
      decoded = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key)[0]
      User.find(decoded['id'])
    rescue JWT::DecodeError
      nil
    end
  end

  # Handle variables in form data, JSON body, or a blank value
  def prepare_variables(variables_param)
    case variables_param
    when String
      if variables_param.present?
        JSON.parse(variables_param)
      else
        {}
      end
    when Hash, ActionController::Parameters
      variables_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { errors: [{ message: e.message, backtrace: e.backtrace }], data: {} }, status: 500
  end
end
