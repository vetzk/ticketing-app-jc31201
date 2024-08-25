import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { categories } from './api'; // Assume this API function fetches categories

type FormData = {
  title: string;
  description: string;
  totalSeats: number;
  categoryId: string;
  price: number;
  image: FileList;
  locationId: string;
  ticketType: 'paid' | 'free';
  startTime: string;
  endTime: string;
};

const PostEvent: React.FC = () => {
  const { control, handleSubmit, register, setValue, formState: { errors } } = useForm<FormData>();
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [ticketType, setTicketType] = useState<'paid' | 'free'>('free');
  const history = useHistory();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category'); // Adjust API endpoint as necessary
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('totalSeats', data.totalSeats.toString());
    formData.append('categoryId', data.categoryId);
    formData.append('price', data.price.toString());
    formData.append('image', data.image[0]);
    formData.append('locationId', data.locationId);
    formData.append('ticketType', data.ticketType);
    formData.append('startTime', data.startTime);
    formData.append('endTime', data.endTime);

    try {
      await axios.post('/api/event', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      history.push('/events'); // Redirect after successful post
    } catch (error) {
      console.error('Error posting event:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Post New Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            )}
            rules={{ required: 'Title is required' }}
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            )}
            rules={{ required: 'Description is required' }}
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Total Seats</label>
          <Controller
            name="totalSeats"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            )}
            rules={{ required: 'Total seats are required', min: 1 }}
          />
          {errors.totalSeats && <p className="text-red-600 text-sm">{errors.totalSeats.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <select {...field} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            rules={{ required: 'Category is required' }}
          />
          {errors.categoryId && <p className="text-red-600 text-sm">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ticket Type</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                value="paid"
                checked={ticketType === 'paid'}
                onChange={() => setTicketType('paid')}
              />
              Paid
            </label>
            <label>
              <input
                type="radio"
                value="free"
                checked={ticketType === 'free'}
                onChange={() => setTicketType('free')}
              />
              Free
            </label>
          </div>
        </div>

        {ticketType === 'paid' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              )}
              rules={{ required: 'Price is required for paid events' }}
            />
            {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            {...register('image', { required: 'Image is required' })}
            className="mt-1 block w-full"
          />
          {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location ID</label>
          <Controller
            name="locationId"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            )}
            rules={{ required: 'Location ID is required' }}
          />
          {errors.locationId && <p className="text-red-600 text-sm">{errors.locationId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="datetime-local"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            )}
            rules={{ required: 'Start time is required' }}
          />
          {errors.startTime && <p className="text-red-600 text-sm">{errors.startTime.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="datetime-local"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            )}
            rules={{ required: 'End time is required' }}
          />
          {errors.endTime && <p className="text-red-600 text-sm">{errors.endTime.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Post Event
        </button>
      </form>
    </div>
  );
};

export default PostEvent;
