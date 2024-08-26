'use client';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import apiCall from '@/helper/apiCall';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import * as React from 'react';
import { CiCalendarDate, CiClock1 } from 'react-icons/ci';
import { FiMapPin } from 'react-icons/fi';
import { CiFacebook, CiInstagram } from 'react-icons/ci';
import { RiTwitterXFill } from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlinePriceChange } from 'react-icons/md';
import { UserContext } from '@/contexts/UserContext';
import withRole from '@/hoc/roleGuard';

interface IEventDetailsProps {
  params: {
    id: string;
  };
}

const EventDetails: React.FunctionComponent<IEventDetailsProps> = ({
  params,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [showQuantity, setShowQuantity] = React.useState<boolean>(false);
  const [quantity, setQuantity] = React.useState<number>(0);
  const token = localStorage.getItem('token');
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  console.log(token);
  const { data, isError, isLoading } = useQuery({
    queryKey: ['event-details'],
    queryFn: async () => {
      const { data } = await apiCall.get(`/api/admin/events?id=${params.id}`);
      console.log(data.result);

      return data.result;
    },
  });

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.images.length - 1 : prevIndex - 1,
    );
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.post(
        `/api/transaction/event?id=${params.id}`,
        { qty: quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      toast('Success to add your transaction');
      console.log(data.result);

      // setCart({
      //   orderCode: data.result.orderCode,
      //   total: data.result.total,
      //   totalDiscount: data.result.totalDiscount,
      //   qty: data.result.qty,
      //   event: {
      //     title: data.result.event.title,
      //     price: data.result.event.price,
      //     images: { path: data.result.event.images[0].path },
      //   },
      // });
      // sessionStorage.setItem('cart', data..result.orderCode);
      //
      router.replace(`/transaction/${data.result.orderCode}`);
    },
    onError: (error) => {
      console.log(error);
      toast('Cannot add your transaction');
    },
  });

  const handleTransaction = () => {
    mutation.mutate();
  };

  if (isLoading) {
    return <Loading duration={500} />;
  }

  if (isError) {
    return <p>Failed to load event details.</p>;
  }
  return (
    <div className="w-full h-auto flex flex-col justify-center items-center mb-16">
      <ToastContainer />
      <div className="w-[90%] lg:w-[80%] flex flex-col lg:flex-row p-5 lg:p-10 gap-5 lg:gap-10 mt-5 lg:mt-10">
        <div className="w-full lg:w-[60%] flex flex-col gap-5 lg:gap-10">
          <div className="w-full min-h-[40vh] relative">
            <Image
              src={
                data.images.length > 0
                  ? `http://localhost:8000${data.images[currentIndex].path}`
                  : '/blackpink.webp'
              }
              fill
              alt={`image-${currentIndex}`}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button
              disabled={data.images.length <= 1}
              onClick={prevImage}
              className="bg-gray-300 text-gray-800 px-3 lg:px-4 py-1 lg:py-2 rounded-xl"
            >
              Previous
            </Button>
            <Button
              onClick={nextImage}
              disabled={data.images.length <= 1}
              className="bg-gray-300 text-gray-800 px-3 lg:px-4 py-1 lg:py-2 rounded-xl"
            >
              Next
            </Button>
          </div>
          <div
            className={
              data.images.length <= 1
                ? 'hidden'
                : 'flex justify-center gap-2 lg:gap-4 mt-4 lg:mt-6'
            }
          >
            {data.images.map((img: any, index: number) => (
              <div
                key={index}
                className={`relative w-16 h-16 lg:w-20 lg:h-20 cursor-pointer border-2 ${
                  currentIndex === index
                    ? 'border-slate-500'
                    : 'border-transparent'
                } rounded-lg overflow-hidden`}
                onClick={() => selectImage(index)}
              >
                <Image
                  src={`http://localhost:8000${img.path}`}
                  fill
                  alt={`preview-${index}`}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:gap-10 text-lg lg:text-xl shadow-2xl rounded-xl p-5 lg:p-10">
          <p className="text-2xl lg:text-3xl">{data.title}</p>
          <div className="flex items-center gap-3 lg:gap-5">
            <CiCalendarDate className="text-xl lg:text-2xl" />
            <p>
              {new Date(data.startTime).getDate()}-
              {new Date(data.endTime).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3 lg:gap-5">
            <CiClock1 className="text-xl lg:text-2xl" />
            <p>07.00 - 18.00</p>
          </div>
          <div className="flex items-center gap-3 lg:gap-5">
            <FiMapPin className="text-xl lg:text-2xl" />
            <p>{data.location.locationName}</p>
          </div>
          <div className="flex items-center gap-3 lg:gap-5">
            <MdOutlinePriceChange className="text-xl lg:text-2xl" />
            <p>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(data.price)}
            </p>
          </div>
          <div className="h-0.5 w-full bg-slate-200 mt-10 lg:mt-16"></div>
          <div>
            <p>Organized By</p>
            <p className="font-bold">
              {data.user.userprofile[0].firstName}{' '}
              {data.user.userprofile[0].lastName}
            </p>
          </div>
        </div>
      </div>
      <div className="w-[90%] lg:w-[80%] flex flex-col lg:flex-row p-5 lg:p-10 gap-5 lg:gap-10">
        <div className="w-full lg:w-[60%] flex flex-col gap-5 lg:gap-10">
          <div className="w-full min-h-[50vh] flex flex-col gap-5 lg:gap-5">
            <div>
              <p className="text-base lg:text-xl">{data.description}</p>
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl mb-5 lg:mb-10 font-bold">
                Terms and Conditions
              </h1>
              <p className="text-base lg:text-xl">
                Welcome to Eventgarde! These terms and conditions outline the
                rules and regulations for the use of our website and the
                services we provide. By accessing or using our website, you
                agree to be bound by these terms. If you do not agree with these
                terms, please do not use our website.
                <br />
              </p>
              <h1 className="text-lg lg:text-2xl my-5 lg:my-10 font-bold">
                1. Introduction
              </h1>
              <p className="text-base lg:text-xl">
                These Terms and Conditions govern your use of our website
                located at [website URL] and our services related to event
                ticketing, registration, and information. The term “we,” “us,”
                or “our” refers to [Your Event Website Name]. The term “you”
                refers to the user or viewer of our website.
              </p>
              <h1 className="text-2xl my-10">
                <strong>2. User Accounts</strong>{' '}
              </h1>
              <p className="text-xl">
                You may be required to create an account to purchase tickets,
                register for events, or access certain features of the website.
                You are responsible for maintaining the confidentiality of your
                account information, including your password. You agree to
                provide accurate and up-to-date information during the
                registration process and to update such information as needed.
              </p>
              <h1 className="text-2xl my-10">
                <strong>3. Event Tickets and Registration</strong>
              </h1>
              <p className="text-xl">
                All ticket purchases and event registrations are final unless
                otherwise stated in the event details or as required by
                applicable law. We are not responsible for any changes to the
                event, including cancellations, rescheduling, or changes to the
                venue. Tickets may be non-transferable or subject to additional
                restrictions as specified by the event organizer.
              </p>
              <h1 className="text-2xl my-10">
                <strong> 4. Refunds and Cancellations</strong>
              </h1>
              <p className="text-xl">
                Refunds are subject to the event organizer&apos;s refund policy.
                Please review the specific refund policy for each event before
                purchasing tickets. If an event is canceled or rescheduled, we
                will notify you via the contact information provided during your
                registration or ticket purchase. Refunds, if applicable, will be
                issued according to the event organizer&apos;s policy.
              </p>
              <h1 className="text-2xl my-10">
                <strong>5. User Conduct</strong>
              </h1>
              <p className="text-xl">
                By using our website, you agree to: Respect other users and
                refrain from using offensive, defamatory, or inappropriate
                language. Not engage in any unlawful activities or violate any
                applicable laws and regulations. Not attempt to interfere with
                the proper functioning of the website, including hacking or
                introducing harmful code.
              </p>
              <h1 className="text-2xl my-10">
                <strong>6. Intellectual Property Rights</strong>
              </h1>
              <p className="text-xl">
                All content on this website, including text, graphics, logos,
                and images, is the property of [Your Event Website Name] or its
                content suppliers and is protected by applicable intellectual
                property laws. You are not permitted to reproduce, distribute,
                or otherwise use any content from the website without our
                express written consent.
              </p>
              <h1 className="text-2xl my-10">
                <strong>7. Limitation of Liability</strong>
              </h1>
              <p className="text-xl">
                We do not guarantee that the website will be error-free, secure,
                or uninterrupted. We are not responsible for any indirect,
                incidental, or consequential damages that may arise from your
                use of the website, including loss of data, profit, or revenue.
                In no event shall our liability exceed the total amount paid by
                you for the relevant event or service.
              </p>
              <h1 className="text-2xl my-10">
                <strong>8. Privacy Policy</strong>
              </h1>
              <p className="text-xl">
                Please review our [Privacy Policy] [Link to Privacy Policy] to
                understand how we collect, use, and protect your personal
                information.
              </p>
              <h1 className="text-2xl my-10">
                <strong>9. Changes to Terms and Conditions</strong>
              </h1>
              <p className="text-xl">
                We reserve the right to update or modify these Terms at any
                time. Changes will be effective immediately upon posting on our
                website. It is your responsibility to review these Terms
                periodically for updates.
              </p>
              <h1 className="text-2xl my-10">
                <strong>10. Governing Law</strong>
              </h1>
              <p className="text-xl">
                These Terms are governed by and construed in accordance with the
                laws of [Your Jurisdiction], without regard to its conflict of
                law principles.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="sticky top-40 flex flex-col gap-5 text-xl">
            <div className="w-full rounded-xl shadow-2xl p-5">
              {!showQuantity ? (
                <Button
                  onClick={() => setShowQuantity(true)}
                  disabled={user?.role === 'ADMIN'}
                  className="bg-green-400 w-full text-xl"
                >
                  Buy Ticket
                </Button>
              ) : (
                <div className="flex flex-col gap-4">
                  <input
                    type="number"
                    min={1}
                    placeholder="Enter Quantity"
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border rounded-md p-2 w-full"
                  />
                  <Button
                    onClick={handleTransaction}
                    className="bg-green-500 w-full text-xl"
                  >
                    Buy Ticket
                  </Button>
                  <Button
                    onClick={() => setShowQuantity(false)}
                    className="bg-red-500 w-full text-xl"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <p>Share this event</p>
            <div className="flex w-full gap-5">
              <div className="rounded-full p-2 border-solid border border-slate-400">
                <CiFacebook size={30} />
              </div>
              <div className="rounded-full p-2 border-solid border border-slate-400">
                <CiInstagram size={30} />
              </div>
              <div className="rounded-full p-2 border-solid border border-slate-400">
                <RiTwitterXFill size={30} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRole(EventDetails, 'USER');
