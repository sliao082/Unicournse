import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App'
import HomePage from './components/HomePage/HomePage'
import BrowsePage from './components/BrowsePage/BrowsePage'
import BrowseSubject from './components/BrowseSubject/BrowseSubject';
import BrowseCourse from './components/BrowseCourse/BrowseCourse';
import BrowseSection from './components/BrowseSection/BrowseSection';
import UserPage from './components/UserPage/UserPage';
import UserProfile from './components/UserProfile/UserProfile';
import UserSchedule from './components/UserSchedule/UserSchedule';
import UserComments from './components/UserComments/UserComments';
import UserSettings from './components/UserSettings/UserSettings';
import ErrorBoundary from './ErrorBoundary';

import './index.css'

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
						<Route path="subject/:subj/:code/:sect" element={<BrowseSection />} />
					</Route>
					<Route path="/user" element={<UserPage />}>
						<Route path=":id/profile" element={<UserProfile />} />
						<Route path=":id/schedule" element={<UserSchedule />} />
						<Route path=":id/comments" element={<UserComments />} />
						<Route path=":id/coursemates" element={<UserProfile />} />
						<Route path=":id/settings" element={<UserSettings />} />
					</Route>
					{/* <Route path="*" element={<HomePage />} /> */}
					{/* <Route path="dashboard" element={<Dashboard />}>
						<Route index element={<RecentActivity />} />
						<Route path="project/:id" element={<Project />} />
					</Route> */}
				</Routes>
			</ErrorBoundary>
		</BrowserRouter>
	</StrictMode>,
)