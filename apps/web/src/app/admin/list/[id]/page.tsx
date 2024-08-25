'use client';
import { useEffect, useRef, useState } from 'react';
import Loading from '@/components/Loading';
import apiCall from '@/helper/apiCall';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/navigation';
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
import withRole from '@/hoc/roleGuard';

interface IEventUpdateDetailsProps {
  params: {
    id: string;
  };
}

const EventUpdateDetails: React.FunctionComponent<IEventUpdateDetailsProps> = ({
  params,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [location, setLocation] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [ticketType, setTicketType] = useState<string>('');
  const [seat, setSeat] = useState<number>(0);
  const [images, setImages] = useState<File[]>([]);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const token = localStorage.getItem('token');

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
        // Loop through the images array and append each file individually
        images.forEach((image) => {
          formData.append('eve', image); // 'eve' can be the field name you want
        });
      }

      const { data } = await apiCall.patch(
        `/api/admin/events?id=${params.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      toast('Success updating your event');
      console.log(data);
      setTimeout(() => {
        router.replace('/admin/list');
      }, 3000);
    },
    onError: (error: any) => {
      console.log(error);
      toast('Error updating your data');
    },
  });

  const handleSubmitEvent = () => {
    mutation.mutate();
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ['event-details'],
    queryFn: async () => {
      const { data } = await apiCall.get(`/api/admin/events?id=${params.id}`);
      console.log(data.result);

      return data.result;
    },
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setLocation(data.findLocation.locationName);
      setCategory(data.findCategory.categoryName);
      setSeat(data.findSeats.availableSeats);
      setTicketType(data.ticketType);
      setStartDate(new Date(data.startTime));
      setEndDate(new Date(data.endTime));
    }
  }, [data]);

  if (isLoading) {
    return <Loading duration={500} />;
  }

  if (isError) {
    return <p>Failed to load event details.</p>;
  }

  return (
    <div className="w-full flex p-10 ">
      <ToastContainer />
      <div className="w-full flex flex-col justify-center gap-5 items-start h-auto">
        <div className="w-full ">
          <p className="text-2xl">Your Event</p>
          <p className="text-slate-500">
            Update your event to adjust your dream to others
          </p>
        </div>
        <div className="w-full h-0.5 bg-slate-200"></div>
        <div className="w-full p-10 flex justify-between items-center">
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
            <Button onClick={triggerFileInput} className="bg-slate-400 text-xl">
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
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">Title</p>
          </div>
          <div className="w-full">
            <Input
              type="text"
              value={title}
              placeholder={data.title ? data.title : 'Event Title'}
              onChange={(e) => setTitle(e.target.value)}
              className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">Description</p>
          </div>
          <div className="w-full">
            <Textarea
              value={description}
              placeholder={
                data.description ? data.description : 'Event Description'
              }
              onChange={(e) => setDescription(e.target.value)}
              className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">Price</p>
          </div>
          <div className="w-full">
            <Input
              type="number"
              value={price}
              disabled={ticketType === 'FREE'}
              placeholder={data.price ? data.price : 'Event price'}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">Location</p>
          </div>
          <div className="w-full">
            <Input
              type="text"
              value={location}
              placeholder={
                data.findLocation.locationName
                  ? data.findLocation.locationName
                  : 'Event location'
              }
              onChange={(e) => setLocation(e.target.value)}
              className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">Ticket Type</p>
          </div>
          <div className="w-full">
            <Select
              value={ticketType}
              onValueChange={(value) => setTicketType(value)}
            >
              <SelectTrigger className="w-full border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0">
                <SelectValue
                  placeholder={
                    data.ticketType ? data.ticketType : 'Select Ticket Type'
                  }
                />
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
        </div>
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">Start Time</p>
          </div>
          <div className="w-full">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0 "
            />
          </div>
        </div>
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">End Time</p>
          </div>
          <div className="w-full">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0 "
            />
          </div>
        </div>
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">Category</p>
          </div>
          <div className="w-full">
            <Input
              type="text"
              value={category}
              placeholder={
                data.findCategory.categoryName
                  ? data.findCategory.categoryName
                  : 'Event category'
              }
              onChange={(e) => setCategory(e.target.value)}
              className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex-col flex w-full h-auto gap-5">
          <div className="w-full">
            <p className="text-xl">Available Seats</p>
          </div>
          <div className="w-full">
            <Input
              type="number"
              value={seat}
              placeholder={
                data.findSeats.availableSeats
                  ? data.findSeats.availableSeats
                  : 'Event seats'
              }
              onChange={(e) => setSeat(parseInt(e.target.value))}
              className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="sticky bottom-0 right-0 w-full bg-slate-50 flex justify-end items-end p-3 rounded-xl">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="text-2xl h-16 rounded-2xl  bg-blue-300">
                Update Event
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl">
                  Are you sure you want to update your event ?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xl">
                  This will update your event
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
  );
};

export default withRole(EventUpdateDetails, 'ADMIN');
