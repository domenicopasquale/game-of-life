module Cacheable
  extend ActiveSupport::Concern

  class_methods do
    def cache_key(*args)
      args.map(&:to_s).join('/')
    end

    def cached(key, expires_in: 1.hour)
      Rails.cache.fetch(key, expires_in: expires_in) do
        yield
      end
    end
  end

  def invalidate_cache(*keys)
    keys.each { |key| Rails.cache.delete(key) }
  end
end 