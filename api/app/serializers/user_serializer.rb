class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :profile, :avatar_url
end
