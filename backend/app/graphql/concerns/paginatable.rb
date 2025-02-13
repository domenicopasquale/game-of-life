module Paginatable
  extend ActiveSupport::Concern

  private

  def paginate(relation, limit: nil, offset: nil)
    relation = relation.limit(limit) if limit.present?
    relation = relation.offset(offset) if offset.present?
    relation
  end

  def validate_pagination_args(limit: nil, offset: nil)
    errors = []
    errors << "Limit must be between 1 and 100" if limit.present? && !limit.between?(1, 100)
    errors << "Offset must be positive" if offset.present? && offset.negative?
    raise GraphQL::ExecutionError, errors.join(", ") if errors.present?
  end
end 