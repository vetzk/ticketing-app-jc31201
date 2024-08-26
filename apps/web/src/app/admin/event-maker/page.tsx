'use client';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import { Textarea } from '@/components/ui/textarea';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import withRole from '@/hoc/roleGuard';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import { toast, ToastContainer } from 'react-toastify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface IEventMakerProps {}

const EventMaker: React.FunctionComponent<IEventMakerProps> = (props) => {
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [price, setPrice] = React.useState<number>(0);
  const [location, setLocation] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');
  const [ticketType, setTicketType] = React.useState<string>('');
  const [seat, setSeat] = React.useState<number>(0);
  const [images, setImages] = React.useState<File[]>([]);
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const token = localStorage.getItem('token');

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const newUrls = newImages.map((image) => URL.createObjectURL(image));

      setImages([...images, ...newImages]);
      setImageUrls([...imageUrls, ...newUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]);

    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', String(price));
      formData.append('startTime', startDate?.toISOString() || '');
      formData.append('endTime', endDate?.toISOString() || '');
      formData.append('category', category);
      formData.append('seat', String(seat));
      formData.append('location', location);
      formData.append('ticketType', ticketType);
      if (images) {
        images.forEach((image) => {
          formData.append('eve', image);
        });
      }

      const { data } = await apiCall.post('/api/admin/events', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: (data) => {
      toast('Success adding your event');
      console.log(data);
    },
    onError: (error: any) => {
      toast('error adding your event');
      console.log(error.message);
    },
  });

  const handleSubmitEvent = () => {
    mutation.mutate();
  };

  return (
    <div className="flex flex-col lg:flex-row mb-16">
      {/* Sidebar */}

      <AdminSidebar />
      <ToastContainer />
      <div className="flex-1 p-5 lg:ml-[30rem]">
        <div className="w-full flex flex-col justify-center gap-5 items-start h-auto">
          {/* Header */}
          <div className="w-full">
            <p className="text-2xl">Your Event</p>
            <p className="text-slate-500">
              Create your dream event here to inspire others
            </p>
          </div>
          <div className="w-full h-0.5 bg-slate-200"></div>

          {/* Image Upload */}
          <div className="w-full p-10 flex flex-col lg:flex-row justify-between items-center">
            <div className="w-full flex flex-col gap-5 items-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
                id="image-upload"
              />
              <Button
                onClick={triggerFileInput}
                className="bg-slate-400 text-xl"
              >
                Upload Picture
              </Button>

              <div className="flex justify-between items-center gap-2 flex-wrap">
                {images.map((image, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <Image
                      src={URL.createObjectURL(image)}
                      layout="responsive"
                      width={128}
                      height={128}
                      objectFit="cover"
                      className="rounded-xl"
                      alt="uploaded image"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 p-1 bg-red-500 rounded-full h-6 w-6 text-white flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Details Form */}
          <div className="flex flex-col gap-5 w-full">
            <div className="w-full">
              <Label className="text-xl">Title</Label>
              <Input
                type="text"
                value={title}
                placeholder="Event title"
                onChange={(e) => setTitle(e.target.value)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
            <div className="w-full">
              <Label className="text-xl">Description</Label>
              <Textarea
                placeholder="Event Description"
                onChange={(e) => setDescription(e.target.value)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
            <div className="w-full">
              <Label className="text-xl">Price</Label>
              <Input
                type="number"
                disabled={ticketType === 'FREE'}
                placeholder="Event price"
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
            <div className="w-full">
              <Label className="text-xl">Location</Label>
              <Input
                type="text"
                placeholder="Event location"
                onChange={(e) => setLocation(e.target.value)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
            <div className="w-full">
              <Label className="text-xl">Ticket Type</Label>
              <Select onValueChange={(value) => setTicketType(value)}>
                <SelectTrigger className="w-full border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0">
                  <SelectValue placeholder="Select Ticket Type" />
                </SelectTrigger>
                <SelectContent className="bg-white text-2xl">
                  <SelectItem value="FREE" className="text-2xl">
                    Free
                  </SelectItem>
                  <SelectItem value="PAID" className="text-2xl">
                    Paid
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full flex flex-col">
              <Label className="text-xl">Start Time</Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
            <div className="w-full flex flex-col">
              <Label className="text-xl">End Time</Label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
            <div className="w-full">
              <Label className="text-xl">Seat Capacity</Label>
              <Input
                type="number"
                placeholder="Available seats"
                onChange={(e) => setSeat(parseInt(e.target.value))}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="sticky bottom-0 right-0 w-full bg-slate-50 flex justify-end items-end p-3 rounded-xl">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="text-2xl w-full h-16 rounded-2xl bg-blue-300">
                  Create Event
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl">
                    Are you sure you want to create event?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xl">
                    This will create your event.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-red-500">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-slate-300"
                    onClick={handleSubmitEvent}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRole(EventMaker, 'ADMIN');
