import React, { useEffect, useState } from 'react';
import { Bell, Moon, Volume2, Shield, Lock, User, Globe, Palette, Camera, Mail, Edit2, Check, X } from 'lucide-react';
import { useRef } from 'react';
import CustomSelect from './CustomSelect';
import CustomButton from './CustomButton';
import CustomToggle from './CustomToggle';

const Card = ({ children, className = '' }) => (
    <div className={`rounded-xl shadow-sm border-4 border-gray-200 overflow-hidden ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">
        {children}
    </div>
);

const CardTitle = ({ children }) => (
    <h2 className="text-lg font-semibold ">
        {children}
    </h2>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);


const Settingsmain = () => {
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        soundEnabled: true,
        privacyMode: false,
        onlineStatus: 'online',
        language: 'english'
    });

    const [profile, setProfile] = useState({
        name: localStorage.getItem("Fullname"),
        username: localStorage.getItem("Username"),
        email: localStorage.getItem("Email"),
        bio: 'Software developer & tech enthusiast',
        avatar: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleToggle = (setting) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleSelect = (setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handleProfileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // console.log(reader.result)
                setProfile({ avatar: reader.result });
                setAvatar(reader.result)
            };
            // console.log(reader.result)
            reader.readAsDataURL(file);
        }
        // console.log(profile)
        const setAvatar=async (avatarNew)=>{
            // console.log(avatarNew)
            const setAvatar = await fetch("http://localhost:9000/api/setAvatar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": localStorage.getItem("Email"),
                    avatarnew: avatarNew
                })
            })
            // const a = await setAvatar.json()
            // console.log(a) 
        }
        setTimeout(()=>{
            setprofile()
        },500)
    };
    const handleCameraClick = () => {
        fileInputRef.current.click();
    };
    const fileInputRef = useRef(null);
    const setprofile = async () => {
        const getavatar = await fetch("http://localhost:9000/api/getAvatar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "email": localStorage.getItem("Email") })
        })
        const data = await getavatar.json()
        setProfile({
            name: localStorage.getItem("Fullname"),
            username: localStorage.getItem("Username"),
            email: localStorage.getItem("Email"),
            bio: 'Software developer & tech enthusiast',
            avatar: data[0].avatar
        });
    }
    useEffect(() => {
        setprofile()
    }, [])

    return (
        <div className="h-screen w-full flex flex-col text-white bg-gray-800 ">
            <div className='flex-none px-6 py-4 border-b'>
                <h1 className="text-3xl font-bold mb-3">Settings</h1>
            </div>

            {/* Profile Section */}
            <div className='flex-1 overflow-auto scrollbar-hide w-full'>
                <div className='p-6  w-full flex flex-col gap-2 bg-gray-800'>
                    <Card className='w-full' >
                        <CardHeader >
                            <CardTitle >
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Profile
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative" >
                                    <img
                                        src={profile.avatar || ""}
                                        alt=""
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                                    />
                                    <CustomButton
                                        variant="default"
                                        size="sm"
                                        onClick={() => { }}
                                        className="absolute bottom-0 right-0 rounded-full p-2"
                                    >
                                        <Camera className="w-4 h-4" onClick={handleCameraClick} />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleProfileChange}
                                        />

                                    </CustomButton>
                                </div>

                                {isEditing ? (
                                    <div className="w-full space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => handleProfileChange('phone', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Bio</label>
                                            <textarea
                                                value={profile.bio}
                                                onChange={(e) => handleProfileChange('bio', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 transition-colors duration-200"
                                                rows="3"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <CustomButton
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </CustomButton>
                                            <CustomButton
                                                onClick={() => setIsEditing(false)}
                                            >
                                                <Check className="w-4 h-4" />
                                                Save Changes
                                            </CustomButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-semibold">Username: {profile.username}</h3>
                                            <CustomButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Profile
                                            </CustomButton>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span>Name: {profile.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <span>{profile.email}</span>
                                            </div>
                                            <p className="text-gray-400 mt-2">About: {profile.bio}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appearance Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center gap-2">
                                    <Palette className="w-5 h-5" />
                                    Appearance
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CustomToggle
                                isActive={settings.darkMode}
                                onToggle={() => handleToggle('darkMode')}
                            >
                                <div className="flex items-center gap-2">
                                    <Moon className="w-5 h-5" />
                                    <span>Dark Mode</span>
                                </div>
                            </CustomToggle>
                        </CardContent>
                    </Card>

                    {/* Notifications Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    Notifications
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CustomToggle
                                isActive={settings.notifications}
                                onToggle={() => handleToggle('notifications')}
                            >
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    <span>Enable Notifications</span>
                                </div>
                            </CustomToggle>
                            <CustomToggle
                                isActive={settings.soundEnabled}
                                onToggle={() => handleToggle('soundEnabled')}
                            >
                                <div className="flex items-center gap-2">
                                    <Volume2 className="w-5 h-5" />
                                    <span>Sound Effects</span>
                                </div>
                            </CustomToggle>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Privacy & Security
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CustomToggle
                                isActive={settings.privacyMode}
                                onToggle={() => handleToggle('privacyMode')}
                            >
                                <div className="flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    <span>Privacy Mode</span>
                                </div>
                            </CustomToggle>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span>Online Status</span>
                                </div>
                                <CustomSelect
                                    value={settings.onlineStatus}
                                    onChange={(e) => handleSelect('onlineStatus', e.target.value)}
                                    options={[
                                        { value: 'online', label: 'Online' },
                                        { value: 'away', label: 'Away' },
                                        { value: 'busy', label: 'Busy' },
                                        { value: 'invisible', label: 'Invisible' }
                                    ]}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language & Region */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    Language & Region
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    <span>Language</span>
                                </div>
                                <CustomSelect
                                    value={settings.language}
                                    onChange={(e) => handleSelect('language', e.target.value)}
                                    options={[
                                        { value: 'english', label: 'English' },
                                        { value: 'spanish', label: 'Spanish' },
                                        { value: 'french', label: 'French' },
                                        { value: 'german', label: 'German' },
                                        { value: 'chinese', label: 'Chinese' }
                                    ]}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default Settingsmain;