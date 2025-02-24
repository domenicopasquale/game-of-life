# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # In development accepts localhost, in production uses FRONTEND_URL
    origins ENV['FRONTEND_URL'] || 'http://localhost:5173'
    
    resource '/graphql',
      headers: :any,
      methods: [:post, :options],
      credentials: true,
      expose: ['Authorization', 'access-token', 'token-type'],
      max_age: 3600
  end
end
