
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, Hotel, Users, Briefcase, BedDouble } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { moderatorAPI, bookingAPI, roomAPI } from '@/services/api';
import ModeratorRooms from './moderator/ModeratorRooms';
import ModeratorWorkers from './moderator/ModeratorWorkers';
import ModeratorBookings from './moderator/ModeratorBookings';

const ModeratorDashboard = () => {
  const { state } = useAuth();
  const { user, loading } = state;
  const [activeTab, setActiveTab] = useState('overview');
  const [moderatorData, setModeratorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalWorkers: 0,
    totalBookings: 0,
    pendingCleanings: 0
  });
  
  useEffect(() => {
    if (user?._id) {
      fetchModeratorData();
    }
  }, [user]);
  
  const fetchModeratorData = async () => {
    try {
      setIsLoading(true);
      const response = await moderatorAPI.getModeratorProfile(user._id);
      setModeratorData(response);
      
      // Fetch statistics for assigned hotels
      if (response.assignedHotels && response.assignedHotels.length > 0) {
        const hotelIds = response.assignedHotels.map(hotel => hotel._id);
        
        // Get total rooms count
        const roomsPromises = hotelIds.map(id => roomAPI.getRoomsForHotel(id));
        const roomsResults = await Promise.all(roomsPromises);
        const totalRooms = roomsResults.reduce((sum, rooms) => sum + (rooms?.length || 0), 0);
        
        // Get bookings count
        const bookingsPromises = hotelIds.map(id => bookingAPI.getHotelBookings(id));
        const bookingsResults = await Promise.all(bookingsPromises);
        const totalBookings = bookingsResults.reduce((sum, bookings) => sum + (bookings?.length || 0), 0);
        
        // Get pending cleanings count
        // In a real app, you would fetch this from a cleaning tasks endpoint
        const pendingCleanings = Math.floor(totalRooms * 0.3); // Simulated data
        
        // Get workers count - this would be fetched from the worker API in a real app
        const totalWorkers = response.assignedHotels.length * 3; // Simulated data
        
        setStats({
          totalRooms,
          totalWorkers,
          totalBookings,
          pendingCleanings
        });
      }
    } catch (error) {
      console.error("Error fetching moderator data:", error);
      toast.error("Failed to load your moderator profile");
      
      // Fallback to mock data for development/testing
      setModeratorData({
        _id: 'mod123',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        },
        assignedHotels: [
          {
            _id: 'hotel1',
            name: 'Grand Hotel',
            city: 'New York',
            rating: 4.5,
            cheapestPrice: 199,
            photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
          },
          {
            _id: 'hotel2',
            name: 'Seaside Resort',
            city: 'Miami',
            rating: 4.8,
            cheapestPrice: 299,
            photos: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
          }
        ]
      });
      
      setStats({
        totalRooms: 42,
        totalWorkers: 8,
        totalBookings: 126,
        pendingCleanings: 12
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-hotel-500" />
      </div>
    );
  }
  
  if (!user || (!user.isModerator && !user.isAdmin)) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Moderator Dashboard</h1>
              <p className="text-muted-foreground">Manage your assigned hotels, rooms, and workers</p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button className="bg-hotel-500 hover:bg-hotel-600">Generate Reports</Button>
            </div>
          </div>
          
          {moderatorData && moderatorData.assignedHotels?.length > 0 ? (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground text-sm">Assigned Hotels</p>
                        <h3 className="text-2xl font-bold">{moderatorData.assignedHotels.length}</h3>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Hotel className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Rooms</p>
                        <h3 className="text-2xl font-bold">{stats.totalRooms}</h3>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <BedDouble className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground text-sm">Workers</p>
                        <h3 className="text-2xl font-bold">{stats.totalWorkers}</h3>
                      </div>
                      <div className="bg-amber-100 p-3 rounded-full">
                        <Briefcase className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground text-sm">Bookings</p>
                        <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content Tabs */}
              <Tabs 
                defaultValue={activeTab} 
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-6"
              >
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                  <TabsTrigger value="workers">Workers</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Assigned Hotels</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {moderatorData.assignedHotels.map((hotel) => (
                      <Card key={hotel._id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video relative">
                          <img 
                            src={hotel.photos?.[0] || "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"} 
                            alt={hotel.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <h3 className="text-lg font-bold text-white">{hotel.name}</h3>
                            <p className="text-white/80 text-sm">{hotel.city}</p>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Rating</span>
                            <div className="flex items-center">
                              <span className="font-semibold mr-1">{hotel.rating?.toFixed(1)}</span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Price</span>
                            <span className="font-semibold">${hotel.cheapestPrice}/night</span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            className="w-full mt-2"
                            onClick={() => {
                              setActiveTab('rooms');
                            }}
                          >
                            Manage Rooms
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="rooms" className="space-y-4">
                  <ModeratorRooms hotels={moderatorData.assignedHotels} />
                </TabsContent>
                
                <TabsContent value="workers" className="space-y-4">
                  <ModeratorWorkers hotels={moderatorData.assignedHotels} />
                </TabsContent>
                
                <TabsContent value="bookings" className="space-y-4">
                  <ModeratorBookings hotels={moderatorData.assignedHotels} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-bold mb-4">No Hotels Assigned</h2>
              <p className="text-muted-foreground mb-8">
                You don't have any hotels assigned to manage yet. Contact the administrator to get hotel assignments.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ModeratorDashboard;
