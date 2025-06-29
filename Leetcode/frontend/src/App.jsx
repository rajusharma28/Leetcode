import {Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import Submissions from "./pages/Submissions";
import Progress from "./pages/Progress";
import Navbar from "./components/Navbar";
import ContestPage from "./pages/ContestPage";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
        <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
        <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
        <Route path="/submissions" element={isAuthenticated ? <Submissions /> : <Navigate to="/login" />} />
        <Route path="/progress" element={isAuthenticated ? <Progress /> : <Navigate to="/login" />} />
        <Route path="/contests" element={<ContestPage />} />
        <Route path="/contest/:id" element={isAuthenticated ? <ContestPage /> : <Navigate to="/login" />} />
        <Route path="/contest/:id/leaderboard" element={<ContestPage />} />
      </Routes>
    </div>
  </>
  );
}

export default App;