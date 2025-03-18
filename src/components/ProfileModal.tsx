import React, { useState } from 'react';
import { UserCircle, Mail, Phone, MapPin, Pencil, X, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { EditProfileModal } from './EditProfileModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userDetails, updateUserDetails, clearUserDetails } = useUser();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen || !userDetails) return null;

  const handleSignOut = () => {
    clearUserDetails();
    logout();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary-50 rounded-full">
                <UserCircle className="h-12 w-12 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{userDetails.name}</h2>
                <p className="text-sm text-gray-500">Profile Details</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{userDetails.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{userDetails.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{userDetails.address}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Pencil className="h-5 w-5" />
                <span className="font-medium">Edit Profile</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        userDetails={userDetails}
        onSave={updateUserDetails}
      />
    </>
  );
};