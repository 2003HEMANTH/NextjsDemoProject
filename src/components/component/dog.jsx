'use client'
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"

export function Dog() {
  const [dogs, setDogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionRef = useRef(null);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch('https://freetestapi.com/api/v1/dogs')
      .then(response => response.json())
      .then(data => {
        // Remove duplicates based on name
        const uniqueDogs = Array.from(new Set(data.map(dog => dog.name)))
          .map(name => {
            return data.find(dog => dog.name === name);
          });
        setDogs(uniqueDogs);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Function to update suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filteredSuggestions = dogs
        .filter(dog => dog.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(dog => dog.name);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, dogs]);

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowResults(true);
    setSearchPerformed(true);
  };

  // Function to handle search
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      setShowResults(true);
      setSearchPerformed(true);
    }
  };

  // Function to close suggestion box when clicked outside
  const handleClickOutside = (event) => {
    if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Default popular dog
  const popularDog = {
    id: 0,
    name: 'Labrador Retriever',
    breed_group: 'Sporting',
    size: 'Large',
    lifespan: '10-14 years',
    origin: 'Canada',
    temperament: 'Outgoing, Even-tempered, Gentle',
    colors: ['Yellow', 'Black', 'Chocolate'],
    description: 'The Labrador Retriever is one of the most popular dog breeds in the world. They are known for their friendly and outgoing nature, as well as their intelligence and trainability. Labs make excellent family pets and are often used as service dogs and therapy dogs.',
    image: 'https://fakeimg.pl/500x500/cc6634'
  };

  return (
    <div className="max-w-2xl mx-auto my-8 relative">
      <div className="flex mb-4">
        <Input
          className="flex-1"
          placeholder="Search by name"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button className="ml-2" onClick={handleSearch}>Search</Button>
      </div>
      {suggestions.length > 0 && (
        <ul ref={suggestionRef} className="absolute z-10 w-full bg-white border rounded-t border-gray-200 mt-1">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="cursor-pointer py-1 px-4 hover:bg-gray-100 text-black" onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {!searchPerformed && (
        <Card key={popularDog.id} className="w-full mt-4">
          <CardHeader>
            <CardTitle>{popularDog.name}</CardTitle>
            <CardDescription>{popularDog.temperament}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row">
              <img
                alt={popularDog.name}
                className="w-full md:w-1/2 h-auto rounded-md mb-4 md:mb-0 md:mr-4"
                src={popularDog.image}
              />
              <div className="flex-1 space-y-4">
                <div>
                  <strong>Breed Group:</strong>
                  {popularDog.breed_group}
                </div>
                <div>
                  <strong>Size:</strong>
                  {popularDog.size}
                </div>
                <div>
                  <strong>Lifespan:</strong>
                  {popularDog.lifespan}
                </div>
                <div>
                  <strong>Origin:</strong>
                  {popularDog.origin}
                </div>
                <div>
                  <strong>Colors:</strong>
                  {popularDog.colors.join(', ')}
                </div>
                <p>{popularDog.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {showResults && (
        dogs
          .filter(dog => dog.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 1) // Only display the first matching dog
          .map(dog => (
            <Card key={dog.id} className="w-full mt-4">
              <CardHeader>
                <CardTitle>{dog.name}</CardTitle>
                <CardDescription>{dog.temperament}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row">
                  <img
                    alt={dog.name}
                    className="w-full md:w-1/2 h-auto rounded-md mb-4 md:mb-0 md:mr-4"
                    src={dog.image} />
                  <div className="flex-1 space-y-4">
                    <div>
                      <strong>Breed Group:</strong>
                      {dog.breed_group}
                    </div>
                    <div>
                      <strong>Size:</strong>
                      {dog.size}
                    </div>
                    <div>
                      <strong>Lifespan:</strong>
                      {dog.lifespan}
                    </div>
                    <div>
                      <strong>Origin:</strong>
                      {dog.origin}
                    </div>
                    <div>
                      <strong>Colors:</strong>
                      {dog.colors.join(', ')}
                    </div>
                    <p>{dog.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
      )}
    </div>
  );
}


