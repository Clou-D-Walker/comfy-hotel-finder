
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Calendar, Users, DollarSign } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const SearchForm = ({ onSearch, defaultValues }) => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
    minPrice: 0,
    maxPrice: 1000
  });
  
  useEffect(() => {
    // Load default values if provided
    if (defaultValues) {
      setSearchParams(prev => ({
        ...prev,
        ...defaultValues
      }));
    }
    
    // Load from localStorage if available
    const savedSearch = localStorage.getItem('searchCriteria');
    if (savedSearch) {
      try {
        const parsed = JSON.parse(savedSearch);
        setSearchParams(prev => ({
          ...prev,
          ...parsed,
          checkIn: parsed.checkIn ? new Date(parsed.checkIn) : null,
          checkOut: parsed.checkOut ? new Date(parsed.checkOut) : null
        }));
      } catch (error) {
        console.error('Error parsing saved search:', error);
      }
    }
  }, [defaultValues]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (range) => {
    setSearchParams(prev => ({
      ...prev,
      checkIn: range?.from,
      checkOut: range?.to
    }));
  };
  
  const handleGuestsChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSearchParams(prev => ({
        ...prev,
        guests: value
      }));
    }
  };
  
  const handlePriceChange = (value) => {
    setSearchParams(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
    
    // Save to localStorage for later use
    localStorage.setItem('searchCriteria', JSON.stringify(searchParams));
    localStorage.setItem('searchGuests', searchParams.guests);
  };
  
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="space-y-1">
        <Label htmlFor="city">Destination</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="city"
            name="city"
            value={searchParams.city}
            onChange={handleInputChange}
            placeholder="Where are you going?"
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <Label>Dates</Label>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                {searchParams.checkIn && searchParams.checkOut ? (
                  <>
                    {searchParams.checkIn.toLocaleDateString()} - {searchParams.checkOut.toLocaleDateString()}
                  </>
                ) : (
                  <span>Select dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePickerWithRange 
                date={{
                  from: searchParams.checkIn,
                  to: searchParams.checkOut
                }}
                onDateChange={handleDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="guests">Guests</Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="guests"
            name="guests"
            type="number"
            min="1"
            value={searchParams.guests}
            onChange={handleGuestsChange}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <Label>Price Range</Label>
        <div className="px-3">
          <Slider
            defaultValue={[searchParams.minPrice, searchParams.maxPrice]}
            value={[searchParams.minPrice, searchParams.maxPrice]}
            max={1000}
            step={10}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>${searchParams.minPrice}</span>
            <span>${searchParams.maxPrice}+</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-end">
        <Button type="submit" className="w-full bg-hotel-500 hover:bg-hotel-600">
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
