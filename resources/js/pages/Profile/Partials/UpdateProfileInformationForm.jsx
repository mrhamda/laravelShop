import FileInputMe from '@/Components/FileInputMe.jsx';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Textarea, Transition } from '@headlessui/react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [locations, setLocations] = useState([]);

    const { data, setData, errors, processing, recentlySuccessful, setError, clearErrors } = useForm({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        postalcode: user.postalcode,
        closestService: user.closestService,
    });

    // const imgPath = `/storage/avatars/${imgPathPlural[imgPathPlural.length - 1]}`;

    const submit = (e) => {
        e.preventDefault();

        clearErrors();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('bio', data.bio);
        formData.append('id', user.id);
        formData.append('postalcode', data.postalcode);
        formData.append('closestService', data.closestService);

        if (typeof data.avatar === 'string') {
            formData.append('avatarString', data.avatar);
        } else {
            formData.append('avatar', data.avatar);
        }

        formData.append('_method', 'patch'); // spoof PATCH method

        router.post(route('profile.update'), formData, {
            forceFormData: true,
            onSuccess: () => console.log('Profile updated!'),
            onError: (e) => {
                setError(e);
            },
        });
    };

    const fetchLocations = async () => {
        if (!data.postalcode) return;

        const response = await fetch(
            `https://api2.postnord.com/rest/businesslocation/v1/servicepoint/findNearestByAddress.json?countryCode=SE&postalCode=${data.postalcode}&apikey=YOUR_API_KEY`,
        );
        const data = await response.json();

        if (data && data.servicePointInformationResponse?.servicePoints) {
            setLocations(data.servicePointInformationResponse.servicePoints);
        }
    };

    // useEffect(() => {
    //     fetchLocations();
    // }, [data.postalcode]);

    return (
        <section className={className}>
            {flash.success && (
                <div className="mb-4 mt-4 rounded bg-green-400 p-4 text-xl font-bold text-green-700 opacity-70 shadow">{flash.success}</div>
            )}

            {/* <div className="flex justify-center">
                <img className="mb-5 h-[10rem] w-[12rem] rounded-full" src={imgPath} alt="" />
            </div> */}
            <header className="">
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">Update your account's profile information and email address.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="bio" />

                    <Textarea
                        id="bio"
                        name="bio"
                        className="mt-1 block h-[10em] w-full rounded-lg border-gray-300 p-4"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        isFocused
                        autoComplete="bio"
                    ></Textarea>

                    <InputError className="mt-2" message={errors.bio} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="postalcode" value="Enter your Postal Code" />

                    <TextInput
                        id="postalcode"
                        type="text"
                        name="postalcode"
                        value={data.postalcode}
                        className="mt-1 block w-full"
                        autoComplete="postalcode"
                        onChange={(e) => setData('postalcode', e.target.value)}
                        required
                        inputMode="numeric"
                        pattern="[0-9]{5}"
                        maxLength="5"
                        placeholder="e.g. 12345"
                    />

                    <InputError message={errors.postalcode} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="postalcode" value="Enter the place where you want to recieve your orders" />

                    <select
                        value={data.closestService}
                        name="closestService"
                        onChange={(e) => {
                            setData('closestService', e.target.value);
                        }}
                        className="mt-4 w-full rounded border p-2"
                    >
                        <option value="test" key={'test'}>
                            Test
                        </option>

                        <option value="test2" key={'test2'}>
                            Test2
                        </option>

                        {locations.map((loc) => (
                            <option
                                key={loc.deliveryAddress.streetName + loc.servicePointId}
                                value={loc.deliveryAddress.streetName + loc.servicePointId}
                            >
                                {loc.name} — {loc.deliveryAddress.streetName} {loc.deliveryAddress.streetNumber}, {loc.city}
                            </option>
                        ))}
                    </select>

                    <InputError message={errors.closestService} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="avatar" value="Avatar" />

                    <FileInputMe
                        id="avatar"
                        name="avatar"
                        value={data.avatar}
                        className="mt-1 block w-full"
                        autoComplete="avatar"
                        onChange={(e) => setData('avatar', e.target.files[0])}
                    />

                    <InputError message={errors.avatar} className="mt-2" />
                </div>
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
