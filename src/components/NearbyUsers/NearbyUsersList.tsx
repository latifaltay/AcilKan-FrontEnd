import React from 'react';
import { MessageSquare, User } from 'lucide-react';

interface NearbyUser {
  id: number;
  name: string;
  bloodType: string;
  location: string;
  distance: string;
  lastActive: string;
}

interface Props {
  users: NearbyUser[];
  onMessageUser: (userId: number) => void;
  onViewProfile: (userId: number) => void;
}

export function NearbyUsersList({ users, onMessageUser, onViewProfile }: Props) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div 
          key={user.id} 
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-medium">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white">
                {user.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.bloodType} • {user.distance}
              </span>
              <span className="text-xs text-gray-500">
                Son aktif: {user.lastActive}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onMessageUser(user.id)}
              className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              title="Mesaj Gönder"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              onClick={() => onViewProfile(user.id)}
              className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              title="Profili Görüntüle"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}