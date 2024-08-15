import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import apiCall from '@/helper/axiosInstance';

type EventFormProps = {
  event: Event | null;
  onSave: (event: Event) => void;
  onCancel: () => void;
  isDarkMode: boolean;
};

type Event = {
  id: number | null;
  title: string;
  start: string;
  end: string;
  paymentMethod: string;
  paymentCost: number;
  category: string;
  description: string;
  image: string;
  views: number;
  visitorsThisMonth: number;
  visitorsLastMonth: number;
  visitorsThisWeek: number;
  visitorsLastWeek: number;
  seatCapacity: number;
};

const categories = [
  'Bar-Night',
  'Music',
  'Study-Tour',
  'Marriage',
  'Travel',
];

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState<Event>({
    id: null,
    title: '',
    start: '',
    end: '',
    paymentMethod: 'Free',
    paymentCost: 0,
    category: 'Bar-Night',
    description: '',
    image: '',
    views: 0,
    visitorsThisMonth: 0,
    visitorsLastMonth: 0,
    visitorsThisWeek: 0,
    visitorsLastWeek: 0,
    seatCapacity: 100,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (event) {
      setFormData (event);
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle image upload
    let imageUrl = formData.image;
    if (imageFile) {
      const formDataImg = new FormData();
      formDataImg.append('file', imageFile);
      const { data } = await apiCall.post('/upload', formDataImg);
      imageUrl = data.filePath; // Adjust according to your API response
    }

    const updatedEvent = { ...formData, image: imageUrl };

    if (formData.id) {
      // Edit existing event
      const response = await apiCall.put(`/events/${formData.id}`, updatedEvent);
      onSave(response.data);
    } else {
      // Create new event
      const response = await apiCall.post('/events', updatedEvent);
      onSave(response.data);
    }
  };

  return (
    <div className={`p-4 shadow-md rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-4">
        {formData.id ? 'Edit Event' : 'Create Event'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="datetime-local"
            name="start"
            value={formData.start}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="datetime-local"
            name="end"
            value={formData.end}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium"> Payment Method </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="Free">Free</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Payment Cost</label>
          <input
            type="number"
            name="paymentCost"
            value={formData.paymentCost}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            disabled={formData.paymentMethod === 'Free'}
            required={formData.paymentMethod !== 'Free'}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Seat Capacity</label>
          <input
            type="number"
            name="seatCapacity"
            value={formData.seatCapacity}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit">
            {formData.id ? 'Save Changes' : 'Create Event'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
