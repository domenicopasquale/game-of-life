module ErrorHandler
  extend ActiveSupport::Concern

  def handle_error(error)
    case error
    when ActiveRecord::RecordNotFound
      GraphQL::ExecutionError.new("Resource not found")
    when ActiveRecord::RecordInvalid
      GraphQL::ExecutionError.new(error.record.errors.full_messages.join(', '))
    else
      Rails.logger.error(error.message)
      Rails.logger.error(error.backtrace.join("\n"))
      GraphQL::ExecutionError.new("Something went wrong")
    end
  end
end 