import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// ========== Icons ==========
const PencilIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 5.232z" />
    </svg>
);

const CameraIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
);

const EyeSlashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.94 5.94 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.288.822.822.083.083.083.083a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
        <path fillRule="evenodd" d="M13.646 14.354l-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
);


// ========== InfoField ==========
const InfoField = ({ label, value, onChange, readOnly = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <div className="w-full">
            <label className="text-sm font-medium text-gray-500 mb-1 block">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    readOnly={readOnly || !isEditing}
                    className={`w-full bg-[#FEFBEA] text-gray-700 p-3 rounded-2xl shadow-sm transition-all duration-200 border-2 ${isEditing && !readOnly ? 'border-gray-400' : 'border-transparent'}`}
                />
                {!readOnly && (
                    <button onClick={() => setIsEditing(!isEditing)} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

// ========== Book Card ==========
const CompletedBookCard = ({ book }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out flex items-center gap-4">
        <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded-md flex-shrink-0" />
        <div className="flex-grow">
            <h3 className="font-bold text-gray-800">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author}</p>
            <p className="text-sm font-semibold text-green-600 mt-1">{book.completionPercentage}% Completed</p>
        </div>
    </div>
);

// ========== Main Component ==========
export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [userProfile, setUserProfile] = useState(null);
    const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState([]);
    
    // States for editable fields
    const [username, setUsername] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [age, setAge] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [level, setLevel] = useState('');
    const [interest, setInterest] = useState('');
    
    // States for password change form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const userToken = localStorage.getItem("userToken");
    const fileInputRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("https://boookify.runasp.net/api/Profile/me", {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                const data = res.data;
                setUserProfile(data.userProfile);
                setCurrentlyReadingBooks(data.currentlyReadingBooks);
                
                setUsername(data.userProfile.username);
                setProfilePictureUrl(data.userProfile.profilePictureFullUrl);
                setAge(data.userProfile.age.toString());
                setSpecialization(data.userProfile.specialization);
                setLevel(data.userProfile.level);
                setInterest(data.userProfile.interest);
            } catch (err) {
                console.error("Error fetching profile:", err);
                // alert("فشل تحميل البيانات. تأكد من تسجيل الدخول.");
            } finally {
                setLoading(false);
            }
        }
        if (userToken) {
           fetchData();
        } else {
            setLoading(false);
        }
    }, [userToken]);

    const EditableSelectField = ({ label, value, onChange, options = [] }) => {
        const [isEditing, setIsEditing] = useState(false);
        return (
            <div className="w-full">
                <label className="text-sm font-medium text-gray-500 mb-1 block">{label}</label>
                <div className="relative">
                    {isEditing ? (
                        <select
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-[#FEFBEA] text-gray-700 p-3 rounded-2xl shadow-sm transition-all duration-200 border-2 border-gray-400 focus:outline-none appearance-none pr-12"
                        >
                            <option value="" disabled>Select {label.toLowerCase()}</option>
                            {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                    ) : (
                        <input type="text" value={value} readOnly className="w-full bg-[#FEFBEA] text-gray-700 p-3 rounded-2xl shadow-sm transition-all duration-200 border-2 border-transparent pr-12" />
                    )}
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
                        <i className="bi bi-caret-down-fill text-gray-400 text-sm"></i>
                        <button onClick={() => setIsEditing(!isEditing)} type="button" className={`${isEditing ? "text-black" : "text-gray-400"} hover:text-gray-700`}>
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put("https://boookify.runasp.net/api/Profile/me", {
                username,
                profilePictureFullUrl: profilePictureUrl,
                age: parseInt(age),
                specialization,
                level,
                interest
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            alert("تم حفظ التغييرات بنجاح");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmNewPassword) {
            alert("كلمة المرور الجديدة غير متطابقة");
            return;
        }

        try {
            await axios.post("https://boookify.runasp.net/api/Auth/change-password", {
                currentPassword,
                newPassword,
                confirmNewPassword
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            alert("تم تغيير كلمة المرور بنجاح");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error("Error changing password:", error);
            alert("فشل تغيير كلمة المرور. تأكد من صحة البيانات.");
        }
    };

    const handleImageEdit = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingImage(true);
        try {
            const res = await axios.post("https://boookify.runasp.net/api/Profile/me/picture", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userToken}`,
                },
            });
            const newUrl = res.data.profilePictureFullUrl; 
            setProfilePictureUrl(newUrl);
            alert("تم تحديث الصورة الشخصية بنجاح!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("فشل رفع الصورة.");
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) return <div className="text-center mt-10 text-gray-600">جارٍ تحميل البيانات...</div>;

    return (
        <div className="bg-white min-h-screen font-sans mt-20">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            
            {/* Top Banner Section */}
            <div className="bg-[#F6F4DF] pb-24 pt-8 px-4 sm:px-8 ">
                <div className="max-w-4xl mx-auto">
                    {/* The h1 title has been moved */}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto -mt-20 px-4 sm:px-8">
                <div className="relative mb-12 mt-4 bg-white p-8 rounded-2xl shadow-lg">
                    
                    {/* Profile Picture */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div className="relative w-24 h-24">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
                                {uploadingImage ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
                                    </div>
                                ) : profilePictureUrl ? (
                                    <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <CameraIcon className="w-10 h-10 text-gray-400" />
                                )}
                            </div>
                            <button onClick={handleImageEdit} className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-black transition-colors" aria-label="Edit profile picture">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Profile Information Section */}
                    <div className="pt-10 flex flex-col items-center">
                        {/* Username - Moved to be under the picture */}
                        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{username || 'User Profile'}</h1>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                            <div className="space-y-6">
                                <InfoField label="Name" value={username} onChange={setUsername} />
                                <InfoField label="Age" value={age} onChange={setAge} />
                                <InfoField label="Email" value={userProfile?.email || ''} onChange={() => {}} readOnly />
                            </div>
                            <div className="space-y-6">
                                <EditableSelectField label="Specialization" value={specialization} onChange={setSpecialization} options={[{ value: 'medical', label: 'Medical' }, { value: 'law', label: 'Law' }, { value: 'history', label: 'History' }, { value: 'economics & finance', label: 'Economics & Finance' }, { value: 'psychology', label: 'Psychology' }, { value: 'computer science', label: 'Computer Science' }]} />
                                <EditableSelectField label="Level" value={level} onChange={setLevel} options={[{ value: 'beginner', label: 'Junior' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }]} />
                                <InfoField label="Interest" value={interest} onChange={setInterest} />
                            </div>
                        </div>
                        <button onClick={handleSave} disabled={saving} className="mt-8 bg-[#8B3302] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#722801] transition disabled:bg-gray-400">
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="mt-6 text-sm text-[#8B3302] hover:underline focus:outline-none">
                            {showPasswordForm ? "Hide Change Password" : "Show Change Password"}
                        </button>
                        <div className={`transition-all duration-500 overflow-hidden ${showPasswordForm ? "w-full opacity-100 mt-8 p-2" : "max-h-0 opacity-0"}`}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="relative">
                                    <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="p-3 pr-10 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#8B3302]" />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                                        {showCurrent ? <EyeIcon /> : <EyeSlashIcon />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="p-3 pr-10 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#8B3302]" />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                                        {showNew ? <EyeIcon /> : <EyeSlashIcon />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input type={showConfirm ? "text" : "password"} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm New Password" className="p-3 pr-10 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#8B3302]" />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                                        {showConfirm ? <EyeIcon /> : <EyeSlashIcon />}
                                    </button>
                                </div>
                            </div>
                            <button onClick={handlePasswordChange} className="mt-6 bg-[#8B3302] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#722801] transition">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-700 mb-4">Currently Reading</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                    {currentlyReadingBooks.map((book) => (
                        <CompletedBookCard key={book.bookID} book={{ ...book, coverUrl: book.coverImageUrl.replace(/\\/g, "/") }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
