import { forwardRef, useImperativeHandle, useRef } from 'react';

import CartItemOne from './cart-item-one';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, user, allItems = [], ...props }, ref) {
    // ost, quantity, name, imgUrl

    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    return (
        <div
            {...props}
            name={name}
            ref={localRef}
            className={'absolute right-0 mr-10 flex h-[50rem] w-[15rem] justify-end sm:w-[25rem] ' + className}
        >
            <div className="light:border-gray-700 light:bg-gray-800 z-10 mt-4 w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                    <h5 className="light:text-white text-xl font-bold leading-none text-gray-900">Orders</h5>
                    <a href={route('posts.view')} className="light:text-blue-500 text-sm font-medium text-blue-600 hover:underline">
                        View all
                    </a>
                </div>

                <div className="flow-root">
                    <ul role="list" className="light:divide-gray-700 divide-y divide-gray-200">
                        {allItems.map((item) => (
                            <CartItemOne
                                key={item.id}
                                cost={item.cost}
                                quantity={item.quantity}
                                user={user}
                                name={item.name}
                                image={`/storage/${item.img}`}
                                id={item.id}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
});
