class User < ApplicationRecord
  include Rails.application.routes.url_helpers

  validates :name, presence: true, length: {maximum: 20}
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i.freeze
  validates :email, length: {maximum: 255}, format: {with: VALID_EMAIL_REGEX}, uniqueness: {case_sensitive: false}

  has_one_attached :avatar

  def avatar_url
    # if文を一行で書いている
    avatar.attached? ? url_for(avatar) : nil
  end
end
