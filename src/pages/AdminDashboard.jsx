
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import AdminUsers from './admin/AdminUsers';
import AdminHotels from './admin/AdminHotels';
import AdminRooms from './admin/AdminRooms';
import AdminBookings from './admin/AdminBookings';
import AdminModerators from './admin/AdminModerators';

const AdminDashboard = () => {
  const { state } = useAuth();
  const { user, loading } = state;
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({
    users: 0,
    hotels: 0,
    rooms: 0,
    bookings: 0,
    revenue: 0
  });

  useEffect(() => {
    // Fetch dashboard statistics
    if (user?.isAdmin) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // This would be an API call in a real application
      // Simulated data for now
      setStats({
        users: 120,
        hotels: 15,
        rooms: 85,
        bookings: 230,
        revenue: 48750
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-hotel-500" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage all aspects of your hotel system.</p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline">Export Data</Button>
              <Button className="bg-hotel-500 hover:bg-hotel-600">System Settings</Button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-muted-foreground">Total Users</h3>
              <p className="text-3xl font-bold">{stats.users}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-muted-foreground">Hotels</h3>
              <p className="text-3xl font-bold">{stats.hotels}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-muted-foreground">Rooms</h3>
              <p className="text-3xl font-bold">{stats.rooms}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-muted-foreground">Bookings</h3>
              <p className="text-3xl font-bold">{stats.bookings}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-muted-foreground">Revenue</h3>
              <p className="text-3xl font-bold">${stats.revenue}</p>
            </div>
          </div>
          
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-6"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="moderators">Moderators</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <AdminUsers />
            </TabsContent>
            
            <TabsContent value="hotels" className="space-y-4">
              <AdminHotels />
            </TabsContent>
            
            <TabsContent value="rooms" className="space-y-4">
              <AdminRooms />
            </TabsContent>
            
            <TabsContent value="bookings" className="space-y-4">
              <AdminBookings />
            </TabsContent>
            
            <TabsContent value="moderators" className="space-y-4">
              <AdminModerators />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
