'use client';
import React from 'react';

const UserRoleSelector = ({ selectedRole, onRoleChange }) => {
    const roles = [
        { value: 'affected_individual', label: '🆘 Affected Individual', color: 'bg-red-500' },
        { value: 'volunteer', label: '🤝 Volunteer', color: 'bg-green-500' },
        { value: 'first_responder', label: '🚑 First Responder', color: 'bg-blue-500' },
    ];

    return (
        <div className="p-4 bg-gray-100 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Role:
            </label>
            <div className="grid grid-cols-3 gap-8">
                {roles.map((role) => (
                    <button
                        key={role.value}
                        onClick={() => onRoleChange(role.value)}
                        className={`p-2 rounded-lg text-white text-sm font-medium transition-all ${
                            selectedRole === role.value
                                ? `${role.color} scale-105 shadow-lg`
                                : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                    >
                        {role.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserRoleSelector;
