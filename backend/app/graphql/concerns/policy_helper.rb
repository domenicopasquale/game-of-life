module PolicyHelper
  extend ActiveSupport::Concern

  def authorize!(record, action)
    policy = policy_for(record)
    unless policy.public_send("#{action}?")
      raise GraphQL::ExecutionError, "Not authorized to #{action} this #{record.class.name.downcase}"
    end
  end

  def policy_for(record)
    policy_class = "#{record.class}Policy".constantize
    policy_class.new(context[:current_user], record)
  end
end 