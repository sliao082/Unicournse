import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App'
import HomePage from './components/HomePage/HomePage'
import BrowsePage from './components/BrowsePage/BrowsePage'
import BrowseSubject from './components/BrowseSubject/BrowseSubject';
import BrowseCourse from './components/BrowseCourse/BrowseCourse';
import BrowseDetails from './components/BrowseDetails/BrowseDetails';
import UserPage from './components/UserPage/UserPage';
import UserProfile from './components/UserProfile/UserProfile';
import UserSchedule from './components/UserSchedule/UserSchedule';
import UserComments from './components/UserComments/UserComments';
import UserCoursemates from './components/UserCoursemates/UserCoursemates';
import UserSettings from './components/UserSettings/UserSettings';
import RegisterPage from './components/RegisterPage/RegisterPage'
import RegisterLogin from './components/RegisterLogin/RegisterLogin'
import RegisterSignup from './components/RegisterSignup/RegisterSignup'
import GenedPage from './components/GenedPage/GenedPage';
import ErrorBoundary from './ErrorBoundary';

import './index.css'
import './App.css'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<ErrorBoundary>
				<App />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/browse" element={<BrowsePage />}>
						<Route index element={<BrowseSubject />} />
						<Route path="subject/:subj" element={<BrowseCourse />} />
						<Route path="subject/:subj/:code/" element={<BrowseDetails />} />
					</Route>
					<Route path="/user" element={<UserPage />}>
						<Route path=":id/profile" element={<UserProfile />} />
						<Route path=":id/schedule" element={<UserSchedule />} />
						<Route path=":id/comments" element={<UserComments />} />
						<Route path=":id/coursemates" element={<UserCoursemates />} />
						<Route path=":id/settings" element={<UserSettings />} />
					</Route>
					<Route path="/register" element={<RegisterPage />}>
						<Route path="login" element={<RegisterLogin />} />
						<Route path="signup" element={<RegisterSignup />} />
					</Route>
					<Route path="/gened" element={<GenedPage />} />
					{/* <Route path="*" element={<HomePage />} /> */}
				</Routes>
			</ErrorBoundary>
		</BrowserRouter>
	</StrictMode>,
)