# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_02_12_180000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.string "name", null: false
    t.integer "width", null: false
    t.integer "height", null: false
    t.integer "speed", null: false
    t.string "pattern"
    t.jsonb "initial_state"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "generations_count", default: 0
    t.integer "max_alive_cells", default: 0
    t.integer "total_runtime", default: 0
    t.datetime "last_played_at"
    t.jsonb "history", default: []
    t.jsonb "settings", default: {"zoom"=>1.0, "pan_x"=>0, "pan_y"=>0, "theme"=>"light", "cell_color"=>"#333333"}
    t.index ["user_id", "created_at"], name: "index_games_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_games_on_user_id"
  end

  create_table "grids", force: :cascade do |t|
    t.json "cells"
    t.integer "width"
    t.integer "height"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_grids_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti"
    t.index ["created_at"], name: "index_users_on_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "games", "users"
  add_foreign_key "grids", "users"
end
