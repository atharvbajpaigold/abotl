import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TeacherSignup = () => {
  const [subjects, setSelectedSubjects] = useState([]);
  const [userData, setUserData] = useState({ username: '', email: '', password: '', profilePicture: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
    const id = user?._id || user?.id || null;
    if (role === 'student' && id) navigate(`/student/page/${id}`, { replace: true });
    if (role === 'teacher' && id) navigate(`/teacher/page/${id}`, { replace: true });
  }, [navigate]);
  const allSubjects = [
  // Mathematics
  'Algebra', 'Geometry', 'Calculus', 'Trigonometry', 'Statistics', 
  'Probability', 'Discrete Mathematics', 'Linear Algebra', 
  'Number Theory', 'Mathematical Logic',

  // Sciences
  'Physics', 'Chemistry', 'Biology', 'Astronomy', 'Earth Science',
  'Environmental Science', 'Biochemistry', 'Microbiology',
  'Genetics', 'Ecology',

  // Computer Science & Programming
  'Programming', 'Web Development', 'Python', 'JavaScript',
  'Java', 'C++', 'Data Structures', 'Algorithms', 'Machine Learning',
  'Artificial Intelligence', 'Cybersecurity', 'Database Management',
  'Mobile App Development', 'Game Development', 'Blockchain',

  // Languages
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin',
  'Arabic', 'Latin', 'Public Speaking', 'Creative Writing',

  // Humanities
  'History', 'World History', 'Ancient History', 'Modern History',
  'Geography', 'Political Science', 'Sociology', 'Psychology',
  'Philosophy', 'Economics', 'Macroeconomics', 'Microeconomics',
  'Business Studies', 'Entrepreneurship',

  // Arts
  'Music Theory', 'Piano', 'Guitar', 'Violin', 'Singing',
  'Digital Art', 'Drawing', 'Painting', 'Sculpture', 'Photography',
  'Graphic Design', 'Animation', 'Film Making',

  // Engineering & Technical
  'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Computer Engineering', 'Robotics',
  'AutoCAD', '3D Modeling', 'Architecture',

  // Health & Fitness
  'Anatomy', 'Physiology', 'Nutrition', 'Yoga', 'Meditation',
  'Physical Fitness', 'Sports Coaching', 'First Aid',

  // Professional Skills
  'Accounting', 'Financial Management', 'Marketing', 'Digital Marketing',
  'Project Management', 'Leadership', 'Communication Skills',
  'Time Management', 'Excel', 'PowerPoint', 'Resume Writing',

  // Test Prep & Competitive Exams
  'SAT Prep', 'ACT Prep', 'GRE Prep', 'GMAT Prep', 'IELTS',
  'TOEFL', 'JEE Prep', 'NEET Prep', 'UPSC Prep', 'Civil Services',

  // School Subjects (K-12)
  'Mathematics (K-12)', 'Science (K-12)', 'Social Studies',
  'English Language Arts', 'Physical Education',

  // Vocational & Trades
  'Carpentry', 'Plumbing', 'Electrical Work', 'Welding',
  'Automotive Repair', 'Cooking', 'Baking', 'Sewing',

  // Others
  'Philosophy', 'Ethics', 'Logic', 'Critical Thinking',
  'Study Skills', 'Homework Help', 'Career Counseling'
  ];


  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async (e) => {
          e.preventDefault();
          try {
              const payload = new FormData();
              payload.append('username', userData.username);
              payload.append('email', userData.email);
              payload.append('password', userData.password);
              payload.append('subjects', JSON.stringify(subjects));
              if (userData.profilePicture) payload.append('profilePicture', userData.profilePicture);
              const res = await axios.post('https://backend-six-pi-62.vercel.app/api/auth/teacher/register', payload, { withCredentials: true });
              const user = res.data?.userData || res.data?.useData;
              if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('role', 'teacher');
              }
            navigate(`/teacher/page/${res.data.message}`);
            //toast.success(res.data?.message || JSON.stringify(res.data) || 'Account created successfully');
          } catch (err) {
            console.error('Teacher signup error:', err);
            toast.error(err.response?.data?.error || err.response?.data?.message || err.message || "Signup failed — possible causes: email already registered, validation error, or server/network issue");
          }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Join as Teacher
          </h1>
          <p className="text-gray-600">Start teaching and earn money</p>
        </div>
        <form className="space-y-6" onSubmit={(e)=>handleSubmit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              placeholder="John Doe" 
              value={userData.username}
              onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              placeholder="your@email.com" 
              value={userData.email}
              onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              placeholder="••••••••" 
              value={userData.password}
              onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUserData(prev => ({ ...prev, profilePicture: e.target.files[0] || null }))}
              className="w-full border border-gray-300 rounded-xl m-2 p-2 gap-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Expertise (Select all that apply)</label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl">
              {allSubjects.map((subject) => (
                <label key={subject} className="flex items-center p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={subjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700 select-none">{subject}</span>
                </label>
              ))}
            </div>
            {subjects.length > 0 && (
              <p className="text-xs text-emerald-600 mt-2">
                {subjects.length} subject{subjects.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:from-orange-600 hover:to-yellow-700 transition-all duration-200 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Start Teaching'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <Link to="/teacher/login" className="text-emerald-600 font-semibold ml-1 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignup;
