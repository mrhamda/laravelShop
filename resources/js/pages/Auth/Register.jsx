import FileInputMe from '@/Components/FileInputMe.jsx';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        bio: 'Currently empty bio',
        avatar: null,
        postalcode: '',
        closestService: '',
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        formData.append('closestService', data.closestService);
        formData.append('postalcode', data.postalcode);

        formData.append('bio', data.bio);
        formData.append('avatar', data.avatar);

        post(route('register'), formData, {
            forceFormData: true,
        });
    };

    const [locations, setLocations] = useState([]);

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

    // post(route('register'), {
    //     // onFinish: () => reset('password', 'password_confirmation'),
    // });
    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
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

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
