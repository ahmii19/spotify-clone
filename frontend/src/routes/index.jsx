import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Home = lazy(() => import('../pages/Home'));
const Search = lazy(() => import('../pages/Search'));
const Library = lazy(() => import('../pages/Library'));
const LikedSongs = lazy(() => import('../pages/LikedSongs'));
const PlaylistDetails = lazy(() => import('../pages/PlaylistDetails'));
const ArtistDetails = lazy(() => import('../pages/ArtistDetails'));
const AlbumDetails = lazy(() => import('../pages/AlbumDetails'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const UploadSong = lazy(() => import('../pages/admin/UploadSong'));
const ManageSongs = lazy(() => import('../pages/admin/ManageSongs'));
const ManageArtists = lazy(() => import('../pages/admin/ManageArtists'));
const ManageAlbums = lazy(() => import('../pages/admin/ManageAlbums'));
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'));
const ManagePlaylists = lazy(() => import('../pages/admin/ManagePlaylists'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="liked-songs" element={<LikedSongs />} />
            <Route path="playlist/:id" element={<PlaylistDetails />} />
            <Route path="artist/:id" element={<ArtistDetails />} />
            <Route path="album/:id" element={<AlbumDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="upload-song" element={<UploadSong />} />
            <Route path="manage-songs" element={<ManageSongs />} />
            <Route path="artists" element={<ManageArtists />} />
            <Route path="albums" element={<ManageAlbums />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="playlists" element={<ManagePlaylists />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
